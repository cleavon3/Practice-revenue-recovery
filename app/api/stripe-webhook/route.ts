import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createReport } from "@/lib/createReport";
import { sendReportEmail } from "@/lib/sendReportEmail";

async function sendMetaPurchaseEvent({
  session,
  customerEmail,
}: {
  session: Stripe.Checkout.Session;
  customerEmail: string | null;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error("❌ META PURCHASE TRACKING CONFIGURATION MISSING");

    return;
  }

  const eventId = `purchase_${session.id}`;

  const customerData: Record<string, unknown> = {};

  if (customerEmail) {
    customerData.em = customerEmail.trim().toLowerCase();
  }

  const payload = {
    data: [
      {
        event_name: "Purchase",

        event_time: Math.floor(Date.now() / 1000),

        event_id: eventId,

        action_source: "website",

        user_data: customerData,

        custom_data: {
          value: 27,

          currency: "USD",

          content_name: "Full Revenue Recovery Report",
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error("❌ META PURCHASE EVENT FAILED:", responseData);

      return;
    }

    console.log("✅ META PURCHASE EVENT SENT:", responseData);
  } catch (error) {
    console.error("❌ META PURCHASE REQUEST ERROR:", error);
  }
}

export async function POST(request: Request) {
  /*
   * --------------------------------------------------
   * READ STRIPE WEBHOOK
   * --------------------------------------------------
   */

  const body = await request.text();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ MISSING STRIPE SIGNATURE");

    return NextResponse.json(
      {
        error: "Missing signature",
      },
      {
        status: 400,
      },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("❌ STRIPE WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        error: "Invalid webhook",
      },
      {
        status: 400,
      },
    );
  }

  /*
   * --------------------------------------------------
   * ONLY PROCESS COMPLETED CHECKOUTS
   * --------------------------------------------------
   */

  if (event.type !== "checkout.session.completed") {
    console.log("IGNORED EVENT:", event.type);

    return NextResponse.json({
      received: true,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const sessionId = session.metadata?.sessionId;

  const customerEmail =
    session.customer_details?.email || session.customer_email || null;

  console.log("✅ PAYMENT COMPLETED");

  console.log("SESSION ID:", sessionId);

  console.log("CUSTOMER EMAIL:", customerEmail);

  if (!sessionId) {
    console.error("❌ NO SESSION ID");

    return NextResponse.json({
      received: true,
    });
  }

  /*
   * --------------------------------------------------
   * FIND LEAD
   * --------------------------------------------------
   */

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (leadError || !lead) {
    console.error("❌ LEAD LOOKUP FAILED:", leadError);

    return NextResponse.json({
      received: true,
    });
  }

  console.log("LEAD FOUND:", lead);

  /*
   * --------------------------------------------------
   * IMPORTANT IDEMPOTENCY CHECK
   * --------------------------------------------------
   *
   * A payment can be marked as purchased while
   * the report itself is incomplete.
   *
   * Therefore:
   *
   * report_purchased = true
   * report_url = null
   *
   * MUST NOT stop processing.
   *
   * We repair the report instead.
   */

  const reportIsComplete =
    lead.report_purchased === true &&
    lead.report_generated === true &&
    !!lead.report_url;

  if (reportIsComplete) {
    console.log("✅ PAYMENT AND REPORT ALREADY COMPLETE:", sessionId);

    return NextResponse.json({
      received: true,

      alreadyProcessed: true,
    });
  }

  /*
   * --------------------------------------------------
   * DETECT REPAIR MODE
   * --------------------------------------------------
   */

  const isRepair = lead.report_purchased === true && !lead.report_url;

  if (isRepair) {
    console.log("🔧 REPORT INCOMPLETE — REPAIRING:", sessionId);
  }

  /*
   * --------------------------------------------------
   * META PURCHASE
   * --------------------------------------------------
   *
   * Only send this when this is the first
   * processing attempt.
   *
   * Repair attempts do not fire another
   * Purchase event.
   */

  if (!lead.report_purchased) {
    await sendMetaPurchaseEvent({
      session,

      customerEmail,
    });
  }

  /*
   * --------------------------------------------------
   * CREATE / REPAIR REPORT
   * --------------------------------------------------
   */

  let report;

  try {
    report = await createReport({
      sessionId,

      lead: {
        ...lead,

        email: customerEmail || lead.email || null,
      },
    });
  } catch (error) {
    console.error("❌ REPORT CREATION FAILED:", error);

    /*
     * Return 500 so Stripe can retry the webhook.
     */

    return NextResponse.json(
      {
        error: "Report generation failed",
      },
      {
        status: 500,
      },
    );
  }

  const pdfBuffer = report.pdfBuffer;

  const reportUrl = report.reportUrl;

  console.log("📄 PDF SIZE:", pdfBuffer.length);

  console.log("📄 REPORT URL:", reportUrl);

  if (!reportUrl) {
    console.error("❌ REPORT URL WAS NOT CREATED");

    return NextResponse.json(
      {
        error: "Report URL was not created",
      },
      {
        status: 500,
      },
    );
  }

  /*
   * --------------------------------------------------
   * UPDATE DATABASE
   * --------------------------------------------------
   */

  const { error: updateError } = await supabaseAdmin
    .from("leads")
    .update({
      report_purchased: true,

      report_generated: true,

      report_url: reportUrl,

      email: customerEmail || lead.email || null,

      email_captured: !!(customerEmail || lead.email),

      report_generated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  if (updateError) {
    console.error("❌ LEAD UPDATE FAILED:", updateError);

    return NextResponse.json(
      {
        error: "Could not update purchase record",
      },
      {
        status: 500,
      },
    );
  }

  console.log("✅ LEAD UPDATED WITH REPORT URL:", sessionId);

  console.log("🔗 REPORT URL SAVED:", reportUrl);

  /*
   * --------------------------------------------------
   * SEND EMAIL
   * --------------------------------------------------
   */

  const email = customerEmail || lead.email || null;

  if (email) {
    try {
      console.log("📧 SENDING REPORT EMAIL TO:", email);

      await sendReportEmail({
        email,

        practiceName: lead.practice_name || "Healthcare Practice",

        practiceType: lead.practice_type,

        monthlyLoss: lead.lost_revenue_monthly,

        yearlyLoss: lead.lost_revenue_yearly,

        pdfBuffer,
      });

      console.log("✅ REPORT EMAIL SENT");
    } catch (error) {
      console.error("❌ REPORT EMAIL FAILED:", error);

      /*
       * The report itself is already safely
       * generated and stored.
       *
       * Do not destroy the successful purchase
       * because email delivery failed.
       */

      return NextResponse.json({
        received: true,

        reportGenerated: true,

        emailSent: false,
      });
    }
  } else {
    console.log("⚠️ NO CUSTOMER EMAIL");
  }

  /*
   * --------------------------------------------------
   * COMPLETE
   * --------------------------------------------------
   */

  return NextResponse.json({
    received: true,

    reportGenerated: true,

    reportUrl,
  });
}
