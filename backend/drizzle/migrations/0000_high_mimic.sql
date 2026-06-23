CREATE TABLE "harvesters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text NOT NULL,
	"name" text,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "harvesters_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "harvesters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "buyers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "buyers_contact_email_unique" UNIQUE("contact_email")
);
--> statement-breakpoint
ALTER TABLE "buyers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantity_kg" real NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"beach_id" integer,
	"latitude" real,
	"longitude" real,
	"status" text DEFAULT 'available' NOT NULL,
	"harvester_phone" varchar(20) NOT NULL,
	"harvester_name" varchar(255),
	"buyer_id" uuid,
	"quality_rating" integer,
	"claimed_at" timestamp with time zone,
	"collected_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "batches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"payout_amount" real NOT NULL,
	"mpesa_receipt_number" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "beaches" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"county" text NOT NULL,
	"lake" text NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "beaches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_message" text NOT NULL,
	"sender_phone" varchar(20) NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"parsed_data" jsonb,
	"parsed_successfully" boolean DEFAULT false NOT NULL,
	"parse_error" text,
	"batch_id" uuid,
	"beach_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_beach_id_beaches_id_fk" FOREIGN KEY ("beach_id") REFERENCES "public"."beaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms" ADD CONSTRAINT "sms_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms" ADD CONSTRAINT "sms_beach_id_beaches_id_fk" FOREIGN KEY ("beach_id") REFERENCES "public"."beaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Lock down harvester information" ON "harvesters" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Lock down buyer information" ON "buyers" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Allow public read access to available batches" ON "batches" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Allow authenticated insert" ON "batches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Allow authenticated update" ON "batches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Lock down transaction financials" ON "transactions" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Allow public read access to beaches" ON "beaches" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Allow public read access to SMS" ON "sms" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Allow authenticated insert" ON "sms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);