import { VISION_ITEMS } from "../../api/mockLanding";

export function VisionSection() {
  return (
    <section id="vision" className="px-6 py-10 bg-tile/40">
      <h2 className="text-2xl font-bold text-center mb-1">
        Vision <span className="text-primary">v2.0</span>
      </h2>
      <p className="text-muted text-center text-sm mb-2 max-w-sm mx-auto">
        Approved milestones for system expansion and scaling to handle the
        lake's full hyacinth coverage.
      </p>
      <p className="text-center mb-6">
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          2025 Roadmap
        </span>
      </p>

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {VISION_ITEMS.map((item) => (
          <div
            key={item.label}
            className="rounded-tile overflow-hidden border border-border-ui"
          >
            {/* Image placeholder — swap for a real photo asset later */}
            <div className="h-36 bg-gradient-to-br from-[#0B3D4C] via-[#0A2A38] to-background flex items-end p-4">
              <span className="text-xs font-semibold text-primary bg-background/70 px-2 py-1 rounded-full uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}