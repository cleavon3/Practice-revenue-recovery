import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

const REPORT_BUCKET = "reports";
const REPORT_URL_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Missing session ID",
        },
        {
          status: 400,
        },
      );
    }

    console.log("🔎 REPORT STATUS CHECK:", sessionId);

    /*
     * --------------------------------------------------
     * FIND LEAD
     * --------------------------------------------------
     */

    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .select(
        `
          practice_name,
          practice_type,
          report_purchased,
          report_generated,
          report_url,
          report_generated_at
        `,
      )
      .eq("session_id", sessionId)
      .single();

    if (leadError || !lead) {
      console.error("❌ REPORT STATUS LOOKUP FAILED:", leadError);

      return NextResponse.json(
        {
          error: "Report session not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * --------------------------------------------------
     * BASE RESPONSE DATA
     * --------------------------------------------------
     */

    const baseResponse = {
      practiceName: lead.practice_name,
      practiceType: lead.practice_type,
      reportPurchased: lead.report_purchased,
      reportGenerated: lead.report_generated,
      reportGeneratedAt: lead.report_generated_at,
    };

    /*
     * --------------------------------------------------
     * REPORT STILL BEING GENERATED
     * --------------------------------------------------
     */

    if (!lead.report_generated) {
      console.log("⏳ REPORT STILL BEING GENERATED:", sessionId);

      return NextResponse.json({
        ...baseResponse,

        reportUrl: null,

        reportReady: false,
      });
    }

    /*
     * --------------------------------------------------
     * REPORT URL ALREADY EXISTS
     * --------------------------------------------------
     *
     * If the database already contains a signed URL,
     * return it immediately.
     */

    if (lead.report_url) {
      console.log("✅ REPORT URL EXISTS:", sessionId);

      return NextResponse.json({
        ...baseResponse,

        reportUrl: lead.report_url,

        reportReady: true,
      });
    }

    /*
     * --------------------------------------------------
     * REPORT GENERATED BUT URL IS MISSING
     * --------------------------------------------------
     *
     * The PDF should exist at:
     *
     * Bucket:
     * reports
     *
     * Object:
     * {sessionId}.pdf
     *
     * IMPORTANT:
     * Do NOT use:
     *
     * reports/{sessionId}.pdf
     *
     * as the object path because "reports" is already
     * the bucket name.
     */

    const filePath = `${sessionId}.pdf`;

    console.log("⚠️ REPORT GENERATED BUT REPORT URL IS NULL:", sessionId);

    console.log("🔎 LOOKING FOR REPORT:", `${REPORT_BUCKET}/${filePath}`);

    /*
     * --------------------------------------------------
     * VERIFY FILE EXISTS
     * --------------------------------------------------
     */

    const folderPath = "";

    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(REPORT_BUCKET)
      .list(folderPath, {
        search: `${sessionId}.pdf`,
        limit: 10,
      });

    if (listError) {
      console.error("❌ COULD NOT CHECK REPORT STORAGE:", listError);
    }

    const fileExists = Boolean(
      files?.some((file) => file.name === `${sessionId}.pdf`),
    );

    console.log("📦 REPORT FILE EXISTS:", fileExists);

    /*
     * --------------------------------------------------
     * PDF DOES NOT EXIST
     * --------------------------------------------------
     */

    if (!fileExists) {
      console.error("❌ REPORT PDF DOES NOT EXIST IN STORAGE:", filePath);

      return NextResponse.json({
        ...baseResponse,

        reportUrl: null,

        reportReady: false,

        reportStorageError:
          "The report was marked as generated, but the PDF file could not be found in storage.",
      });
    }

    /*
     * --------------------------------------------------
     * CREATE NEW SIGNED URL
     * --------------------------------------------------
     */

    console.log("🔐 CREATING SIGNED URL:", filePath);

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from(REPORT_BUCKET)
        .createSignedUrl(filePath, REPORT_URL_EXPIRY);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("❌ COULD NOT CREATE REPORT SIGNED URL:", signedUrlError);

      return NextResponse.json({
        ...baseResponse,

        reportUrl: null,

        reportReady: false,

        reportStorageError:
          signedUrlError?.message ||
          "Could not create a signed URL for the report.",
      });
    }

    const reportUrl = signedUrlData.signedUrl;

    console.log("✅ REPORT SIGNED URL CREATED:", sessionId);

    /*
     * --------------------------------------------------
     * SAVE URL TO LEAD
     * --------------------------------------------------
     */

    const { error: updateError } = await supabaseAdmin
      .from("leads")
      .update({
        report_url: reportUrl,
      })
      .eq("session_id", sessionId);

    if (updateError) {
      /*
       * The signed URL still works even if the
       * database update fails.
       */

      console.error(
        "⚠️ SIGNED URL CREATED BUT COULD NOT SAVE URL:",
        updateError,
      );
    } else {
      console.log("✅ REPORT URL SAVED TO LEAD:", sessionId);
    }

    /*
     * --------------------------------------------------
     * RETURN READY REPORT
     * --------------------------------------------------
     */

    return NextResponse.json({
      ...baseResponse,

      reportUrl,

      reportReady: true,
    });
  } catch (error) {
    console.error("❌ REPORT STATUS ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not retrieve report status",
      },
      {
        status: 500,
      },
    );
  }
}
