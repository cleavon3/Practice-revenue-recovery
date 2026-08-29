export default function TrustSection() {
  return (
    <section className="border-y border-[#e7ecef] bg-[#f8fafb]">
      <div className="container mx-auto px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Intro */}

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0F7490]">
              Why measure the opportunity?
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Every missed enquiry represents a potential lost opportunity
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#718096] sm:text-base">
              Your practice may already be receiving more patient demand than
              your current enquiry-handling process can capture. The assessment
              helps put a number against that potential gap.
            </p>
          </div>

          {/* Trust points */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <TrustCard
              icon="01"
              title="Practice-specific"
              text="Your assessment starts with your practice type and the numbers you provide."
            />

            <TrustCard
              icon="02"
              title="Revenue-focused"
              text="See the estimated monthly and annual revenue opportunity rather than just call statistics."
            />

            <TrustCard
              icon="03"
              title="Action-oriented"
              text="Use the result to identify where your patient enquiry process may need attention."
            />
          </div>

          {/* Credibility strip */}

          <div className="mt-8 rounded-2xl border border-[#dce8ec] bg-white px-6 py-5 shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm font-bold text-[#172033]">
                  Built around your practice numbers
                </p>

                <p className="mt-1 text-xs leading-5 text-[#8795a5]">
                  The assessment uses your inputs together with the benchmark
                  framework for your selected practice type.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#e8f5f8] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#0F7490]" />

                <span className="text-xs font-bold text-[#0F7490]">
                  Personalised assessment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e1e7eb] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5f8] text-xs font-bold text-[#0F7490]">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-bold text-[#172033]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#718096]">{text}</p>
    </div>
  );
}
