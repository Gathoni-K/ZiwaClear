# 🌿 ZiwaClear
> **From Ecological Crisis to Circular Economy** > A biomass marketplace platform transforming Lake Victoria's water hyacinth infestation into a renewable resource, connecting off-grid youth harvesters with commercial biogas and fertilizer producers.

---

## The Problem
Lake Victoria is currently facing an unprecedented ecological crisis due to the rapid spread of water hyacinth (doubling in biomass every 14 days). 
* **Economic Devastation:** Causes **$80M** in annual fishery losses across Kenya, Uganda, and Tanzania.
* **Climate Hazard:** Infested waters emit 25–100 mg of methane per m²/day.
* **Socio-Economic Challenge:** Lakeside communities face up to **55% youth unemployment**.

Existing solutions focus on expensive mechanical harvesting or slow biological controls. The real bottleneck is a **coordination failure**: buyers need the biomass, and locals need jobs, but there is no logistical or informational infrastructure connecting them.

## What It Does (The Solution)
ZiwaClear doesn't harvest hyacinth or produce biogas itself. Instead, it provides the missing digital infrastructure—information, coordination, trust, and logistics—enabling existing actors to transact efficiently.

Our platform operates on three integrated layers:
1. **Supply Side (Harvesters):** Off-grid youth use basic feature phones to log their harvested biomass via SMS/USSD using natural language (Swahili, English, or Sheng). 
2. **Demand Side (Buyers):** Commercial producers access a live, interactive web dashboard showing real-time biomass inventory, mapping, and routing. 
3. **Intelligence Layer:** An AI-powered engine processes incoming SMS data, calculates yields (biogas output, fertilizer yield), and tracks impact metrics (methane avoided, lake area cleared).

## 🛠 Tech Stack
We built a scalable, lean, full-stack JavaScript/TypeScript architecture:

**Frontend (Demand Side)**
* **React & TypeScript:** Robust, type-safe web dashboard for commercial buyers.
* **Leaflet.js:** Interactive mapping for real-time inventory geolocation and logistics routing.

**Backend & Database**
* **Node.js & Supabase:** Fast, secure database and backend logic for handling users, transactions, and inventory.
* **TypeScript Yield Predictor:** Custom logic utilizing peer-reviewed conversion factors to calculate carbon offsets and biomethane yields.

**AI & Integrations (Supply Side & Payments)**
* **Africa's Talking API:** Handles SMS/USSD communication for offline users without smartphones.
* **LangChain & Vercel AI SDK:** NLP agents that parse unstructured SMS messages (e.g., "I got 50kg at Dunga") into structured database records.
* **M-Pesa API:** Facilitates instant digital wallet payouts to harvesters upon batch confirmation.

##  How It Works
1. **Log Biomass:** A harvester pulls hyacinth from the lake and texts *"Nimevuna 100kg Dunga Beach"* to the ZiwaClear shortcode.
2. **AI Parsing:** The LangChain NLP agent parses the location, weight, and harvester ID, instantly updating the Supabase database.
3. **Marketplace Matching:** The batch appears on the buyer's interactive Leaflet map. 
4. **Claim & Pay:** A biogas producer claims the batch. The system calculates the logistics route, and upon confirmation, triggers an instant M-Pesa payout to the harvester.

##  Measurable Impact
ZiwaClear is designed for immediate socio-economic and environmental returns. By Year 3, our projections target:
* **800 Green Jobs:** Active youth harvesters earning 2–3× the typical rural daily wage.
* **5,000 tCO₂e Methane Avoided:** Equivalent to removing 1,087 passenger vehicles from the road.
* **36,000 m² Lake Restored:** Enhancing biodiversity and restoring local fisheries.

*(All metrics are calculated using transparent conversion factors in our Node backend, making the platform fully carbon-credit ready).*

---

## Running Locally

### Prerequisites
* Node.js (v18+)
* Supabase Account
* Africa's Talking Sandbox Account

