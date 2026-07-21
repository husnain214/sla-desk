import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { tags, ticketTags } from "../../db/schemas/tags.schema";

export async function insertTag(name: string) {
  const [tag] = await db.insert(tags).values({ name }).returning();
  return tag;
}

export async function findAllTags() {
  return db.query.tags.findMany();
}

export async function attachTagToTicket(ticketId: string, tagId: string) {
  await db.insert(ticketTags).values({ ticketId, tagId }).onConflictDoNothing();
}

export async function detachTagFromTicket(ticketId: string, tagId: string) {
  await db
    .delete(ticketTags)
    .where(and(eq(ticketTags.ticketId, ticketId), eq(ticketTags.tagId, tagId)));
}
