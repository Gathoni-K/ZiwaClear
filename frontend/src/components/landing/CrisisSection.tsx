import { CRISIS_STATS } from "../../api/mockLanding";

export function CrisisSection() {
  return (
    <section className="px-6 py-10 bg-tile/40">
      <h2 className="text-2xl font-bold text-center mb-1">
        The Hyacinth Crisis
      </h2>
      <p className="text-muted text-center text-sm mb-8 max-w-sm mx-auto">
        An invasive species threatening livelihoods, biodiversity, and
        regional economic stability across the Lake Victoria basin.
      </p>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {CRISIS_STATS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-tile bg-tile border border-border-ui p-5"
          >
            <span className="w-10 h-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center">
              <Icon size={18} />
            </span>
            <h3 className="font-bold mt-3">{title}</h3>
            <p className="text-sm text-muted mt-1">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}