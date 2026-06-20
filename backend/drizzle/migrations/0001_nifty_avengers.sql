ALTER TABLE "harvesters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "buyers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "biomass_batches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sms_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Lock down harvester information" ON "harvesters" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Lock down buyers layer" ON "buyers" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Allow public read access to batches" ON "biomass_batches" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Lock down transaction financials" ON "transactions" AS PERMISSIVE FOR ALL TO "anon" USING (false);--> statement-breakpoint
CREATE POLICY "Lock down sms logs completely" ON "sms_logs" AS PERMISSIVE FOR ALL TO "anon" USING (false);