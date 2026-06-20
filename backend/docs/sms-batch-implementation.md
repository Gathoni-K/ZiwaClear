# LangChain SMS Parser, Batch & SMS System - Implementation Documentation

## System Overview
The SMS data processing pipeline is designed to intake unstructured SMS messages, parse them using LangChain with a structured output schema, store the results securely, and automatically aggregate the data into logical daily batches per beach. 

**Data Flow:**
1. Incoming SMS webhook receives data.
2. The payload is validated and rate-limited.
3. Duplicate detection runs against a 60-second window.
4. The raw SMS is saved and queued for asynchronous processing.
5. LangChain parses the message using OpenAI, with fallbacks and circuit breakers in place.
6. The SMS record is updated with extracted JSON data.
7. Unbatched SMS records are periodically grouped into Batches.
8. Catch weights and prices are aggregated within the Batch.

## LangChain SMS Parser
### Parser Architecture
The parser uses LangChain's `withStructuredOutput` combined with `ChatOpenAI`. A prompt template includes few-shot examples of common SMS messages from Kenyan fishing beaches. Responses are coerced to match a Zod schema.

### Schema Definition
- `beach_name`: String (nullable).
- `fish_species`: Array of Strings (defaults to empty array).
- `catch_total_kg`: Number (nullable).
- `price_per_kg_ksh`: Number (nullable).
- `weather_condition`: String (nullable).
- `boat_count`: Number (nullable).
- `fishing_method`: String (nullable).
- `additional_notes`: String (nullable).
- `confidence_score`: Number between 0 and 1.
- `extracted_at`: ISO datetime string.

### Prompt Design
The prompt is defined in `parserPrompts.ts`, specifying the system role, context (Swahili/English mix), and several input/output pairs demonstrating proper extraction for edge cases.

### Fallback Strategy
If LangChain throws an error or the LLM is unreachable, `parserFallback.ts` runs a basic regex-based extraction to capture `catch_total_kg` and `beach_name` where possible. A `CircuitBreaker` pattern prevents overwhelming the LLM API if it experiences consecutive failures (e.g., 5 failures triggers a 60-second open state).

### Parser Performance
By setting `temperature` to 0.1, the output structure is highly deterministic. The configured timeout is 15 seconds. Caching avoids duplicate LLM calls for identical messages within a one-hour window.

## SMS Management
### Database Schema
The `sms` table uses UUIDs as primary keys, storing raw text, sender phone, timestamps, parsed JSONB data, parse attempts, error strings, and foreign keys mapping to `batches` and `beaches`.

### API Endpoints
- `POST /api/sms/incoming`: Accepts payload `{ message, sender, received_at }`. Returns 202 Accepted.
- `GET /api/sms`: Lists paginated SMS records.
- `GET /api/sms/:id`: Gets a specific SMS.
- `GET /api/sms/stats`: Returns parsing success rate and average confidence.
- `POST /api/sms/:id/reprocess`: Reparses an SMS.
- `DELETE /api/sms/cleanup`: Removes old logs.

### Processing Pipeline
Asynchronous processing invokes `parseAndStore`. After a successful parse, it maps the extracted `beach_name` to a database `beach_id` and triggers `autoBatchSMS()`.

### Validation Rules
- Zod validators ensure SMS body contains `message` (1-1600 chars) and `sender` (Kenyan format).

## Batch Management
### Database Schema
The `batches` table stores `id` (UUID), `batch_name`, `beach_id`, `aggregated_data` (JSONB), `sms_count`, `processed_count`, `failed_count`, and `status`.

### Auto-Batching Algorithm
Groupings are organized by `beach_id` and calendar date. A threshold of 5 unbatched SMS triggers batch creation. A chron job (`autoBatchJob.ts`) handles scheduled executions.

### Aggregation Logic
The `regenerateAggregation` method parses all SMS within a batch, sums `catch_total_kg` and averages `price_per_kg_ksh`. It tracks species breakdown and outputs `BatchAggregation`.

### API Endpoints
- `POST /api/batches`: Creates a batch manually.
- `GET /api/batches`: Lists paginated batches.
- `GET /api/batches/:id`: Gets batch details with associated SMS records.
- `PATCH /api/batches/:id/close`: Finalizes a batch.
- `POST /api/batches/:id/add-sms`: Links an SMS manually.
- `POST /api/batches/auto`: Trigger auto-batching immediately.

## Beach Coordinates
### Coordinate Sources
Coordinates were researched using Google Maps for Winam Gulf on Lake Victoria. 
- **Dunga Beach:** Lat -0.148111, Lng 34.733611
- **Usenge Beach:** Lat -0.063056, Lng 34.032222

### Map Verification
A utility script `verifyCoordinates.ts` tests coordinates against a strict bounding box: `Lat >= -1.0 && Lat <= -0.05` and `Lng >= 34.0 && Lng <= 35.0`.

### Seed Script
`backend/database/seeds/beaches.ts` and `backend/database/seeds/index.ts` perform `onConflictDoNothing()` inserts ensuring idempotency.

## Integration Points
- Incoming SMS routes into `smsService.processIncomingSMS`.
- Langchain parser is invoked.
- Parsed SMS triggers `batchService.autoBatchSMS`.
- Batches aggregate data automatically on linkage.

## Security Considerations
- `authenticateAPIKey`: All endpoints require `x-api-key` matching `SMS_API_KEY` in `.env`.
- `rateLimitSMS`: Restricts senders to 10 SMS per minute.
- Zod prevents NoSQL/SQL injection via schema strictness.

## Error Handling
- 400 Bad Request: Zod validation failures.
- 401 Unauthorized: Invalid API key.
- 404 Not Found: Record does not exist.
- 409 Conflict: Duplicate SMS detected within 60s window.
- 429 Too Many Requests: Rate limit exceeded.
- 500 Internal Server Error: General faults.

## Testing Guide
Send a POST request to `/api/sms/incoming` with the header `x-api-key`.
Payload:
```json
{
  "message": "Dunga leo samaki 50kg bei 500 per kg",
  "sender": "+254712345678"
}
```
Expect a 202 Accepted. You can then query `/api/sms` to see the parsed data within a few seconds.
