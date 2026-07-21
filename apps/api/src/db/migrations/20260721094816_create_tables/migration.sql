CREATE TYPE "ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "ticket_status" AS ENUM('open', 'pending', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('customer', 'agent', 'admin');--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ticket_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"file_key" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ticket_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"token" varchar(255) NOT NULL UNIQUE,
	"invited_by_id" uuid NOT NULL,
	"team_id" uuid,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_tags" (
	"ticket_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"ticket_id" uuid NOT NULL,
	"from_status" "ticket_status" NOT NULL,
	"to_status" "ticket_status" NOT NULL,
	"changed_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(255),
	"priority" "ticket_priority" DEFAULT 'medium'::"ticket_priority" NOT NULL,
	"status" "ticket_status" DEFAULT 'open'::"ticket_status" NOT NULL,
	"sla_breached" boolean DEFAULT false NOT NULL,
	"sla_due_at" timestamp NOT NULL,
	"customer_id" uuid NOT NULL,
	"assigned_agent_id" uuid,
	"assigned_team_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'customer'::"user_role" NOT NULL,
	"team_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "tickets_search_idx" ON "tickets" USING gin ((
        setweight(to_tsvector('english', "title"), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B')
      ));--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_users_id_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_id_users_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "ticket_tags" ADD CONSTRAINT "ticket_tags_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");--> statement-breakpoint
ALTER TABLE "ticket_tags" ADD CONSTRAINT "ticket_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");--> statement-breakpoint
ALTER TABLE "ticket_status_history" ADD CONSTRAINT "ticket_status_history_ticket_id_tickets_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");--> statement-breakpoint
ALTER TABLE "ticket_status_history" ADD CONSTRAINT "ticket_status_history_changed_by_users_id_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_users_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_agent_id_users_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_team_id_teams_id_fkey" FOREIGN KEY ("assigned_team_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");