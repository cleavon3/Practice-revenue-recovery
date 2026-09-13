import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  console.log("🔥 CREATE CHECKOUT ROUTE HIT");

  try {
    const { sessionId } = await request.json();

    // Prefer the configured app URL.
    // Fall back to the domain that made the request.
    const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    const requestOrigin = new URL(request.url).origin;

    const appUrl = configuredAppUrl || requestOrigin;

    // $27 Revenue Recovery Report price
    const priceId = process.env.STRIPE_REPORT_PRICE_ID;

    console.log("REPORT PRICE ID FROM ENV:", priceId);
    console.log("CONFIGURED APP URL:", configuredAppUrl);
    console.log("REQUEST ORIGIN:", requestOrigin);
    console.log("FINAL APP URL:", appUrl);

    if (!priceId) {
      throw new Error("STRIPE_REPORT_PRICE_ID is missing");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_creation: "always",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        sessionId: sessionId || "",
      },

      success_url: `${appUrl}/report-success?session_id=${sessionId}`,

      cancel_url: appUrl,
    });

    console.log("STRIPE CREATED SESSION:", checkoutSession.id);
    console.log("STRIPE METADATA:", checkoutSession.metadata);

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("CHECKOUT ERROR MESSAGE:", error?.message);
    console.error("CHECKOUT ERROR FULL:", error);

    return NextResponse.json(
      {
        error: "Checkout failed",
        message: error?.message,
      },
      {
        status: 500,
      },
    );
  }
}
