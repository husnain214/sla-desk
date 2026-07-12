import { uuid, varchar, timestamp, snakeCase } from "drizzle-orm/pg-core";
import { userRoleEnum, users } from "./users.schema";

export const invitesTable = snakeCase.table("invites", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull(),
  token: varchar({ length: 255 }).notNull().unique(),
  invitedById: uuid()
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp().notNull(),
  usedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
});
