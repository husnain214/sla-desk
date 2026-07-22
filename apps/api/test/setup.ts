import { beforeEach, afterEach } from "vitest";
import { db } from "../src/db";
import { sql } from "drizzle-orm";
import { users } from "../src/db/schemas/users.schema";
import { hashPassword } from "../src/shared/utils/auth";

afterEach(async () => {
  await db.execute(sql`
    TRUNCATE TABLE
      ticket_status_history, comments, attachments, tickets,
      invites, users, teams, tags, ticket_tags
    RESTART IDENTITY CASCADE
  `);
});

beforeEach(async () => {
  const passwordHash = await hashPassword("password123");

  await db.insert(users).values([
    {
      name: "Test Agent",
      email: "agent@test.com",
      passwordHash,
      role: "agent",
    },
    {
      name: "Test Admin",
      email: "admin@test.com",
      passwordHash,
      role: "admin",
    },
  ]);
});
