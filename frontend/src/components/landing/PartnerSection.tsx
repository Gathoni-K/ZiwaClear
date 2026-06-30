import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Guaranteed Volume & Quality",
  "Live Batch Tracking",
  "Verified Carbon Credits",
];

export function PartnerSection() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to a real lead-capture endpoint once the backend exists
    console.log("Expression of interest:", { companyName, email });
    setSubmitted(true);
  }

  return (
    <section className="px-6 py-10">
      <div className="max-w-md mx-auto rounded-tile bg-tile border border-border-ui p-6">
        <h2 className="text-2xl font-bold">
          Partner With <span className="text-primary">ZiwaClear</span>
        </h2>
        <p className="text-sm text-muted mt-1">
          Join the institutional investors and producers driving real,
          measurable climate impact across the Lake Victoria basin.
        </p>

        <ul className="flex flex-col gap-2 mt-4">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} className="text-primary shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>

        {submitted ? (
          <p className="text-sm text-primary font-semibold mt-5">
            Thanks! We'll be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
            <input
              type="text"
              required
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              type="email"
              required
              placeholder="Work Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              className="bg-primary text-background font-semibold text-sm py-2.5 rounded-pill hover:bg-primary-hover transition-colors"
            >
              Submit Expression of Interest
            </button>
          </form>
        )}
      </div>
    </section>
  );
}