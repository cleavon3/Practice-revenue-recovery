import Image from "next/image";

export default function AIReceptionistDemoPage() {
  return (
    <main className="demo-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="premium-hero">
        <Image
          src="/logo.png"
          alt="Skill Digital Solutions"
          width={150}
          height={70}
          className="h-auto w-[150px] object-contain"
        />

        <div className="trust-badges">
          <span>✓ Built For Healthcare Practices</span>

          <span>✓ 24/7 Patient Enquiry Handling</span>

          <span>✓ Appointment Automation</span>
        </div>

        <h1>
          Recover More Revenue
          <br />
          From Every Patient Enquiry
        </h1>

        <p>
          Your AI receptionist can answer patient calls, handle enquiries,
          support appointment requests, and help your practice capture
          opportunities that might otherwise be missed.
        </p>

        <h3 className="demo-label">
          Watch How The AI Receptionist Handles Patient Enquiries
        </h3>

        <div className="hero-video">
          <iframe
            src="https://www.youtube.com/embed/D72UWBFhbD4"
            title="AI Receptionist Demo"
            allowFullScreen
          />
        </div>

        <a
          href="https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session"
          className="demo-main-button"
        >
          Book Your Revenue Recovery Strategy Call
        </a>
      </section>

      {/* =====================================================
          PROBLEM
      ===================================================== */}

      <section className="problem-section">
        <h2>Every Missed Enquiry Is A Lost Opportunity</h2>

        <p>
          When prospective patients cannot reach your practice or do not receive
          a timely response, the opportunity to turn that enquiry into an
          appointment can disappear.
        </p>

        <div className="problem-flow">
          <div>
            📞
            <strong>Patient Enquiry</strong>
          </div>

          <span>↓</span>

          <div>
            ❌<strong>No Immediate Response</strong>
          </div>

          <span>↓</span>

          <div>
            🏥
            <strong>Potential Opportunity Lost</strong>
          </div>
        </div>

        <div className="revenue-box">
          A missed conversation can become missed patient revenue.
        </div>
      </section>

      {/* =====================================================
          AI FEATURES
      ===================================================== */}

      <section className="ai-section">
        <h2>Meet Your 24/7 AI Receptionist</h2>

        <p>
          A conversational AI system designed to help healthcare practices
          respond to patient enquiries and manage routine appointment
          interactions.
        </p>

        <div className="ai-grid">
          <div className="ai-card">
            <h3>01. Respond To Patient Enquiries</h3>

            <p>
              Respond to incoming enquiries when your team is busy, unavailable,
              or outside normal operating hours.
            </p>
          </div>

          <div className="ai-card">
            <h3>02. Understand Patient Needs</h3>

            <p>
              Handle natural conversations and identify what the patient is
              trying to accomplish.
            </p>
          </div>

          <div className="ai-card">
            <h3>03. Support Appointment Requests</h3>

            <p>
              Help patients with booking, rescheduling, cancellation requests,
              and other routine appointment interactions.
            </p>
          </div>

          <div className="ai-card">
            <h3>04. Capture The Next Step</h3>

            <p>
              Collect relevant information and help move the patient enquiry
              towards an appropriate next action.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONVERSATION
      ===================================================== */}

      <section className="conversation-section">
        <h2>A Patient Conversation</h2>

        <div className="conversation-box">
          <div className="patient">
            Patient:
            <br />
            "I'd like to book an appointment. Do you have anything available
            next week?"
          </div>

          <div className="ai-message">
            AI Receptionist:
            <br />
            "Of course. I can help with that. What type of appointment are you
            looking for?"
          </div>

          <div className="patient">
            Patient:
            <br />
            "I'd like an initial consultation."
          </div>

          <div className="ai-message">
            AI Receptionist:
            <br />
            "I can help you find an available appointment. What day works best
            for you?"
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="workflow-section">
        <h2>From Patient Enquiry To Next Action</h2>

        <div className="workflow-box">
          <div>Patient Enquiry</div>

          <span>↓</span>

          <div>AI Understands Intent</div>

          <span>↓</span>

          <div>Book / Reschedule / Cancel</div>

          <span>↓</span>

          <div>Calendar / Practice Workflow</div>

          <span>↓</span>

          <div>Patient Confirmation</div>
        </div>
      </section>

      {/* =====================================================
          PRACTICE CHALLENGES
      ===================================================== */}

      <section className="challenge-section">
        <h2>Designed Around Real Practice Challenges</h2>

        <p>
          Healthcare practices can lose opportunities through missed calls,
          delayed responses, busy reception teams, and limited availability
          outside normal operating hours.
        </p>

        <div className="challenge-grid">
          <div className="challenge-card">
            <h3>📞 Missed Enquiries</h3>

            <p>
              Incoming patient enquiries can be missed when reception teams are
              already handling other patients or calls.
            </p>
          </div>

          <div className="challenge-card">
            <h3>⏰ Busy Front Desk Teams</h3>

            <p>
              Busy periods, lunch breaks, evenings, and weekends can create gaps
              in patient enquiry handling.
            </p>
          </div>

          <div className="challenge-card">
            <h3>📅 Every Enquiry Needs A Next Step</h3>

            <p>
              Whether a patient wants to book, reschedule, cancel, or ask a
              question, the enquiry should have a clear next action.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT PRACTICES NEED
      ===================================================== */}

      <section className="needs-section">
        <h2>What A Modern Patient Reception System Should Deliver</h2>

        <div className="needs-grid">
          <div className="need-card">
            <h3>Instant Response</h3>

            <p>
              Patients can receive an immediate response instead of waiting on
              hold or reaching voicemail.
            </p>
          </div>

          <div className="need-card">
            <h3>Appointment Support</h3>

            <p>
              Help patients move from an enquiry towards an appropriate
              appointment or next step.
            </p>
          </div>

          <div className="need-card">
            <h3>Extended Availability</h3>

            <p>
              Continue handling routine patient enquiries beyond normal
              reception hours.
            </p>
          </div>

          <div className="need-card">
            <h3>Consistent Patient Experience</h3>

            <p>
              Give prospective patients a fast and consistent first interaction
              with your practice.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST / MISSION
      ===================================================== */}

      <section className="trust-section">
        <h2>Built With A Simple Mission</h2>

        <div className="trust-grid">
          <div className="trust-card">
            <p>
              "We built this system around one simple question: how can
              healthcare practices capture more patient opportunities before
              they are lost?"
            </p>

            <strong>— Cleavon A.</strong>

            <br />

            <span>Founder, Skill Digital Solutions</span>
          </div>

          <div className="trust-card">
            <p>
              "The goal is not to replace your reception team. The goal is to
              help your practice handle opportunities your team cannot always
              reach."
            </p>

            <strong>— Skill Digital Solutions</strong>
          </div>

          <div className="trust-card">
            <p>
              "Every missed enquiry represents a conversation that never
              happened. The right technology can help practices respond more
              consistently."
            </p>

            <strong>— Revenue Recovery System</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          REPORT CONNECTION
      ===================================================== */}

      <section className="value-section">
        <h2>
          Your Revenue Recovery Report Identifies The Opportunity. Technology
          Helps You Act On It.
        </h2>

        <div className="value-grid">
          <div>Reduce missed enquiries</div>

          <div>Capture after-hours opportunities</div>

          <div>Improve response time</div>

          <div>Support more appointment opportunities</div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="final-demo-section">
        <h2>
          What Could Your Practice Recover
          <br />
          From Better Enquiry Handling?
        </h2>

        <p>
          See how an AI receptionist could fit into your existing patient
          enquiry and appointment workflow.
        </p>

        <a
          href="https://calendly.com/cleavondigital/marketing-ai-growth-strategy-session"
          className="final-button"
        >
          Book My Revenue Recovery Strategy Call
        </a>
      </section>
    </main>
  );
}
