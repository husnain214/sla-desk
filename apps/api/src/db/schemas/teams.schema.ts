import { snakeCase, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const teams = snakeCase.table("teams", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
