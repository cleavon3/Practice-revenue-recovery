"use client";

import { ChangeEvent } from "react";

type AssessmentData = {
  practiceName: string;
  practiceType: string;
  email: string;
  monthlyCalls: number;
  missedCallPercentage: number;
  averagePatientValue: number;
};

type EnquiryStepProps = {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function EnquiryStep({
  data,
  updateData,
  onNext,
  onBack,
}: EnquiryStepProps) {
  function handleNumberChange(
    event: ChangeEvent<HTMLInputElement>,
    field: "monthlyCalls" | "missedCallPercentage",
  ) {
    updateData({
      [field]: Number(event.target.value),
    });
  }

  function handleContinue() {
    if (
      !data.email.trim() ||
      !data.email.includes("@") ||
      data.monthlyCalls <= 0 ||
      data.missedCallPercentage <= 0 ||
      data.missedCallPercentage > 100
    ) {
      return;
    }

    onNext();
  }

  const isValid =
    data.email.trim().length > 0 &&
    data.email.includes("@") &&
    data.monthlyCalls > 0 &&
    data.missedCallPercentage > 0 &&
    data.missedCallPercentage <= 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Tell us about your patient enquiries
        </h2>

        <p className="mt-2 text-gray-600">
          We use this information to estimate your potential missed revenue
          opportunity and deliver your personalised report.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Address */}

        <div>
          <label
            htmlFor="assessment-email"
            className="block text-sm font-medium mb-2"
          >
            Where should we send your report?
          </label>

          <input
            id="assessment-email"
            type="email"
            value={data.email}
            onChange={(event) =>
              updateData({
                email: event.target.value,
              })
            }
            placeholder="you@example.com"
            autoComplete="email"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              focus:outline-none
              focus:border-black
            "
          />

          <p className="text-sm text-gray-500 mt-2">
            Your report will be sent to this email after your purchase.
          </p>
        </div>

        {/* Monthly Patient Enquiries */}

        <div>
          <label
            htmlFor="monthly-calls"
            className="block text-sm font-medium mb-2"
          >
            How many patient enquiries do you receive monthly?
          </label>

          <input
            id="monthly-calls"
            type="number"
            min="0"
            value={data.monthlyCalls || ""}
            onChange={(event) => handleNumberChange(event, "monthlyCalls")}
            placeholder="Example: 500"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              focus:outline-none
              focus:border-black
            "
          />
        </div>

        {/* Missed Call Percentage */}

        <div>
          <label
            htmlFor="missed-call-percentage"
            className="block text-sm font-medium mb-2"
          >
            What percentage of calls are missed?
          </label>

          <input
            id="missed-call-percentage"
            type="number"
            min="0"
            max="100"
            value={data.missedCallPercentage || ""}
            onChange={(event) =>
              handleNumberChange(event, "missedCallPercentage")
            }
            placeholder="Example: 20"
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              focus:outline-none
              focus:border-black
            "
          />

          <p className="text-sm text-gray-500 mt-2">
            Include unanswered calls, abandoned calls, and enquiries outside
            working hours.
          </p>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="
            flex-1
            py-3
            rounded-lg
            border
            border-gray-300
            text-gray-900
            hover:bg-gray-50
            transition
          "
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid}
          className="
            flex-1
            py-3
            rounded-lg
            bg-black
            text-white
            font-medium
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >
          Continue
        </button>
      </div>
    </div>
  );
}
