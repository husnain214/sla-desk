import {
  boolean,
  pgEnum,
  snakeCase,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { teams } from "./teams.schema";

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "pending",
  "resolved",
  "closed",
]);

export const tickets = snakeCase.table("tickets", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  category: varchar({ length: 255 }),
  priority: ticketPriorityEnum().notNull().default("medium"),
  status: ticketStatusEnum().notNull().default("open"),
  slaBreached: boolean().notNull().default(false),
  slaDueAt: timestamp().notNull(),
  customerId: uuid()
    .notNull()
    .references(() => users.id),
  assignedAgentId: uuid().references(() => users.id),
  assignedTeamId: uuid().references(() => teams.id),
  createdAt: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
