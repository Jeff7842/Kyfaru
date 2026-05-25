ALTER TYPE "public"."user_role" ADD VALUE 'communications';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'tech';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'finance';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'sales';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "github_repo_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "github_repo_owner" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "github_repo_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_type" text DEFAULT 'permanent' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_from" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "access_until" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_frozen" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_access_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_login" text;