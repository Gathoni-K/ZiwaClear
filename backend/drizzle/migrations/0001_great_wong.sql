ALTER TABLE "batches" ADD COLUMN "batch_code" varchar(20);--> statement-breakpoint
ALTER TABLE "batches" ADD COLUMN "material_type" varchar(100);--> statement-breakpoint
ALTER TABLE "batches" ADD COLUMN "region" varchar(100);--> statement-breakpoint
ALTER TABLE "batches" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_batch_code_unique" UNIQUE("batch_code");