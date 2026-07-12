import {
  pgEnum,
  snakeCase,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { teams } from "./teams.schema";

export const userRoleEnum = pgEnum("user_role", ["customer", "agent", "admin"]);

export const users = snakeCase.table("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull().default("customer"),
  teamId: uuid("team_id").references(() => teams.id),
  createdAt: timestamp().notNull().defaultNow(),
});
