const STEPS = [
  {
    title: "Decentralized Harvesting",
    description:
      "Empowering local cooperatives with specialized equipment and mobile logging apps.",
  },
  {
    title: "Intelligent Matching",
    description:
      "Our AI matches harvesters with the nearest biogas or organic fertilizer producers to minimize carbon footprint.",
  },
  {
    title: "Industrial Output",
    description:
      "High-purity biomass delivered consistently for industrial-scale renewable energy and soil health products.",
  },
];

const supplyImage = "/src/assets/supplyImg.webp";

export function EcosystemSection() {
  const scrollToPartner = () => {
    const section = document.getElementById("partner");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="solution" className="px-8 py-20 bg-tile/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: app mockup */}
        <div className="rounded-2xl overflow-hidden border border-border-ui bg-[#0A1628] min-h-[380px] relative">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-ui">
            <span className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px]">Z</span>
              ZIWACLEAR®
            </span>
            <span className="text-muted">⋯</span>
          </div>

          {/* Industrial image placeholder */}
          <div className="h-48 bg-gradient-to-b from-[#1a3a5c] to-[#0a1628] flex items-full justify-center overflow-full">
            <img src={supplyImage} alt="Supply Chain" className="h-full object-cover" />
          </div>

          {/* Floating card */}
          <div className="absolute bottom-4 left-4 right-4 bg-tile/95 backdrop-blur border border-border-ui rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">✓</span>
              <p className="font-bold text-sm">Traceable Supply Chain</p>
            </div>
            <p className="text-xs text-muted mt-2">
              Every kilogram of biomass is tracked from harvesting site to
              processing facility via our blockchain-backed marketplace.
            </p>
          </div>
        </div>

        {/* Right: numbered steps */}
        <div>
          <h2 className="text-3xl font-bold">
            The Marketplace{" "}
            <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-muted mt-3">
            ZiwaClear creates a circular economy by streamlining the path from
            pest to product.
          </p>

          <ol className="flex flex-col gap-5 mt-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-primary text-background text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="text-sm text-muted mt-1">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={scrollToPartner}
            className="mt-8 px-6 py-2.5 border border-primary text-primary rounded-pill text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            View Process Details
          </button>
        </div>
      </div>
    </section>
  );
}