"use client";

import { useRef, useState } from "react";

type AssessmentData = {
  practiceName: string;
  practiceType: string;
  email: string;
  monthlyCalls: number;
  missedCallPercentage: number;
  averagePatientValue: number;
};

type PracticeTypeStepProps = {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
  onNext: () => void;
};

const practiceTypes = [
  {
    name: "Dental",
    icon: "🦷",
    description: "Dental clinics and practices",
  },
  {
    name: "Aesthetics Clinic",
    icon: "✨",
    description: "Aesthetic and cosmetic services",
  },
  {
    name: "Dermatology",
    icon: "🔬",
    description: "Skin health specialists",
  },
  {
    name: "Cosmetic Clinic",
    icon: "💎",
    description: "Cosmetic treatment providers",
  },
  {
    name: "Physiotherapy",
    icon: "🏃",
    description: "Rehabilitation and mobility care",
  },
  {
    name: "Optometry",
    icon: "👁",
    description: "Eye care practices",
  },
  {
    name: "Private Hospital",
    icon: "🏥",
    description: "Private healthcare facilities",
  },
];

export default function PracticeTypeStep({
  data,
  updateData,
  onNext,
}: PracticeTypeStepProps) {
  const [error, setError] = useState("");

  const continueButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleContinue() {
    if (!data.practiceType) {
      setError("Please select your practice type to continue.");

      continueButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setError("");

    onNext();
  }

  function handleSelect(practiceType: string) {
    updateData({
      practiceType,
    });

    setError("");

    setTimeout(() => {
      continueButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}

      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-gray-500 mb-3">
          Step 1 of 3 · Practice Profile
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          What type of practice do you operate?
        </h2>

        <p className="mt-3 max-w-2xl mx-auto text-gray-600">
          Select your practice type so we can personalise your revenue recovery
          assessment.
        </p>
      </div>

      {/* Practice Type Cards */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >
        {practiceTypes.map((practice) => {
          const selected = data.practiceType === practice.name;

          return (
            <button
              key={practice.name}
              type="button"
              onClick={() => handleSelect(practice.name)}
              aria-pressed={selected}
              className={`
                relative
                text-left
                p-6
                rounded-2xl
                border-2
                min-h-[170px]
                transition-all
                duration-200
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-black
                focus-visible:ring-offset-2

                ${
                  selected
                    ? `
                      border-white
                      bg-[#0F7490]
                      shadow-lg
                      scale-[1.02]
                      ring-2
                      ring-white/40
                    `
                    : `
                      border-[#0F7490]
                      bg-[#0F7490]
                      hover:border-white
                      hover:shadow-md
                      hover:-translate-y-0.5
                    `
                }
              `}
            >
              {/* Selected Indicator */}

              {selected && (
                <div
                  className="
                    absolute
                    top-4
                    right-4
                    flex
                    items-center
                    justify-center
                    w-7
                    h-7
                    rounded-full
                    bg-black
                    text-white
                    text-sm
                    font-bold
                  "
                  aria-hidden="true"
                >
                  ✓
                </div>
              )}

              {/* Icon */}

              <div className="text-3xl mb-5" aria-hidden="true">
                {practice.icon}
              </div>

              {/* Practice Name */}

              <h3
                className="
                  text-lg
                  font-bold
                  text-white
                  leading-tight
                "
              >
                {practice.name}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-3
                  text-sm
                  font-normal
                  text-white/70
                  leading-relaxed
                "
              >
                {practice.description}
              </p>

              {/* Selected State */}

              {selected && (
                <p
                  className="
                    mt-4
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-white/80
                  "
                >
                  Selected
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation Message */}

      {error && (
        <p
          role="alert"
          className="
            mt-5
            text-sm
            text-red-600
            text-center
            font-medium
          "
        >
          {error}
        </p>
      )}

      {/* Continue */}

      <button
        ref={continueButtonRef}
        type="button"
        onClick={handleContinue}
        className="
          mt-8
          w-full
          py-4
          rounded-xl
          bg-black
          text-white
          font-semibold
          transition-all
          hover:opacity-90
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-black
          focus-visible:ring-offset-2
        "
      >
        Continue →
      </button>
    </div>
  );
}
