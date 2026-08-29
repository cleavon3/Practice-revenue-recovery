import Header from "@/components/Header";

import AssessmentContainer from "@/components/assessment/AssessmentContainer";

import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import HowItWorks from "@/components/landing/HowItWorks";
import AIReceptionistCTA from "@/components/landing/AIReceptionistCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* =====================================================
          HERO
          Primary job: get visitors into the assessment
      ===================================================== */}

      <HeroSection />

      {/* =====================================================
          REVENUE RECOVERY ASSESSMENT
      ===================================================== */}

      <section
        id="assessment"
        className="scroll-mt-24 bg-[#f8fafb] py-16 sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <AssessmentContainer />
        </div>
      </section>

      {/* =====================================================
          TRUST / CREDIBILITY
      ===================================================== */}

      <TrustSection />

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <HowItWorks />

      {/* =====================================================
          AI RECEPTIONIST
          Position this as the solution, not the initial offer.
      ===================================================== */}

      <AIReceptionistCTA />
    </main>
  );
}
