ALTER TABLE "clients" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "county" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "stack" jsonb;