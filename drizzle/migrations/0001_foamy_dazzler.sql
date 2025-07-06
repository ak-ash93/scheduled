ALTER TABLE "events" DROP CONSTRAINT "events_clerkUserId_unique";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "description" DROP NOT NULL;