ALTER TABLE "tags" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "name" SET DATA TYPE varchar(50) USING "name"::varchar(50);--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_name_key" UNIQUE("name");