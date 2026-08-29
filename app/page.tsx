import Header from "@/components/Header";

import AssessmentContainer from "@/components/assessment/AssessmentContainer";

import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import HowItWorks from "@/components/landing/HowItWorks";
import AIReceptionistCTA from "@/components/landing/AIReceptionistCTA";

export default function Home() {
  return (
    <main>
      <div className="container">
        <Header />

        <HeroSection />

        <div id="assessment">
          <AssessmentContainer />
        </div>

        <TrustSection />

        <HowItWorks />

        <AIReceptionistCTA />
      </div>
    </main>
  );
}
