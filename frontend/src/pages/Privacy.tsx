import { Shield, Smartphone, CreditCard, MapPin, Database, Lock } from "lucide-react";

const PRACTICES = [
  {
    icon: Smartphone,
    title: "SMS & USSD Data",
    desc: "Harvester messages are processed solely to extract biomass weight, location, and sender identity for marketplace matching. Raw messages are never shared with third parties.",
  },
  {
    icon: CreditCard,
    title: "M-Pesa Transactions",
    desc: "Payment phone numbers and transaction references are encrypted at rest. We do not store M-Pesa PINs or full account balances — only confirmation receipts for audit trails.",
  },
  {
    icon: MapPin,
    title: "Location Data",
    desc: "GPS coordinates from harvest sites are used exclusively for logistics routing and impact verification (lake area restored, methane avoided). Personal harvester locations are not publicly exposed.",
  },
  {
    icon: Database,
    title: "Biomass & Supply Chain Tracking",
    desc: "Batch weights, material types, and buyer claims form a verifiable chain-of-custody for carbon credit audits. Aggregated, anonymized data may be shared with certified verification bodies.",
  },
  {
    icon: Shield,
    title: "Data Subject Rights",
    desc: "Harvesters and buyers may request access to, correction of, or deletion of their personal data by contacting our team. We commit to responding within 14 business days.",
  },
  {
    icon: Lock,
    title: "Security",
    desc: "All data in transit is encrypted via TLS. Our database (Supabase) enforces row-level security, ensuring each user can only access their own transactions and batch records.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 text-center border-b border-border-ui">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-4 px-3 py-1 rounded-full bg-primary/10">
            Your Data, Protected
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Legal &amp;{" "}
            <span className="text-primary">Privacy</span>
          </h1>
          <p className="text-muted mt-4 md:mt-6 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
            ZiwaClear handles sensitive data — from harvester identities sent via
            SMS to M-Pesa financial transactions. We take this responsibility
            seriously. Here&apos;s how we protect every participant in the
            marketplace.
          </p>
        </div>
      </section>

      {/* Data practices */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-10 text-center">
            How We Handle Your Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {PRACTICES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-tile border border-border-ui rounded-xl p-4 md:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary md:size-18" />
                  </div>
                  <p className="font-bold text-xs md:text-sm">{title}</p>
                </div>
                <p className="text-xs md:text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact note */}
      <section className="px-4 md:px-8 py-12 md:py-16 border-t border-border-ui text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted text-xs md:text-sm leading-relaxed">
            For full data requests, deletion inquiries, or questions about our
            privacy practices, contact us at{" "}
            <span className="text-primary font-medium">
              hello@ziwaclear.com
            </span>
            .
          </p>
          <p className="text-[10px] md:text-xs text-muted mt-4">
            Last updated: June 2026 &nbsp;|&nbsp; Version 1.0
          </p>
        </div>
      </section>
    </div>
  );
}