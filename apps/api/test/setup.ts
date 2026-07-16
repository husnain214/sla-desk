import { afterEach } from "vitest";
import { db } from "../src/db";
import { sql } from "drizzle-orm";

afterEach(async () => {
  console.log("Connected to:", process.env.DATABASE_URL);

  await db.execute(sql`
    TRUNCATE TABLE
      ticket_status_history, comments, attachments, tickets,
      invites, users, teams
    RESTART IDENTITY CASCADE
  `);
});
