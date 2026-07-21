import { snakeCase } from "drizzle-orm/pg-core";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { tickets } from "./tickets.schema";

export const tags = snakeCase.table("tags", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
});

export const ticketTags = snakeCase.table("ticket_tags", {
  ticketId: uuid()
    .notNull()
    .references(() => tickets.id),
  tagId: uuid()
    .notNull()
    .references(() => tags.id),
});
