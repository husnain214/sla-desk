CREATE TABLE "canned_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(100) NOT NULL,
	"body" text NOT NULL,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canned_replies" ADD CONSTRAINT "canned_replies_created_by_id_users_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id");