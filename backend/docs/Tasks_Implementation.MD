# ZIWACLEAR — BACKEND DOCUMENTATION

## Hackathon Status: Ready for Deployment

---

## 1. WHAT THIS BACKEND DOES

ZiwaClear's backend is a Node.js/Express API that powers a circular-economy marketplace connecting water hyacinth harvesters on Lake Victoria with biogas and fertilizer buyers.

**Core flow:** A harvester sends an SMS → Langchain AI parses it → batch appears on a live map → buyer claims it → harvester gets a confirmation SMS → buyer collects → ecological impact is calculated.

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js with TypeScript |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| AI Parsing | Langchain + OpenAI (GPT-3.5-turbo) |
| SMS Gateway | Africa's Talking |
| AI Chatbot | Vercel AI SDK |
| Validation | Zod |
| Security | Supabase Row-Level Security (RLS) |
| Deployment | Railway / Render |

---

## 3. DATABASE SCHEMA

### Tables

**beaches** — Reference table for Lake Victoria landing sites.
- `id` (serial, PK)
- `name`, `county`, `lake`
- `latitude`, `longitude` (decimal, 7 decimal places)
- `isActive` (boolean)
- RLS: Public read access (map needs coordinates)

**batches** — The core table. One row = one harvester's harvest.
- `id` (uuid, PK, auto-generated)
- `quantityKg` (real) — weight of hyacinth harvested
- `locationName` (varchar) — e.g., "Dunga", "Usenge"
- `beachId` (integer, FK → beaches)
- `latitude`, `longitude` (real) — for map pin placement
- `status` (text) — `available` | `claimed` | `collected` | `flagged`
- `harvesterPhone` (varchar) — phone number that sent the SMS
- `harvesterName` (varchar, nullable)
- `buyerId` (uuid, nullable) — filled when claimed
- `qualityRating` (integer, nullable) — 1-5, filled on collection
- `claimedAt`, `collectedAt` (timestamps)
- `createdAt`, `updatedAt` (timestamps)
- RLS: Public read, authenticated write

**sms** — Raw incoming messages and parsing results.
- `id` (uuid, PK)
- `rawMessage` (text) — the exact SMS text
- `senderPhone` (varchar)
- `receivedAt` (timestamp)
- `parsedData` (jsonb) — structured output from Langchain
- `parsedSuccessfully` (boolean)
- `parseError` (text, nullable)
- `batchId` (uuid, FK → batches) — links SMS to created batch
- `beachId` (integer, FK → beaches)
- RLS: Public read, authenticated insert

**harvesters** — Harvester profiles (locked down).
- `id` (uuid, PK)
- `phoneNumber` (text, unique)
- `name`, `location`
- RLS: Fully locked (anon cannot access)

**buyers** — Buyer company profiles (locked down).
- `id` (uuid, PK)
- `companyName`, `contactEmail` (unique)
- RLS: Fully locked (anon cannot access)

**transactions** — Payment records (locked down).
- `id` (uuid, PK)
- `batchId` (uuid, FK → batches)
- `buyerId` (uuid, FK → buyers)
- `payoutAmount` (real)
- `mpesaReceiptNumber` (text, nullable)
- `status` (text) — `pending` | `paid`
- RLS: Fully locked (anon cannot access)

### Design Decisions

- **UUIDs** for batches, SMS, harvesters, buyers, transactions — avoids sequential ID guessing and works well with Supabase.
- **`quantityKg` as `real`** — sufficient precision for biomass weight; avoids decimal overhead.
- **`locationName` stored directly on batch** — avoids a join to beaches for every map query; beaches table is for coordinate lookup during parsing.
- **RLS split**: Public tables (beaches, batches, sms) allow `anon` select so the frontend can query freely. Sensitive tables (harvesters, buyers, transactions) use `sql\`false\`` to block anon entirely. The backend uses the Supabase service key and bypasses RLS.

---

## 4. SMS PARSING PIPELINE

### How It Works

1. Africa's Talking receives an SMS at your shortcode.
2. AT forwards it via HTTP POST to `POST /api/sms/incoming`.
3. The SMS service inserts a raw record, then immediately parses it.
4. Langchain (GPT-3.5-turbo) extracts `quantity_kg` and `location`.
5. If parsing succeeds and both fields are present, a batch is created instantly.
6. The SMS record is linked to the batch via `batchId`.
7. An auto-reply SMS is generated confirming the harvest.

### Parser Files

| File | Purpose |
|------|---------|
| `src/services/sms/smsParser.ts` | Main Langchain parser with caching and circuit breaker |
| `src/services/sms/parserSchema.ts` | Zod schema defining expected output: `{ location, quantity_kg, unit }` |
| `src/services/sms/parserPrompts.ts` | Langchain prompt with Swahili/English examples |
| `src/services/sms/parserFallback.ts` | Regex-based fallback parser + circuit breaker class |

### Parser Design Decisions

- **Temperature: 0.1** — nearly deterministic output; we want consistency, not creativity.
- **Timeout: 15 seconds** — AT expects a response within a reasonable window.
- **Caching** — identical messages within 1 hour return cached results (harvesters sometimes double-send).
- **Duplicate detection** — identical message from the same phone within 60 seconds is rejected.
- **Circuit breaker** — after 5 consecutive failures, stops calling Langchain for 60 seconds to avoid burning API credits.
- **Fallback parser** — regex extracts location (Dunga, Usenge, Kendu Bay, Homa Bay, Muhuru Bay) and quantity (matches `kg`, `kilos`, `kilograms`). Returns confidence score of 0.1.

### Supported SMS Formats

The parser handles all of these:
- `Niko na 100kg Dunga` (Swahili)
- `100 kilos at Dunga beach` (English)
- `500kg Usenge` (shorthand)
- `Dunga, 100kg` (reversed)
- `250 kilograms Kendu Bay` (long form)
- `Tumemaliza kuvuna 150kg huko Usenge beach` (verbose Swahili)

---

## 5. API ENDPOINTS

### SMS Routes (`/api/sms`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/sms/incoming` | Public | Africa's Talking webhook. Receives harvester SMS, parses it, creates batch, returns auto-reply. |
| GET | `/api/sms` | Public | List all SMS records (filterable by beach, batch, date). |
| GET | `/api/sms/:id` | Public | Get single SMS record. |

### Batch Routes (`/api/batches`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/batches` | Public | Available batches only (status = "available"). Used by the map. |
| GET | `/api/batches/all` | Public | All batches regardless of status. |
| GET | `/api/batches/impact` | Public | Ecological impact stats: total tonnes, lake area cleared, CO2e avoided. |
| GET | `/api/batches/:id` | Public | Single batch with yield predictions (biogas m³, fertilizer kg N). |
| POST | `/api/batches/:id/claim` | Public | Buyer claims a batch. Requires `{ buyerId }` in body. |
| POST | `/api/batches/:id/collect` | Public | Buyer confirms collection. Optional: `{ qualityRating, notes }`. |
| DELETE | `/api/batches/:id` | Public | Admin delete (soft — unlinks SMS, deletes batch). |

### Ecological Impact Calculation

```
totalTonnes = SUM(quantityKg of all collected batches) / 1000
lakeAreaClearedM2 = totalTonnes × 10        (1 tonne ≈ 10m² cleared)
co2eAvoidedTonnes = totalTonnes × 0.5       (0.5 tCO2e per tonne, IPCC Wetlands Supplement 2014)
```

### Yield Predictions

Attached to every batch detail response:
```
biogasM3 = quantityKg × 0.07       (Gunaseelan 1997)
fertilizerKgN = quantityKg × 0.002 (Woomer et al. 2000)
```

---

## 6. PROJECT STRUCTURE

```
src/
├── app.ts                          # Express entry point, middleware, route mounting
├── db/
│   ├── index.ts                    # Supabase + Drizzle client
│   └── schema/
│       ├── beaches.ts              # Beaches reference table
│       ├── batches.ts              # Core biomass batches table
│       ├── sms.ts                  # Incoming SMS records
│       ├── harvesters.ts           # Harvester profiles (locked)
│       ├── buyers.ts               # Buyer profiles (locked)
│       └── transactions.ts         # Payment records (locked)
│   └── seeds/
│       ├── beaches.ts              # Seed data (5 beaches)
│       └── seedBeaches.ts          # Seed runner script
├── controllers/
│   ├── smsController.ts            # SMS webhook + list/get handlers
│   └── batchController.ts          # Batch CRUD + claim/collect/impact
├── services/
│   ├── smsService.ts               # SMS processing, parsing orchestration
│   ├── batchService.ts             # Batch creation, claiming, collection, impact
│   └── sms/
│       ├── smsParser.ts            # Langchain parser (caching, circuit breaker)
│       ├── parserSchema.ts         # Zod schema for parser output
│       ├── parserPrompts.ts        # Langchain prompt with examples
│       └── parserFallback.ts       # Regex fallback parser + CircuitBreaker class
├── routes/
│   ├── smsRoutes.ts                # SMS route definitions
│   └── batchRoutes.ts              # Batch route definitions
├── validations/
│   ├── smsValidator.ts             # Africa's Talking payload validation
│   └── batchValidator.ts           # Claim/collect request validation
└── middleware/
    ├── requestValidator.ts         # Zod validation middleware
    ├── rateLimiter.ts              # Rate limiting (SMS endpoint)
    └── auth.ts                     # API key authentication (not used on public routes)
```

---

## 7. KEY IMPLEMENTATION DETAILS

### Africa's Talking Webhook Format

AT sends the following fields to your webhook:
```
{
  "text": "Niko na 100kg Dunga",    // The SMS body
  "from": "+254712345678",          // Sender's phone number
  "date": "2026-06-22T08:00:00Z"   // When AT received it
}
```

Your validator matches these exact field names (`text`, `from`, `date`).

### Auto-Reply Mechanism

The SMS controller returns a `reply_message` in the API response. To actually send the SMS back to the harvester, you must either:
- Return the reply in Africa's Talking's expected response format (they will send it), OR
- Call Africa's Talking's SMS API to send the reply programmatically.

Verify which method your AT account uses. If using the response-format method, the reply must follow AT's exact structure. See the Africa's Talking integration section for details.

### Batch Creation Is Synchronous

Unlike the original fish-catch design (which had a cron job batching messages every hour), hyacinth batches are created immediately when the SMS is processed. One SMS = one batch. This ensures real-time map updates.

### Coordinate Resolution

When a batch is created, coordinates are resolved in this order:
1. Query the `beaches` table by location name (case-insensitive).
2. Fall back to a hardcoded lookup for: Dunga, Usenge, Kendu Bay, Homa Bay, Muhuru Bay.
3. If no match, `latitude` and `longitude` are `null` — the batch still appears in list views but won't show on the map.

### RLS and the Backend

The backend connects to Supabase using the service role key (set in environment variables). This bypasses Row-Level Security entirely, so the backend can read/write to locked tables (harvesters, buyers, transactions) while the frontend (using the anon key) can only read public tables.

---

## 8. SEED DATA

### Beaches

| Name | County | Latitude | Longitude |
|------|--------|----------|-----------|
| Dunga | Kisumu | -0.1481 | 34.7336 |
| Usenge | Siaya | -0.0631 | 34.0322 |
| Kendu Bay | Homa Bay | -0.3667 | 34.6500 |
| Homa Bay | Homa Bay | -0.5167 | 34.4500 |
| Muhuru Bay | Migori | -0.7000 | 34.0667 |

To seed: `npx tsx src/db/seeds/seedBeaches.ts`

---

## 9. ENVIRONMENT VARIABLES

```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
AFRICASTALKING_API_KEY=atsk_...
AFRICASTALKING_USERNAME=sandbox
LLM_MODEL=gpt-3.5-turbo
```

---

## 10. COMMANDS

```bash
# Push schema changes to Supabase
npx drizzle-kit push

# Run beach seed script
npx tsx src/db/seeds/seedBeaches.ts

# Start development server
npm run dev
```

---

## 11. TIPS & TRICKS

### For the Live Demo

- **Pre-seed a few batches** in the database with status "available" so the map isn't empty when you first load it. The live SMS demo is more impactful when there are already pins on the map.
- **Test the SMS flow at least 10 times** before going on stage. The "magic moment" (SMS → map update within seconds) is your winning feature. If it fails, have a backup: a pre-recorded screen capture.
- **Have Dev 2's frontend polling every 5 seconds** — not every 10. The difference between a 5-second update and a 10-second update is noticeable to judges watching a live demo.
- **Pre-fill the SMS text** on your phone so you just hit send. "Niko na 100kg Dunga" should be ready to go.

### Debugging

- **SMS not appearing?** Check Supabase → Table Editor → `sms` table. If the raw message arrived but `parsedSuccessfully` is `false`, the parser failed. Check `parseError` for details.
- **Batch not created?** If `parsedSuccessfully` is `true` but no batch appears, the parser likely didn't extract both `quantity_kg` and `location`. Check `parsedData` JSON.
- **Map pin in wrong place?** The coordinates for that beach might be missing from both the beaches table and the hardcoded fallback. Add them.
- **Circuit breaker open?** If Langchain fails 5 times consecutively, the circuit breaker opens for 60 seconds. During this time, only the regex fallback parser runs. Restart the server to reset it manually.

### Performance

- **Caching works per-message.** If the same harvester sends the exact same text twice within an hour, the second parse hits the cache and costs zero API credits.
- **Duplicate detection** prevents accidental double-sends from creating duplicate batches within 60 seconds.

---

## 12. WHAT'S STILL TO DO

| Task | Priority | Notes |
|------|----------|-------|
| Wire up Africa's Talking auto-reply SMS | Critical | Currently returns `reply_message` in JSON; needs to actually send the SMS |
| Vercel AI SDK chatbot endpoint | High | `POST /api/chat` with streaming response |
| Price endpoint | Medium | `GET /api/price` returning average market rate |
| Seed demo buyer | Medium | Hardcode a buyer UUID so claim flow works without auth |
| Deploy backend | Critical | Railway or Render with environment variables |
| Test full flow | Critical | SMS → parse → batch → map → claim → impact |

---

