import { snakeCase, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const cannedReplies = snakeCase.table("canned_replies", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 100 }).notNull(),
  body: text().notNull(),
  createdById: uuid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().notNull().defaultNow(),
});
