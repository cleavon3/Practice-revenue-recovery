import { NextResponse } from "next/server";

const CALENDLY_USER_URI =
  "https://api.calendly.com/users/7af50959-dbf1-4efa-9702-5482e7196392";

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

    const body = await request.json().catch(() => ({}));

    const webhookUrl =
      body.webhookUrl || `${new URL(request.url).origin}/api/calendly/webhook`;

    console.log("📅 REGISTERING CALENDLY WEBHOOK");
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

          signing_key: process.env.CALENDLY_WEBHOOK_SIGNING_KEY || undefined,
        }),
      },
    );

    const data = await response.json();

    console.log("📅 CALENDLY WEBHOOK RESPONSE:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error ||
            "Could not create Calendly webhook subscription",

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
