import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { ticketStatusHistory } from "../../db/schemas/ticket-status-history.schema";
import { DbOrTransaction } from "../../types";

type NewHistoryEntry = typeof ticketStatusHistory.$inferInsert;

export async function insertHistoryEntry(
  data: NewHistoryEntry,
  tx: DbOrTransaction = db,
) {
  const [entry] = await tx.insert(ticketStatusHistory).values(data).returning();
  return entry;
}

export async function findHistoryForTicket(ticketId: string) {
  return db
    .select()
    .from(ticketStatusHistory)
    .where(eq(ticketStatusHistory.ticketId, ticketId))
    .orderBy(desc(ticketStatusHistory.createdAt));
}
