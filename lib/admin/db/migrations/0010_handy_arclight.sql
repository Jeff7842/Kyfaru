ALTER TABLE "quotes" ADD COLUMN "currency" text DEFAULT 'KES' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "accent_color" text DEFAULT 'green' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "tools_pricing" jsonb;