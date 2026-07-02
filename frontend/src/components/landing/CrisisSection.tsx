import { Droplets, Wind, TrendingDown } from "lucide-react";

const CRISIS_STATS = [
  {
    icon: Droplets,
    title: "Clogged Waterways",
    description:
      "Dense hyacinth mats block critical navigation channels, crippling local boat trade and isolating fishing communities from their primary source of income.",
  },
  {
    icon: Wind,
    title: "Oxygen Depletion",
    description:
      "The rapid decomposition of biomass under the surface starves the lake of oxygen, leading to massive fish kills and a collapsing aquatic ecosystem.",
  },
  {
    icon: TrendingDown,
    title: "Economic Impact",
    description:
      "With over 30 million people dependent on the lake, the infestation threatens food security and regional economic stability on an unprecedented scale.",
  },
];

export function CrisisSection() {
  return (
    <section id="crisis" className="px-8 py-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center">The Hyacinth Crisis</h2>
      <p className="text-muted text-center mt-3 max-w-lg mx-auto">
        An invasive threat is choking Africa's largest freshwater lake,
        demanding an{" "}
        <span className="text-primary">industrial-scale intervention.</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        {CRISIS_STATS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-tile bg-tile border border-border-ui p-6"
          >
            <span className="w-10 h-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
              <Icon size={18} />
            </span>
            <h3 className="font-bold text-lg mt-4">{title}</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}