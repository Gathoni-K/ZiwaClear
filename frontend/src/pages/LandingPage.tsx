import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { HeroSection } from "../components/landing/HeroSection";
import { CrisisSection } from "../components/landing/CrisisSection";
import { EcosystemSection } from "../components/landing/EcosystemSection";
import { VisionSection } from "../components/landing/VisionSection";
import { PartnerSection } from "../components/landing/PartnerSection";
import { LandingFooter } from "../components/landing/LandingFooter";

function LandingPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <HeroSection />
      <CrisisSection />
      <EcosystemSection />
      <VisionSection />
      <PartnerSection />
      <LandingFooter />

      {visible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[1100] w-10 h-10 rounded-full bg-primary text-background shadow-lg flex items-center justify-center hover:bg-primary-hover transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

export default LandingPage;