import {
  boolean,
  customType,
  pgEnum,
  snakeCase,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@myapp/shared";
import { users } from "./users.schema";
import { teams } from "./teams.schema";

export const ticketPriorityEnum = pgEnum("ticket_priority", TICKET_PRIORITIES);
export const ticketStatusEnum = pgEnum("ticket_status", TICKET_STATUSES);

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

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
  searchVector: tsvector("search_vector"),
});
