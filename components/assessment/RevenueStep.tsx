"use client";

import { ChangeEvent, useState } from "react";

type AssessmentData = {
  practiceName: string;
  practiceType: string;
  email: string;
  monthlyCalls: number;
  missedCallPercentage: number;
  averagePatientValue: number;
};

type RevenueStepProps = {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function RevenueStep({
  data,
  updateData,
  onNext,
  onBack,
}: RevenueStepProps) {
  const [error, setError] = useState("");

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    updateData({
      averagePatientValue: value === "" ? 0 : Number(value),
    });

    setError("");
  }

  function handleContinue() {
    if (data.averagePatientValue <= 0) {
      setError("Please enter the average value of a new patient booking.");

      return;
    }

    setError("");

    onNext();
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500 mb-3">
          Step 3 of 3 · Revenue Details
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          Estimate your patient value
        </h2>

        <p className="mt-3 text-gray-600">
          This helps us calculate the potential revenue opportunity from missed
          enquiries.
        </p>
      </div>

      <div className="space-y-7">
        {/* Patient Value */}

        <div>
          <label
            htmlFor="average-patient-value"
            className="
              block
              text-base
              font-semibold
              text-gray-900
              mb-2
            "
          >
            What is the average value of a new patient booking?
          </label>

          <div
            className="
              flex
              w-full
              rounded-xl
              border-2
              border-gray-200
              bg-white
              overflow-hidden
              transition-all
              focus-within:border-black
              focus-within:ring-2
              focus-within:ring-black/10
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                px-4
                border-r-2
                border-gray-200
                bg-gray-50
                text-lg
                font-semibold
                text-gray-600
              "
              aria-hidden="true"
            >
              $
            </div>

            <input
              id="average-patient-value"
              type="number"
              min="0"
              step="1"
              value={data.averagePatientValue || ""}
              onChange={handleNumberChange}
              placeholder="350"
              aria-describedby="patient-value-help"
              className="
                w-full
                min-w-0
                px-4
                py-4
                text-lg
                font-medium
                text-gray-900
                bg-white
                outline-none
                placeholder:text-gray-400
              "
            />
          </div>

          <p
            id="patient-value-help"
            className="
              text-sm
              text-gray-500
              mt-2
              leading-relaxed
            "
          >
            Include the typical value of a first appointment or new patient
            treatment.
          </p>
        </div>

        {/* Practice Name */}

        <div>
          <label
            htmlFor="practice-name"
            className="
              block
              text-base
              font-semibold
              text-gray-900
              mb-2
            "
          >
            Practice name{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>

          <input
            id="practice-name"
            type="text"
            value={data.practiceName}
            onChange={(event) =>
              updateData({
                practiceName: event.target.value,
              })
            }
            placeholder="Example: Bright Smile Clinic"
            autoComplete="organization"
            className="
              w-full
              border-2
              border-gray-200
              rounded-xl
              px-4
              py-4
              text-base
              text-gray-900
              bg-white
              transition-all
              focus:outline-none
              focus:border-black
              focus:ring-2
              focus:ring-black/10
              placeholder:text-gray-400
            "
          />

          <p
            className="
              text-sm
              text-gray-500
              mt-2
              leading-relaxed
            "
          >
            Used to personalise your revenue assessment report.
          </p>
        </div>
      </div>

      {/* Validation */}

      {error && (
        <p
          role="alert"
          className="
            mt-5
            text-sm
            font-medium
            text-red-600
          "
        >
          {error}
        </p>
      )}

      {/* Navigation */}

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="
            flex-1
            py-4
            rounded-xl
            border-2
            border-gray-200
            text-gray-900
            font-semibold
            transition-all
            hover:bg-gray-50
            hover:border-gray-300
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-black
            focus-visible:ring-offset-2
          "
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={data.averagePatientValue <= 0}
          className="
            flex-1
            py-4
            rounded-xl
            bg-black
            text-white
            font-semibold
            transition-all
            hover:opacity-90
            disabled:opacity-40
            disabled:cursor-not-allowed
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-black
            focus-visible:ring-offset-2
          "
        >
          Generate Assessment →
        </button>
      </div>
    </div>
  );
}
