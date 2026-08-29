"use client";

import { useState, useEffect, useRef } from "react";

import StepIndicator from "./StepIndicator";
import PracticeTypeStep from "./PracticeTypeStep";
import EnquiryStep from "./EnquiryStep";
import RevenueStep from "./RevenueStep";
import ResultPreview from "./ResultPreview";

import { trackMetaEvent } from "@/lib/metaPixel";

type AssessmentData = {
  practiceName: string;
  practiceType: string;
  email: string;
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

const initialData: AssessmentData = {
  practiceName: "",
  practiceType: "",
  email: "",
  monthlyCalls: 0,
  missedCallPercentage: 0,
  averagePatientValue: 0,
};

export default function AssessmentContainer() {
  const [step, setStep] = useState(1);

  const [assessmentData, setAssessmentData] =
    useState<AssessmentData>(initialData);

  const [result, setResult] = useState<CalculationResult | null>(null);

  const assessmentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    assessmentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  function updateAssessmentData(data: Partial<AssessmentData>) {
    setAssessmentData((previous) => ({
      ...previous,
      ...data,
    }));

    // Clear old calculation if the user edits an answer.
    setResult(null);
  }

  function nextStep() {
    setStep((previous) => Math.min(previous + 1, 4));
  }

  function previousStep() {
    setStep((previous) => Math.max(previous - 1, 1));
  }

  async function submitAssessment() {
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(assessmentData),
      });

      const resultData = await response.json();

      if (!response.ok) {
        console.error("❌ CALCULATION API ERROR:", resultData);

        throw new Error(resultData?.error || "Assessment calculation failed");
      }

      setResult(resultData);

      /*
       * Track only successful
       * assessment completion.
       */
      trackMetaEvent("ViewContent", {
        content_name: "Revenue Recovery Assessment",

        practice_type: assessmentData.practiceType,

        monthly_calls: assessmentData.monthlyCalls,
      });
    } catch (error) {
      console.error("SUBMISSION ERROR:", error);

      throw error;
    }
  }

  return (
    <section id="assessment" ref={assessmentRef}>
      <StepIndicator step={step} />

      {step === 1 && (
        <PracticeTypeStep
          data={assessmentData}
          updateData={updateAssessmentData}
          onNext={nextStep}
        />
      )}

      {step === 2 && (
        <EnquiryStep
          data={assessmentData}
          updateData={updateAssessmentData}
          onNext={nextStep}
          onBack={previousStep}
        />
      )}

      {step === 3 && (
        <RevenueStep
          data={assessmentData}
          updateData={updateAssessmentData}
          onNext={nextStep}
          onBack={previousStep}
        />
      )}

      {step === 4 && (
        <ResultPreview
          data={assessmentData}
          result={result}
          onBack={previousStep}
          onSubmit={submitAssessment}
        />
      )}
    </section>
  );
}
