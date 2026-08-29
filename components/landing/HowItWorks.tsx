"use client";

export default function HowItWorks() {
  function scrollToAssessment() {
    document.getElementById("assessment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F7490]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              From missed enquiries to a clearer revenue opportunity
            </h2>

            <p className="mt-4 text-base leading-7 text-[#718096]">
              Start with a free assessment, understand the potential impact,
              then decide whether a deeper revenue recovery review is right for
              your practice.
            </p>
          </div>

          {/* Steps */}

          <div className="relative mt-14">
            <div
              aria-hidden="true"
              className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-[#dce7ea] lg:block"
            />

            <div className="grid gap-8 lg:grid-cols-3">
              <Step
                number="01"
                title="Tell us about your practice"
                description="Select your practice type and provide a few simple figures about your patient enquiries and missed calls."
              />

              <Step
                number="02"
                title="See your revenue opportunity"
                description="We'll calculate your estimated monthly and annual revenue opportunity based on the information you provide."
              />

              <Step
                number="03"
                title="Get the full picture"
                description="If you want a deeper breakdown, unlock your personalised Revenue Recovery Report for $27."
              />
            </div>
          </div>

          {/* Bottom CTA */}

          <div className="mt-14 rounded-3xl border border-[#dce8ec] bg-[#f5fafb] p-7 sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F7490]">
                  Start with the numbers
                </p>

                <h3 className="mt-2 text-xl font-bold text-[#172033] sm:text-2xl">
                  Find out what missed enquiries could be costing your practice.
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#718096]">
                  The assessment takes about 60 seconds and is free to complete.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToAssessment}
                className="
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#111827]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#0F7490]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#0F7490]
                  focus-visible:ring-offset-2
                "
              >
                Start Free Assessment
                <span className="ml-2 text-base">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#0F7490] text-sm font-bold text-white shadow-md">
        {number}
      </div>

      <div className="mt-6 rounded-2xl border border-[#e3e9ec] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#172033]">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-[#718096]">{description}</p>
      </div>
    </div>
  );
}
