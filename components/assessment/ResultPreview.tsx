"use client";

import { useState } from "react";

import { trackMetaEvent } from "@/lib/metaPixel";

type AssessmentData = {
  practiceName: string;
  practiceType: string;
  monthlyCalls: number;
  missedCallPercentage: number;
  averagePatientValue: number;
};

type CalculationResult = {
  monthlyLoss?: number;
  yearlyLoss?: number;
  practiceName?: string;
  practiceType?: string;
  sessionId?: string;
};

type ResultPreviewProps = {
  data: AssessmentData;
  result: CalculationResult | null;
  onBack: () => void;
  onSubmit: () => Promise<void>;
};

export default function ResultPreview({
  data,
  result,
  onBack,
  onSubmit,
}: ResultPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateAssessment() {
    setLoading(true);
    setError("");

    try {
      await onSubmit();
    } catch (error) {
      console.error("ASSESSMENT GENERATION ERROR:", error);

      setError("We could not generate your assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!result?.sessionId) {
      setError(
        "Your assessment session could not be found. Please generate your assessment again.",
      );

      return;
    }

    setCheckoutLoading(true);
    setError("");

    try {
      /*
       * Track checkout initiation.
       *
       * This is NOT the completed purchase event.
       * The completed Purchase event is handled
       * server-side by the Stripe webhook.
       */
      trackMetaEvent("InitiateCheckout", {
        content_name: "Full Revenue Recovery Report",
        value: 27,
        currency: "USD",
        practice_type: data.practiceType,
      });

      const response = await fetch("/api/create-checkout", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          sessionId: result.sessionId,
        }),
      });

      const checkoutData = await response.json();

      if (!response.ok) {
        throw new Error(
          checkoutData?.error || "Unable to create checkout session.",
        );
      }

      if (!checkoutData?.url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = checkoutData.url;
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      setError("We could not start checkout. Please try again.");

      setCheckoutLoading(false);
    }
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) {
      return "$0";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-10">
        <p
          className="
            text-sm
            font-medium
            text-gray-500
            mb-3
          "
        >
          Your Assessment Results
        </p>

        <h2
          className="
            text-3xl
            md:text-4xl
            font-bold
            text-gray-900
          "
        >
          {data.practiceType || "Practice"} Revenue Recovery Assessment
        </h2>

        <p
          className="
            mt-4
            text-gray-600
            max-w-xl
            mx-auto
          "
        >
          Based on your practice information, we identified a potential
          opportunity from missed patient enquiries.
        </p>
      </div>

      {/* =================================================
          RESULT CARD
      ================================================= */}

      {result ? (
        <div
          className="
            rounded-3xl
            border
            p-8
            bg-gray-50
            text-center
          "
        >
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Estimated Monthly Revenue Opportunity
          </p>

          <h3
            className="
              text-5xl
              font-bold
              mt-3
              text-gray-900
            "
          >
            {formatCurrency(result.monthlyLoss)}
          </h3>

          <div
            className="
              mt-8
              pt-6
              border-t
            "
          >
            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Estimated Annual Opportunity
            </p>

            <h4
              className="
                text-3xl
                font-semibold
                mt-2
                text-gray-900
              "
            >
              {formatCurrency(result.yearlyLoss)}
            </h4>
          </div>
        </div>
      ) : (
        <div
          className="
            rounded-3xl
            border
            p-8
            bg-gray-50
            text-center
          "
        >
          <p className="text-gray-600">
            Generate your assessment to reveal your estimated revenue recovery
            opportunity.
          </p>
        </div>
      )}

      {/* =================================================
          REPORT PREVIEW
      ================================================= */}

      <div
        className="
          mt-10
          rounded-2xl
          border
          p-6
          bg-white
        "
      >
        <h3
          className="
            text-xl
            font-semibold
            text-gray-900
          "
        >
          See What&apos;s Inside Your Full Report
        </h3>

        <p
          className="
            mt-3
            text-gray-600
          "
        >
          Your full personalised report includes:
        </p>

        <ul
          className="
            mt-5
            space-y-3
            text-gray-700
          "
        >
          <li>✓ {data.practiceType || "Practice"} benchmark comparison</li>

          <li>✓ Revenue opportunity breakdown</li>

          <li>✓ Missed enquiry recovery recommendations</li>

          <li>✓ AI receptionist strategy assessment</li>
        </ul>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="
            mt-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          GENERATE ASSESSMENT
      ================================================= */}

      {!result && (
        <button
          type="button"
          onClick={handleGenerateAssessment}
          disabled={loading}
          className="
            mt-8
            w-full
            py-4
            rounded-xl
            bg-black
            text-white
            font-semibold
            text-lg
            transition
            hover:opacity-90
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Generating Your Assessment..."
            : "Reveal My Revenue Opportunity"}
        </button>
      )}

      {/* =================================================
          PAID REPORT CHECKOUT
      ================================================= */}

      {result && (
        <div className="mt-8">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="
              group
              w-full
              rounded-2xl
              bg-black
              px-6
              py-5
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-xl
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                <span className="text-base font-semibold">
                  Opening Secure Checkout...
                </span>
              </span>
            ) : (
              <span className="flex flex-col items-center justify-center">
                <span className="text-lg font-bold">Unlock My Full Report</span>

                <span className="mt-1 text-sm text-white/75">
                  Get your personalised report — $27
                </span>
              </span>
            )}
          </button>

          {!checkoutLoading && (
            <p
              className="
                mt-3
                text-center
                text-xs
                text-gray-500
              "
            >
              Secure checkout • One-time payment • Personalised PDF report
            </p>
          )}
        </div>
      )}

      {/* =================================================
          EDIT ASSESSMENT
      ================================================= */}

      <button
        type="button"
        onClick={onBack}
        disabled={loading || checkoutLoading}
        className="
          mt-4
          w-full
          py-3
          rounded-xl
          border
          border-gray-300
          font-medium
          text-gray-900
          hover:bg-gray-50
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        ← Edit My Assessment
      </button>
    </div>
  );
}
