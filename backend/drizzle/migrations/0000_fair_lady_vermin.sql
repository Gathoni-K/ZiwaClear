CREATE TABLE "harvesters" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" text NOT NULL,
	"name" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "harvesters_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "buyers" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "buyers_contact_email_unique" UNIQUE("contact_email")
);
--> statement-breakpoint
CREATE TABLE "biomass_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"harvester_id" integer NOT NULL,
	"weight_kg" numeric NOT NULL,
	"location_coordinates" text,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	"payout_amount" numeric NOT NULL,
	"mpesa_receipt_number" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_phone" text NOT NULL,
	"raw_message" text NOT NULL,
	"parsed_successfully" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "biomass_batches" ADD CONSTRAINT "biomass_batches_harvester_id_harvesters_id_fk" FOREIGN KEY ("harvester_id") REFERENCES "public"."harvesters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_batch_id_biomass_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."biomass_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyers"("id") ON DELETE no action ON UPDATE no action;