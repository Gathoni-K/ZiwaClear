import { Link } from "react-router-dom";
import { ArrowRight, Users, Leaf, TrendingUp, MapPin } from "lucide-react";


const IMPACT_STATS = [
  { icon: Users, value: "800", label: "Green jobs targeted by Year 3" },
  { icon: Leaf, value: "5,000", label: "tCO₂e methane avoided" },
  { icon: TrendingUp, value: "36,000", label: "m² lake surface restored" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-8 py-24 text-center border-b border-border-ui">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-primary/10">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            From Ecological Crisis{" "}
            <span className="text-primary">to Circular Economy</span>
          </h1>
          <p className="text-muted mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            ZiwaClear was born on the shores of Lake Victoria, where water
            hyacinth — an invasive species doubling in biomass every 14 days —
            has devastated fisheries, clogged waterways, and become a major
            source of methane emissions. We saw not just a crisis, but a
            coordination problem waiting to be solved.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="px-8 py-20 bg-tile/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">The Problem We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-tile border border-border-ui rounded-xl p-6">
              <p className="font-bold text-primary text-2xl mb-2">$80M</p>
              <p className="text-muted">
                Annual fishery losses across Kenya, Uganda, and Tanzania due to
                hyacinth infestations.
              </p>
            </div>
            <div className="bg-tile border border-border-ui rounded-xl p-6">
              <p className="font-bold text-primary text-2xl mb-2">55%</p>
              <p className="text-muted">
                Youth unemployment in lakeside communities — a massive untapped
                workforce.
              </p>
            </div>
            <div className="bg-tile border border-border-ui rounded-xl p-6">
              <p className="font-bold text-primary text-2xl mb-2">100 mg</p>
              <p className="text-muted">
                Methane emitted per m² per day from infested waters, accelerating
                climate change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <p className="text-muted mb-10 leading-relaxed">
            We don&apos;t harvest hyacinth or produce biogas ourselves. Instead,
            we provide the missing digital infrastructure — information,
            coordination, trust, and logistics — that connects harvesters and
            buyers in a functioning marketplace.
          </p>

          <div className="flex flex-col gap-6">
            {[
              {
                step: "01",
                title: "Harvesters log biomass via SMS",
                desc: "Off-grid youth pull hyacinth and text simple messages like 'Nimevuna 100kg Dunga Beach' to our shortcode. No smartphone required.",
              },
              {
                step: "02",
                title: "AI parses and verifies",
                desc: "Our NLP engine (LangChain + Africa's Talking) extracts location, weight, and harvester ID, updating the Supabase database in real time.",
              },
              {
                step: "03",
                title: "Buyers claim on the dashboard",
                desc: "Commercial biogas and fertilizer producers see live inventory on a Leaflet map. One click reserves a batch and triggers routing.",
              },
              {
                step: "04",
                title: "Instant M-Pesa payout",
                desc: "Once a batch is confirmed collected, the harvester receives payment directly to their mobile wallet — no bank account needed.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex gap-5 bg-tile border border-border-ui rounded-xl p-6"
              >
                <span className="text-3xl font-bold text-primary shrink-0">
                  {step}
                </span>
                <div>
                  <p className="font-bold text-lg">{title}</p>
                  <p className="text-sm text-muted mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="px-8 py-20 bg-tile/20 border-t border-border-ui">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">Measurable Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMPACT_STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-tile border border-border-ui rounded-xl p-6"
              >
                <Icon size={28} className="text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted mt-2">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-6">
            All metrics calculated using peer-reviewed conversion factors,
            making the platform fully carbon-credit ready.
          </p>
        </div>
      </section>


      {/* CTA */}
      <section className="px-8 py-20 border-t border-border-ui text-center">
        <div className="max-w-2xl mx-auto">
          <span className="flex items-center justify-center gap-2 text-xs text-muted mb-3">
            <MapPin size={14} className="text-primary" />
            Kisumu Hub, Kenya
          </span>
          <h2 className="text-2xl font-bold mb-4">
            Want to partner with us?
          </h2>
          <p className="text-muted mb-6 text-sm leading-relaxed">
            We&apos;re actively seeking biogas producers, fertilizer companies,
            carbon-offset buyers, and impact investors to scale the marketplace
            across the Great Lakes region.
          </p>
          <Link
            to="/#partner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-pill text-sm hover:bg-primary-hover transition-colors"
          >
            Partner With Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}