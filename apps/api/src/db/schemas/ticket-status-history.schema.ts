import { snakeCase, timestamp, uuid } from "drizzle-orm/pg-core";
import { tickets, ticketStatusEnum } from "./tickets.schema";
import { users } from "./users.schema";

export const ticketStatusHistory = snakeCase.table("ticket_status_history", {
  id: uuid().defaultRandom().primaryKey(),
  ticketId: uuid()
    .notNull()
    .references(() => tickets.id),
  fromStatus: ticketStatusEnum().notNull(),
  toStatus: ticketStatusEnum().notNull(),
  changedBy: uuid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().defaultNow().notNull(),
});
