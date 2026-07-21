import { uuid, varchar, timestamp, snakeCase } from "drizzle-orm/pg-core";
import { userRoleEnum, users } from "./users.schema";
import { teams } from "./teams.schema";

export const invites = snakeCase.table("invites", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull(),
  token: varchar({ length: 255 }).notNull().unique(),
  invitedById: uuid()
    .notNull()
    .references(() => users.id),
  teamId: uuid("team_id").references(() => teams.id),
  expiresAt: timestamp().notNull(),
  usedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
});
