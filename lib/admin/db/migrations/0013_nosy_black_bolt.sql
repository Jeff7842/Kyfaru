ALTER TABLE "quotes" DROP CONSTRAINT "quotes_project_id_unique";--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "title" text;--> statement-breakpoint
CREATE INDEX "quotes_project_idx" ON "quotes" USING btree ("project_id");