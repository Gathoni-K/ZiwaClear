# 🌿 ZiwaClear
> **Early Warning and Early Action for a Climate-Driven Lake Crisis**
> A real-time SMS/USSD monitoring and alerting platform that detects water hyacinth bloom risk early and triggers rapid harvester and health-agency response — turning cleared biomass into income for rural youth, restoring Lake Victoria's blue economy, and strengthening regional food security.

Built for the IGAD Hackathon 2026.

---

## The Problem

Lake Victoria's Winam Gulf is trapped in a climate-driven feedback loop:

* **Fishery collapse:** a 66% catch decline across a market millions depend on directly or indirectly. <!-- TODO: confirm this figure against the deck's cited source (IPBES/IGAD Report 2024) and use identical wording in both places -->
* **Disease vector expansion:** 17,000 hectares of stagnant-mat habitat breeding malaria mosquitoes and bilharzia-host snails, and blocking clean water points.
* **Proven health correlation:** hyacinth coverage and cholera incidence move together (r=0.83, P=0.0010) in Nyanza. <!-- source: Feikin et al., AJTMH/PubMed -->
* **Climate acceleration:** rising temperatures and altered rainfall/runoff are shortening bloom-recovery cycles, not just sustaining them.
* **Youth unemployment:** up to 61% in lakeside communities. <!-- TODO: reconcile with the 55% figure previously used here; pick one number and cite it identically in the deck and this README -->

20+ years and $70M+ in donor-funded mechanical and biological removal have failed, because clearance carries no economic incentive and stops the moment funding ends. The bottleneck isn't harvesting capacity — it's coordination: buyers don't know what's available, harvesters don't know who's buying, and nobody is warned before a bloom becomes a health or food-security emergency.

## The Solution

ZiwaClear doesn't harvest hyacinth or produce biogas itself. It provides the missing infrastructure — detection, prediction, alerting, and market coordination — so existing actors (harvesters, buyers, health agencies) can act before a crisis escalates, and so harvesting itself pays enough to be self-sustaining without ongoing donor funding.

The system runs a four-stage loop: **Detect → Predict → Alert → Act (with Acknowledgment)**.

### 1. Detect — Supply side (harvesters, SMS/USSD)
A harvester texts a harvest report in natural language — English, Swahili, or Sheng, using real local units like "gunia" or "fuso" — to the Africa's Talking shortcode. `POST /api/sms/incoming` first checks whether the message is a `RECEIVED`/`CLEARED` reply to an open alert (routed to the acknowledgment loop, see below); otherwise it's parsed by an LLM-based parser (regex fallback if no `LLM_MODEL` is configured) into location, quantity, and quality. A `batches` row is created and the harvester is upserted by phone number. A Swahili confirmation SMS is sent back.

### 2. Predict — Risk scoring
Every time coverage is reported for a landing site (via real SMS ingestion, the coverage-spike simulation endpoint, or a manual trigger), the system:
- pulls current temperature/precipitation from Open-Meteo (cached hourly),
- computes a temperature *anomaly* against a hardcoded seasonal baseline for that site (never an absolute cutoff),
- derives a coverage trend (`rising_fast` / `rising_slow` / `flat` / `falling`) from the last 3 readings,
- and evaluates risk tier — `emergency > warning > watch > normal`, highest severity first — persisting `riskLevel` on the landing site.

### 3. Alert — Tiered, multi-recipient dispatch
The BMU leader is notified on any non-normal tier; the county health officer is added on warning/emergency, given the documented cholera correlation; a water/WASH officer is added if the site is flagged as blocking a water point. Each dispatch is CAP-shaped (`eventType`, `severity`, `area`, `timestamp`, `recommendedAction`) without a full CAP/XML implementation. The `normal` tier never dispatches SMS, to avoid alert fatigue on routine readings.

### 4. Act & Acknowledge — Closing the loop
Harvesters mobilize at premium payout rates. Recipients reply `RECEIVED` or `CLEARED` by SMS to close the loop against that alert, with a timestamp. `GET /api/batches/impact/alert-response` reports average time-to-acknowledge/time-to-resolve — the metric that proves the loop actually closes, not just fires.

### Demand side — Buyers (React dashboard)
Buyers log in via Supabase auth, gated both client-side (`ProtectedRoute`) and server-side (claim/collect/delete). They see live available batches on a Leaflet map and sidebar (`GET /api/batches`), claim them (`POST /:id/claim`), and collect them (`POST /:id/collect`), which triggers a mock M-Pesa payout and marks the batch `collected`. The Impact page computes cumulative surface area restored, biogas generated, and CO2e avoided from real conversion factors on `claimed`/`collected` batches only.

## 🛠 Tech Stack

**Frontend:** React, TypeScript, Leaflet.js
**Backend:** Node.js, Supabase (Postgres + Drizzle ORM), TypeScript
**AI & Integrations:** Africa's Talking (SMS/USSD), LangChain / Vercel AI SDK (NLP parsing), Open-Meteo (weather), M-Pesa API (mock payouts in this build)

## Getting Started

### Prerequisites
* Node.js v18+
* A Supabase project (Postgres connection string)
* An Africa's Talking sandbox account
* Copy `.env.example` to `.env` and fill in: Supabase connection string, `AFRICASTALKING_SHORTCODE`, Africa's Talking API key, `LLM_MODEL` (optional — omit to use the regex fallback parser only)

### Install & run
```bash
# backend
cd backend
npm install
npx drizzle-kit migrate      # applies all migrations, including 0003_alert_pipeline.sql
npm run db:seed              # base beaches / buyer / harvester data
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

### Running the demo scenario
There is no funded pilot deployment. Dunga and Usenge are used as demo pilot sites only.

```bash
cd backend
npm run db:seed:demo-scenario
```

This seeds a short coverage-reading history crossing the watch/warning/emergency boundaries, realistic multilingual SMS fixtures, and runs one full **Detect → Predict → Alert → Act → Acknowledge** scenario through the real services (not hardcoded JSON), logging each step to the console so it can be shown live alongside the dashboard's Simulation Panel.

**This is demo/seed data only** — not live pilot data, and not presented as such anywhere in this repo or the submission materials.


## Roadmap
* Live Sentinel-2 verification of coverage data
* Community syndromic-reporting channel (self-reported symptom clusters via SMS, cross-referenced against coverage spikes)
* Full CAP/XML alert formatting for interoperability with national/regional EWS infrastructure
* Live M-Pesa integration
* Integrate the collection of fish waste.
