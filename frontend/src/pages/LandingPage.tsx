import { LandingNav } from "../components/landing/LandingNav";
import { HeroSection } from "../components/landing/HeroSection";
import { CrisisSection } from "../components/landing/CrisisSection";
import { EcosystemSection } from "../components/landing/EcosystemSection";
import { VisionSection } from "../components/landing/VisionSection";
import { PartnerSection } from "../components/landing/PartnerSection";
import { LandingFooter } from "../components/landing/LandingFooter";

function LandingPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-background text-foreground">
      <LandingNav />
      <HeroSection />
      <CrisisSection />
      <EcosystemSection />
      <VisionSection />
      <PartnerSection />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;