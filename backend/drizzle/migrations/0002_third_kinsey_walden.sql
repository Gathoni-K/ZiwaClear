CREATE TABLE "landing_sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"bmu_leader_phone" varchar(20) NOT NULL,
	"coverage_percentage" integer DEFAULT 0 NOT NULL,
	"dominant_quality_grade" varchar(20) DEFAULT 'STANDARD' NOT NULL,
	"operational_status" varchar(20) DEFAULT 'SAFE' NOT NULL,
	"risk_level" varchar(20) DEFAULT 'normal' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_site_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" varchar(255) NOT NULL,
	"coverage_percentage" integer NOT NULL,
	"dominant_quality_grade" varchar(50) NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "harvesters" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "batches" ADD COLUMN "harvester_id" uuid;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_harvester_id_harvesters_id_fk" FOREIGN KEY ("harvester_id") REFERENCES "public"."harvesters"("id") ON DELETE no action ON UPDATE no action;