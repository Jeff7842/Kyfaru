CREATE SEQUENCE "public"."document_code_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "document_code" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_document_code_unique" UNIQUE("document_code");