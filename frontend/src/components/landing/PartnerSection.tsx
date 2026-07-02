import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  "Guaranteed Volume & Quality",
  "Live Batch Impact Tracking",
  "Verified Carbon Credits",
];

const BUSINESS_TYPES = [
  "Commercial Buyer",
  "Biogas Producer",
  "Fertilizer Producer",
  "Institutional Investor",
  "NGO / Research Partner",
];

export function PartnerSection() {
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("Commercial Buyer");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Expression of interest:", { companyName, businessType, email, interest });
    setSubmitted(true);
  }

  return (
    <section className="px-8 py-20 bg-tile/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: pitch + benefits */}
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Partner With{" "}
            <span className="text-primary">ZiwaClear</span>
          </h2>
          <p className="text-muted mt-4 max-w-sm">
           Join East Africa's leading market for climate technology. Secure your supply chain with accurate data on biomass materials.
          </p>

          <ul className="flex flex-col gap-3 mt-6">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border-ui pt-6">
            <p className="text-xs uppercase tracking-widest text-muted">
              Powered by
            </p>
            <p className="text-sm font-bold text-primary mt-1">
              ✦ ZiwaInsight
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl bg-tile border border-border-ui p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={40} className="text-primary mx-auto mb-3" />
              <p className="font-bold text-lg">Thank you!</p>
              <p className="text-muted text-sm mt-1">
                We'll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted block mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Global Energy Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted block mb-1.5">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="partnerships@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted block mb-1.5">
                  Partnership Interest
                </label>
                <textarea
                  rows={3}
                  placeholder="How can we collaborate?"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-input border border-border-ui rounded-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-background font-semibold text-sm py-3 rounded-pill hover:bg-primary-hover transition-colors"
              >
                Submit Expression of Interest
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}