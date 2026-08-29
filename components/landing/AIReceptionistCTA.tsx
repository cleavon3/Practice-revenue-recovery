"use client";

export default function AIReceptionistCTA() {
  function goToDemo() {
    window.location.href = "/ai-receptionist-demo";
  }

  function goToAssessment() {
    document.getElementById("assessment")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="relative overflow-hidden bg-[#0d1828]">
      {/* Decorative background */}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#0F7490]/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[380px] w-[380px] rounded-full bg-[#0F7490]/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Main content */}

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Copy */}

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#55c3d8]" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9edbe5]">
                  Revenue Recovery Technology
                </span>
              </div>

              <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                What happens when every patient enquiry gets an immediate
                response?
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Missed calls and delayed responses can create gaps between
                patient interest and booked appointments. An AI receptionist can
                help your practice respond, qualify and handle enquiries when
                your team is unavailable.
              </p>

              {/* Benefits */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Benefit
                  title="Respond faster"
                  text="Handle enquiries when your team is busy or unavailable."
                />

                <Benefit
                  title="Capture more opportunities"
                  text="Reduce the number of potential patients who receive no response."
                />

                <Benefit
                  title="Support your team"
                  text="Automate routine enquiry handling without replacing your existing workflow."
                />

                <Benefit
                  title="Available beyond office hours"
                  text="Give prospective patients a way to engage outside normal working hours."
                />
              </div>

              {/* Actions */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goToDemo}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[#111827]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#e8f5f8]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#0d1828]
                  "
                >
                  See the AI Receptionist
                  <span className="ml-2">→</span>
                </button>

                <button
                  type="button"
                  onClick={goToAssessment}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/15
                    bg-white/5
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-white/10
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#0d1828]
                  "
                >
                  Calculate My Opportunity
                </button>
              </div>
            </div>

            {/* Right-side visual */}

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-sm sm:p-6">
                {/* Window header */}

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F7490] text-lg">
                      ✦
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        AI Receptionist
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#55c3d8]" />

                        <span className="text-[10px] text-white/50">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white/40">
                    Live
                  </span>
                </div>

                {/* Conversation */}

                <div className="space-y-4 py-6">
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#0F7490] px-4 py-3">
                    <p className="text-xs leading-5 text-white">
                      Hi, I'd like to book an appointment. Are you open
                      tomorrow?
                    </p>
                  </div>

                  <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-3">
                    <p className="text-xs leading-5 text-white/80">
                      Absolutely. I can help you with that. What type of
                      appointment are you looking for?
                    </p>
                  </div>

                  <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-[#0F7490] px-4 py-3">
                    <p className="text-xs leading-5 text-white">
                      I'd like to book an initial consultation.
                    </p>
                  </div>
                </div>

                {/* Status */}

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Enquiry handled
                    </span>

                    <span className="text-xs font-bold text-[#9edbe5]">✓</span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-[#0F7490]" />
                  </div>

                  <p className="mt-3 text-[10px] leading-5 text-white/40">
                    Designed to help practices respond to prospective patients
                    when staff are unavailable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom message */}

          <div className="mt-14 border-t border-white/10 pt-7">
            <p className="text-center text-xs leading-6 text-white/40 sm:text-sm">
              The assessment identifies the potential opportunity first.
              Technology comes second.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F7490] text-[10px] font-bold text-white">
        ✓
      </div>

      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-white/45">{text}</p>
      </div>
    </div>
  );
}
