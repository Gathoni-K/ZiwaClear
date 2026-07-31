ALTER TABLE "landing_sites" ADD COLUMN "county_health_officer_phone" varchar(20);
--> statement-breakpoint
ALTER TABLE "landing_sites" ADD COLUMN "water_officer_phone" varchar(20);
--> statement-breakpoint
ALTER TABLE "landing_sites" ADD COLUMN "is_blocking_water_point" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"event_type" varchar(40) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"area" varchar(255) NOT NULL,
	"recommended_action" text NOT NULL,
	"recipient_role" varchar(30) NOT NULL,
	"recipient_phone" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"payload" jsonb,
	"status" varchar(20) DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_site_id_landing_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."landing_sites"("id") ON DELETE no action ON UPDATE no action;
