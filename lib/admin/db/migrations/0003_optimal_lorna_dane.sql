ALTER TABLE "communication_logs" ADD COLUMN "thread_id" uuid;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD COLUMN "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD COLUMN "media_type" text;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD COLUMN "reply_to_id" uuid;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD COLUMN "delivered_at" timestamp;--> statement-breakpoint
ALTER TABLE "communication_logs" ADD COLUMN "read_at" timestamp;--> statement-breakpoint
CREATE INDEX "comms_thread_idx" ON "communication_logs" USING btree ("thread_id");