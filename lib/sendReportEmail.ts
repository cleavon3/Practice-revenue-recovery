type SendReportEmailParams = {
  email: string;
  practiceName: string;
  practiceType?: string;
  monthlyLoss: number;
  yearlyLoss: number;
  pdfBuffer: Buffer;
};

const PRACTICE_LABELS: Record<string, string> = {
  Dental: "Dental",
  "Aesthetics Clinic": "Aesthetics Clinic",
  Dermatology: "Dermatology",
  "Cosmetic Clinic": "Cosmetic Clinic",
  Physiotherapy: "Physiotherapy",
  Optometry: "Optometry",
  "Private Hospital": "Private Hospital",
};

export async function sendReportEmail({
  email,
  practiceName,
  practiceType,
  monthlyLoss,
  yearlyLoss,
  pdfBuffer,
}: SendReportEmailParams) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error("BREVO_SENDER_EMAIL is missing");
  }

  if (!process.env.NEXT_PUBLIC_SALES_PAGE_URL) {
    throw new Error("NEXT_PUBLIC_SALES_PAGE_URL is missing");
  }

  const pdfBase64 = pdfBuffer.toString("base64");

  const resolvedPracticeType =
    PRACTICE_LABELS[practiceType || ""] || "Healthcare";

  const salesPageUrl = process.env.NEXT_PUBLIC_SALES_PAGE_URL;

  const filename = `${resolvedPracticeType
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")}-Revenue-Recovery-Report.pdf`;

  console.log("📎 EMAIL PDF BUFFER SIZE:", pdfBuffer.length);

  console.log("📎 EMAIL PDF BASE64 LENGTH:", pdfBase64.length);

  console.log("📧 REPORT EMAIL:", email);

  console.log("📄 REPORT TYPE:", resolvedPracticeType);

  console.log("🔗 SALES PAGE:", salesPageUrl);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",

    headers: {
      accept: "application/json",

      "api-key": process.env.BREVO_API_KEY,

      "content-type": "application/json",
    },

    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "Skill Digital Solutions",

        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email,
        },
      ],

      subject: `Your ${resolvedPracticeType} Revenue Recovery Report Is Ready`,

      htmlContent: `
<div
  style="
    font-family: Arial, Helvetica, sans-serif;
    max-width: 640px;
    margin: 0 auto;
    padding: 32px;
    color: #111827;
    line-height: 1.6;
  "
>

  <h2
    style="
      margin-bottom: 8px;
      color: #111827;
    "
  >
    Your Revenue Recovery Report Is Ready
  </h2>

  <p>
    Hello,
  </p>

  <p>
    Your personalised
    <strong>${resolvedPracticeType}</strong>
    revenue recovery assessment for
    <strong>${practiceName}</strong>
    has been completed.
  </p>

  <p>
    Your assessment identified a potential revenue
    opportunity of:
  </p>

  <div
    style="
      margin: 24px 0;
      padding: 20px;
      background: #f3f4f6;
      border-radius: 10px;
    "
  >

    <div
      style="
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
      "
    >
      Estimated Monthly Opportunity
    </div>

    <div
      style="
        font-size: 28px;
        font-weight: bold;
        color: #111827;
      "
    >
      $${monthlyLoss.toLocaleString()}
    </div>

    <div
      style="
        margin-top: 16px;
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
      "
    >
      Estimated Annual Opportunity
    </div>

    <div
      style="
        font-size: 22px;
        font-weight: bold;
        color: #111827;
      "
    >
      $${yearlyLoss.toLocaleString()}
    </div>

  </div>

  <p>
    Your detailed report explains:
  </p>

  <ul>

    <li>
      Where revenue opportunities may be getting lost
    </li>

    <li>
      How your practice compares with relevant
      industry benchmarks
    </li>

    <li>
      Actions you can take to improve patient
      enquiry capture
    </li>

    <li>
      How AI-powered call handling can support
      revenue recovery
    </li>

  </ul>

  <p>
    Your personalised Revenue Recovery Report
    is attached to this email.
  </p>

  <div
    style="
      margin: 32px 0;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    "
  >

    <h3
      style="
        margin-top: 0;
        margin-bottom: 10px;
        color: #111827;
      "
    >
      Ready to recover more missed revenue?
    </h3>

    <p>
      Your assessment identified a potential revenue
      opportunity. If you want to explore how an AI
      revenue recovery system could work for your
      practice, visit our solution page.
    </p>

    <a
      href="${salesPageUrl}"
      style="
        display: inline-block;
        padding: 13px 22px;
        background: #111827;
        color: #ffffff;
        text-decoration: none;
        border-radius: 7px;
        font-weight: 600;
      "
    >
      Explore Revenue Recovery →
    </a>

  </div>

  <p
    style="
      margin-top: 32px;
      font-size: 13px;
      color: #6b7280;
    "
  >

    Prepared by:

    <br />

    <strong>
      Cleavon A
    </strong>

    <br />

    Founder & AI Revenue Recovery Consultant

    <br />

    Skill Digital Solutions

  </p>

</div>
`,

      attachment: [
        {
          content: pdfBase64,

          name: filename,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("❌ BREVO ERROR:", errorText);

    throw new Error("Brevo email failed");
  }

  const result = await response.json();

  console.log("✅ BREVO EMAIL SENT:", result);

  return result;
}
