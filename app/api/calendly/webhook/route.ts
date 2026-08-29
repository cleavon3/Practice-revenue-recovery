import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CalendlyWebhookPayload = {
  event?: string;

  payload?: {
    uri?: string;

    name?: string;

    email?: string;

    status?: string;

    created_at?: string;

    scheduled_event?: string;

    cancel_url?: string;

    reschedule_url?: string;

    event?: string;

    invitee?: string;

    old_invitee?: string;

    new_invitee?: string;

    [key: string]: unknown;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CalendlyWebhookPayload;

    console.log("📅 CALENDLY WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

    const event = body.event;
    const payload = body.payload;

    /*
     * ----------------------------------------------------
     * BOOKING CREATED
     * ----------------------------------------------------
     */

    if (event === "invitee.created") {
      const email = payload?.email?.trim().toLowerCase();

      if (!email) {
        console.warn("⚠️ CALENDLY BOOKING HAS NO EMAIL");

        return NextResponse.json({
          received: true,
          updated: false,
          reason: "No invitee email found",
        });
      }

      console.log("📧 CALENDLY INVITEE:", email);

      /*
       * Find the lead using the email address.
       *
       * Email is the primary connection between
       * the Revenue Recovery funnel and Calendly.
       */

      const { data: lead, error: leadError } = await supabaseAdmin
        .from("leads")
        .select(
          `
              id,
              email,
              practice_name,
              practice_type,
              status
            `,
        )
        .eq("email", email)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (leadError) {
        console.error("❌ CALENDLY LEAD LOOKUP ERROR:", leadError);

        return NextResponse.json(
          {
            error: "Could not find lead",
          },
          {
            status: 500,
          },
        );
      }

      if (!lead) {
        console.warn("⚠️ NO LEAD FOUND FOR CALENDLY EMAIL:", email);

        /*
         * We still return 200 so Calendly knows
         * the webhook was received successfully.
         */

        return NextResponse.json({
          received: true,
          updated: false,
          reason: "No matching lead",
        });
      }

      console.log("✅ CALENDLY LEAD FOUND:", lead.id);

      /*
       * Update the CRM.
       */

      const { data: updatedLead, error: updateError } = await supabaseAdmin
        .from("leads")
        .update({
          booking_cta_clicked: true,
          booking_clicked_at: payload?.created_at || new Date().toISOString(),
          status: "call_booked",
        })
        .eq("id", lead.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ CALENDLY LEAD UPDATE ERROR:", updateError);

        return NextResponse.json(
          {
            error: "Could not update lead booking status",
          },
          {
            status: 500,
          },
        );
      }

      console.log("🎉 STRATEGY CALL BOOKED:", {
        leadId: updatedLead.id,
        email,
        practiceName: updatedLead.practice_name,
        status: updatedLead.status,
      });

      return NextResponse.json({
        received: true,
        updated: true,
        event: "invitee.created",
        leadId: updatedLead.id,
      });
    }

    /*
     * ----------------------------------------------------
     * BOOKING CANCELLED
     * ----------------------------------------------------
     */

    if (event === "invitee.canceled") {
      const email = payload?.email?.trim().toLowerCase();

      console.log("❌ CALENDLY BOOKING CANCELLED:", email || "unknown email");

      if (!email) {
        return NextResponse.json({
          received: true,
          updated: false,
          reason: "No invitee email found",
        });
      }

      const { data: lead, error: leadError } = await supabaseAdmin
        .from("leads")
        .select(
          `
              id,
              email,
              status
            `,
        )
        .eq("email", email)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (leadError) {
        console.error("❌ CALENDLY CANCELLATION LOOKUP ERROR:", leadError);

        return NextResponse.json(
          {
            error: "Could not find lead",
          },
          {
            status: 500,
          },
        );
      }

      if (!lead) {
        console.warn("⚠️ NO LEAD FOUND FOR CANCELLED BOOKING:", email);

        return NextResponse.json({
          received: true,
          updated: false,
          reason: "No matching lead",
        });
      }

      /*
       * Do not erase the fact that the person
       * previously booked.
       *
       * Move them back to a report-purchased
       * stage so they can be followed up.
       */

      const { data: updatedLead, error: updateError } = await supabaseAdmin
        .from("leads")
        .update({
          status: "report_paid",
          booking_cta_clicked: false,
        })
        .eq("id", lead.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ CALENDLY CANCELLATION UPDATE ERROR:", updateError);

        return NextResponse.json(
          {
            error: "Could not update cancelled booking",
          },
          {
            status: 500,
          },
        );
      }

      console.log("✅ LEAD RETURNED TO REPORT PURCHASED:", updatedLead.id);

      return NextResponse.json({
        received: true,
        updated: true,
        event: "invitee.canceled",
        leadId: updatedLead.id,
      });
    }

    /*
     * ----------------------------------------------------
     * OTHER EVENTS
     * ----------------------------------------------------
     */

    console.log("ℹ️ CALENDLY EVENT IGNORED:", event);

    return NextResponse.json({
      received: true,
      updated: false,
      reason: "Event not handled",
    });
  } catch (error) {
    console.error("❌ CALENDLY WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      {
        status: 500,
      },
    );
  }
}
