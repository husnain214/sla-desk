import { snakeCase, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { tickets } from "./tickets.schema";

export const tags = snakeCase.table("tags", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const ticketTags = snakeCase.table("ticket_tags", {
  ticketId: uuid()
    .notNull()
    .references(() => tickets.id),
  tagId: uuid()
    .notNull()
    .references(() => tags.id),
});
