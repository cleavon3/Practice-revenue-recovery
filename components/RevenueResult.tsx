"use client";

import { useEffect } from "react";

import ReportOffer from "./ReportOffer";
import EmailCapture from "./EmailCapture";

type RevenueResultProps = {
  monthlyLoss: number;
  yearlyLoss: number;
  sessionId: string;
};

export default function RevenueResult({
  monthlyLoss,
  yearlyLoss,
  sessionId,
}: RevenueResultProps) {
  console.log("🔥 REVENUE RESULT RENDERED", {
    monthlyLoss,
    yearlyLoss,
    sessionId,
  });

  useEffect(() => {
    console.log("Revenue result displayed");

    /*
     * Meta Pixel
     *
     * Window.fbq is declared globally elsewhere.
     * We intentionally do not redeclare it here because
     * duplicate declarations cause TypeScript conflicts
     * during the Vercel build.
     */

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "calculator_completed", {
        monthly_loss: monthlyLoss,
        yearly_loss: yearlyLoss,
      });

      console.log("Meta calculator_completed fired");
    }

    /*
     * Google Ads
     *
     * Window.gtag is also declared globally elsewhere.
     */

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calculator_completed", {
        monthly_loss: monthlyLoss,
        yearly_loss: yearlyLoss,
      });

      console.log("Google calculator_completed fired");
    }
  }, [monthlyLoss, yearlyLoss, sessionId]);

  return (
    <section className="result">
      <h2>Your practice may be losing approximately:</h2>

      <h3>${monthlyLoss.toLocaleString()}/month</h3>

      <p>Estimated annual revenue loss:</p>

      <strong>${yearlyLoss.toLocaleString()}</strong>

      <p>Estimated using industry-average call-handling data.</p>

      <EmailCapture
        result={{
          monthlyLoss,
          yearlyLoss,
          sessionId,
        }}
      />

      <ReportOffer sessionId={sessionId} />
    </section>
  );
}
