import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="px-6 py-16 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
        Turning an Ecological{" "}
        <span className="text-primary">Crisis</span> into Climate{" "}
        <span className="text-primary">Value.</span>
      </h1>

      <p className="text-muted mt-4 max-w-md mx-auto">
        ZiwaClear is a high-impact marketplace converting Lake Victoria's
        harvesters with biogas and fertilizer buyers, transforming invasive
        water hyacinth into sustainable, scalable industrial output.
      </p>

      <div className="flex items-center justify-center gap-3 mt-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-primary text-background font-semibold text-sm px-5 py-3 rounded-pill hover:bg-primary-hover transition-colors"
        >
          Access Marketplace <ArrowRight size={16} />
        </Link>
        <a
          href="#vision"
          className="text-sm font-semibold px-5 py-3 rounded-pill border border-border-ui hover:bg-input transition-colors"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}