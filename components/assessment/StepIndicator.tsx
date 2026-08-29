"use client";

type StepIndicatorProps = {
  step: number;
};

const steps = [
  "Practice Profile",
  "Enquiry Details",
  "Revenue Details",
  "Assessment",
];

export default function StepIndicator({ step }: StepIndicatorProps) {
  const progress = (step / steps.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="mb-5 text-center">
        <p
          className="
          text-sm
          font-medium
          text-gray-500
        "
        >
          Step {step} of {steps.length}
        </p>
      </div>

      <div
        className="
        flex
        items-start
        justify-between
      "
      >
        {steps.map((label, index) => {
          const stepNumber = index + 1;

          const completed = stepNumber < step;

          const current = stepNumber === step;

          return (
            <div
              key={label}
              className="
                flex
                flex-col
                items-center
                flex-1
              "
            >
              <div
                className={`
                  relative
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-full
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    completed
                      ? "bg-black text-white"
                      : current
                        ? "bg-black text-white ring-4 ring-gray-200"
                        : "bg-gray-200 text-gray-500"
                  }

                `}
              >
                {completed ? "✓" : stepNumber}
              </div>

              <span
                className={`
                  mt-3
                  text-xs
                  text-center
                  leading-tight

                  ${
                    current || completed
                      ? "text-black font-medium"
                      : "text-gray-400"
                  }

                `}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="
          mt-6
          h-1.5
          bg-gray-200
          rounded-full
          overflow-hidden
        "
      >
        <div
          className="
            h-full
            bg-black
            rounded-full
            transition-all
            duration-500
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
