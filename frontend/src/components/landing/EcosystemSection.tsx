import { ECOSYSTEM_FEATURES } from "../../api/mockLanding";

export function EcosystemSection() {
  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-1">
        The Marketplace <span className="text-primary">Ecosystem</span>
      </h2>
      <p className="text-muted text-center text-sm mb-8 max-w-sm mx-auto">
        A circular economy connecting harvesters, buyers, and verified
        biomass output, end to end.
      </p>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {ECOSYSTEM_FEATURES.map(({ icon: Icon, title, description, ctaLabel }) => (
          <div
            key={title}
            className="rounded-tile bg-tile border border-border-ui p-5"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon size={18} />
            </span>
            <h3 className="font-bold mt-3">{title}</h3>
            <p className="text-sm text-muted mt-1">{description}</p>
            <button
              type="button"
              className="text-sm font-semibold text-primary mt-3 hover:underline"
            >
              {ctaLabel} →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}