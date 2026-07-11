import { boolean, snakeCase, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tickets } from "./tickets.schema";
import { users } from "./users.schema";

export const comments = snakeCase.table("comments", {
  id: uuid().defaultRandom().primaryKey(),
  ticketId: uuid()
    .notNull()
    .references(() => tickets.id),
  authorId: uuid()
    .notNull()
    .references(() => users.id),
  body: text().notNull(),
  isInternal: boolean().notNull().default(false),
  deletedAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
