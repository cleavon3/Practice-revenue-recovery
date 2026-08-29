import { pdf } from "@react-pdf/renderer";

import RevenueReportPDF from "@/components/RevenueReportPDF";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CreateReportParams = {
  sessionId: string;
  lead: any;
};

const REPORT_BUCKET = "reports";

// Signed URL remains valid for 7 days.
const REPORT_URL_EXPIRY = 60 * 60 * 24 * 7;

export async function createReport({ sessionId, lead }: CreateReportParams) {
  try {
    console.log("📄 PDF DATA RECEIVED:", lead);

    /*
     * --------------------------------------------------
     * CALENDLY
     * --------------------------------------------------
     */

    const calendlyUrl =
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      "https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session";

    console.log("📅 CALENDLY URL:", calendlyUrl);

    /*
     * --------------------------------------------------
     * CREATE PDF
     * --------------------------------------------------
     */

    const document = RevenueReportPDF({
      data: lead,
      calendlyUrl,
    });

    const stream = await pdf(document).toBuffer();

    const chunks: Buffer[] = [];

    for await (const chunk of stream as any) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const pdfBuffer = Buffer.concat(chunks);

    console.log("📄 PDF BUFFER CREATED:", pdfBuffer.length);

    if (!pdfBuffer.length) {
      throw new Error("Generated PDF is empty");
    }

    /*
     * --------------------------------------------------
     * STORAGE PATH
     * --------------------------------------------------
     *
     * IMPORTANT:
     *
     * Bucket:
     * reports
     *
     * File:
     * {sessionId}.pdf
     *
     * There is NO "reports/" folder here.
     */

    const filePath = `${sessionId}.pdf`;

    console.log("☁️ UPLOADING PDF TO:", `${REPORT_BUCKET}/${filePath}`);

    /*
     * --------------------------------------------------
     * UPLOAD PDF
     * --------------------------------------------------
     */

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(REPORT_BUCKET)
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ PDF UPLOAD FAILED:", uploadError);

      throw new Error(`Could not upload PDF report: ${uploadError.message}`);
    }

    console.log("✅ PDF UPLOADED:", uploadData?.path || filePath);

    /*
     * --------------------------------------------------
     * VERIFY THE FILE EXISTS
     * --------------------------------------------------
     *
     * We do this before creating the URL.
     *
     * This prevents the database from being told that
     * a report exists when Storage does not actually
     * contain the file.
     */

    const { data: fileCheck, error: fileCheckError } =
      await supabaseAdmin.storage.from(REPORT_BUCKET).list("", {
        search: `${sessionId}.pdf`,
        limit: 10,
      });

    if (fileCheckError) {
      console.error("❌ PDF STORAGE VERIFICATION FAILED:", fileCheckError);

      throw new Error("Could not verify uploaded PDF");
    }

    const fileExists = fileCheck?.some(
      (file) => file.name === `${sessionId}.pdf`,
    );

    if (!fileExists) {
      console.error("❌ PDF NOT FOUND AFTER UPLOAD:", filePath);

      throw new Error("PDF upload could not be verified");
    }

    console.log("✅ PDF STORAGE VERIFIED:", filePath);

    /*
     * --------------------------------------------------
     * CREATE SIGNED URL
     * --------------------------------------------------
     */

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from(REPORT_BUCKET)
        .createSignedUrl(filePath, REPORT_URL_EXPIRY);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("❌ SIGNED URL CREATION FAILED:", signedUrlError);

      throw new Error("Could not create report URL");
    }

    const reportUrl = signedUrlData.signedUrl;

    console.log("✅ REPORT URL CREATED");

    /*
     * --------------------------------------------------
     * FINAL RESULT
     * --------------------------------------------------
     */

    console.log("✅ REPORT CREATION COMPLETE", {
      sessionId,
      filePath,
      pdfSize: pdfBuffer.length,
      reportUrlExists: true,
    });

    return {
      pdfBuffer,
      reportUrl,
      filePath,
    };
  } catch (error) {
    console.error("❌ PDF CREATION ERROR:", error);

    throw new Error("Could not create PDF report");
  }
}
