ALTER TABLE "quotes" ADD COLUMN "include_tools_row" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "deposit_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "deposit_percent" numeric(5, 2) DEFAULT '50';--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "maintenance_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "maintenance_fee" numeric(12, 2) DEFAULT '0';