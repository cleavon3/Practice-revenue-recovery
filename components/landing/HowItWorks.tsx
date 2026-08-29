const steps = [
  {
    number: "01",
    title: "Complete Your Assessment",
    description:
      "Answer a few questions about your practice, enquiry volume, and missed-call opportunity.",
  },
  {
    number: "02",
    title: "Unlock Your Revenue Report",
    description:
      "Receive your personalised Revenue Recovery Assessment with benchmark insights and recommendations.",
  },
  {
    number: "03",
    title: "Recover More Patient Opportunities",
    description:
      "Discover how improved response systems and AI-powered call handling can help capture missed enquiries.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          How Your Revenue Assessment Works
        </h2>

        <p className="mt-4 text-gray-600">
          Get your practice assessment in three simple steps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.number}
            className="
              border
              rounded-2xl
              p-6
            "
          >
            <div
              className="
                text-sm
                font-semibold
                text-gray-500
              "
            >
              {step.number}
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-semibold
              "
            >
              {step.title}
            </h3>

            <p
              className="
                mt-3
                text-sm
                text-gray-600
                leading-relaxed
              "
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
