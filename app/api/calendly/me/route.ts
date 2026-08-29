import { NextResponse } from "next/server";

const CALENDLY_ORGANIZATION_URI =
  "https://api.calendly.com/organizations/5a292004-a8ed-46e2-afcb-2f9ecb2abf05";

export async function POST(request: Request) {
  try {
    const token = process.env.CALENDLY_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error: "CALENDLY_API_TOKEN is missing",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * The webhook must use the deployed application URL.
     *
     * Example:
     * https://your-domain.com/api/calendly/webhook
     */

    const productionUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    if (!productionUrl) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_APP_URL is missing. Add your production HTTPS domain to .env.local.",
        },
        {
          status: 500,
        },
      );
    }

    if (!productionUrl.startsWith("https://")) {
      return NextResponse.json(
        {
          error: "NEXT_PUBLIC_APP_URL must use HTTPS.",
        },
        {
          status: 400,
        },
      );
    }

    const webhookUrl = `${productionUrl}/api/calendly/webhook`;

    console.log("📅 CALENDLY WEBHOOK REGISTRATION");

    console.log("🔗 WEBHOOK URL:", webhookUrl);

    const response = await fetch(
      "https://api.calendly.com/webhook_subscriptions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          url: webhookUrl,

          events: ["invitee.created", "invitee.canceled"],

          organization: CALENDLY_ORGANIZATION_URI,

          scope: "organization",
        }),
      },
    );

    const data = await response.json();

    console.log("📅 CALENDLY RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.title ||
            "Calendly webhook registration failed.",

          details: data,
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Calendly webhook registered successfully.",

      webhook: data.resource,
    });
  } catch (error) {
    console.error("❌ CALENDLY WEBHOOK REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not register Calendly webhook.",
      },
      {
        status: 500,
      },
    );
  }
}
