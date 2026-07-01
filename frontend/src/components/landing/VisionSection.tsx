const fishImage = "/src/assets/fishWaste.jpeg";
const hyacinthImage = "/src/assets/dryHyacinth.jpeg";

const VISION_CARDS = [
  {
    tag: "Coming Q3 2027",
    title: "Fish waste Collection",
    description:
      "Converting waste from the fishing industry into protein-rich animal feed and high-quality fish oil for medicine.",
    image: fishImage,
  },
  {
    tag: "Scaling Operations",
    title: "Dry Hyacinth Optimization",
    description:
      "Making moisture-controlled collection systems to produce high-quality fibers for clothing and high-energy briquettes for fuel.",
    image: hyacinthImage,
  },
];

export function VisionSection() {
  return (
    <section id="vision" className="px-8 py-20 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-bold">
            Vision <span className="text-primary">v2.0</span>
          </h2>
          <p className="text-muted mt-2 max-w-sm">
           Moving beyond water hyacinth to turn all types of lake waste into wealth for the local region.
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/10 px-4 py-2 rounded-full">
          ✦ 2027 Roadmap
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VISION_CARDS.map((card) => (
          <div
            key={card.title}
            className="relative rounded-2xl overflow-hidden border border-border-ui min-h-[320px] flex flex-col justify-end p-6"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark gradient overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent z-0" />

            {/* Decorative texture overlay */}
            <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-primary/30"
                  style={{
                    width: `${(i + 1) * 40}px`,
                    height: `${(i + 1) * 40}px`,
                    top: `${Math.random() * 60}%`,
                    left: `${Math.random() * 60}%`,
                  }}
                />
              ))}
            </div>

            {/* Content Container (z-10 brings it above the overlay) */}
            <div className="relative z-10">
              <p className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <span className="w-6 border-t border-primary" />
                {card.tag}
              </p>
              <h3 className="text-xl font-bold text-white mt-2">
                {card.title}
              </h3>
              <p className="text-sm text-white/80 mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}