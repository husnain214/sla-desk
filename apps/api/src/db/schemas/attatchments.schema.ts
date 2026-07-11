import {
  integer,
  snakeCase,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { tickets } from "./tickets.schema";
import { users } from "./users.schema";

export const attachments = snakeCase.table("attachments", {
  id: uuid().defaultRandom().primaryKey(),
  ticketId: uuid()
    .notNull()
    .references(() => tickets.id),
  uploadedBy: uuid()
    .notNull()
    .references(() => users.id),
  fileKey: varchar({ length: 255 }).notNull(),
  fileName: varchar({ length: 255 }).notNull(),
  fileSize: integer().notNull(),
  mimeType: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
