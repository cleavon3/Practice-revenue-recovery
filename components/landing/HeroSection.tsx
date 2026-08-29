"use client";

export default function HeroSection() {
  function scrollToAssessment() {
    document.getElementById("assessment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#0F7490]/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#0F7490]/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8e8ec] bg-[#f5fbfc] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#0F7490]" />

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F7490]">
              Free Revenue Recovery Assessment
            </span>
          </div>

          {/* Main headline */}

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
            How Much Revenue Are Missed Patient Enquiries Costing Your Practice?
          </h1>

          {/* Supporting copy */}

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#667085] sm:text-xl">
            Calculate your estimated monthly and annual revenue opportunity from
            missed patient enquiries using benchmarks relevant to your type of
            practice.
          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={scrollToAssessment}
              className="
                inline-flex
                min-h-[56px]
                items-center
                justify-center
                rounded-xl
                bg-[#111827]
                px-8
                text-base
                font-bold
                text-white
                shadow-lg
                shadow-black/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#0F7490]
                hover:shadow-xl
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0F7490]
                focus-visible:ring-offset-2
              "
            >
              Calculate My Revenue Opportunity
              <span className="ml-2 text-lg">→</span>
            </button>

            <p className="text-sm font-medium text-[#8795a5]">
              Free assessment · Takes about 60 seconds · Personalised results
            </p>
          </div>

          {/* Practice types */}

          <div className="mt-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#98a2b3]">
              Built for different healthcare practices
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Dental",
                "Aesthetics",
                "Dermatology",
                "Cosmetic Clinics",
                "Physiotherapy",
                "Optometry",
                "Private Hospitals",
              ].map((type) => (
                <span
                  key={type}
                  className="
                    rounded-full
                    border
                    border-[#e2e8ec]
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-[#536174]
                    shadow-sm
                  "
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Value statement */}

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
            <Benefit
              number="01"
              title="Identify the leak"
              text="See the potential revenue impact of missed patient enquiries."
            />

            <Benefit
              number="02"
              title="Quantify the opportunity"
              text="Understand your estimated monthly and annual revenue opportunity."
            />

            <Benefit
              number="03"
              title="Know what to do next"
              text="Get a clearer picture of where enquiry handling can improve."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefit({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5eaed] bg-[#fbfcfd] p-5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-widest text-[#0F7490]">
          {number}
        </span>

        <h2 className="text-sm font-bold text-[#172033]">{title}</h2>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#718096]">{text}</p>
    </div>
  );
}
