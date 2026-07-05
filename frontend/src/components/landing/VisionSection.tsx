import fishImage from "../../assets/fishWaste.jpeg";
import hyacinthImage from "../../assets/dryHyacinth.jpeg";

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
    <section id="vision" className="px-4 md:px-8 py-16 md:py-20 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold">
            Vision <span className="text-primary">v2.0</span>
          </h2>
          <p className="text-muted mt-2 max-w-sm text-sm md:text-base">
            Moving beyond water hyacinth to turn all types of lake waste into wealth for the local region.
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shrink-0 self-start">
          ✦ 2027 Roadmap
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {VISION_CARDS.map((card) => (
          <div
            key={card.title}
            className="relative rounded-2xl overflow-hidden border border-border-ui min-h-[240px] md:min-h-[320px] flex flex-col justify-end p-4 md:p-6"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent z-0" />

            {/* Content */}
            <div className="relative z-10">
              <p className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <span className="w-4 md:w-6 border-t border-primary" />
                {card.tag}
              </p>
              <h3 className="text-lg md:text-xl font-bold text-white mt-2">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-white/80 mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}