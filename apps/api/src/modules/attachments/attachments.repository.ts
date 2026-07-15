import { eq } from "drizzle-orm";
import { db } from "../../db";
import { attachments } from "../../db/schemas/attatchments.schema";

type NewAttachment = typeof attachments.$inferInsert;

export async function insertAttachment(data: NewAttachment) {
  const [attachment] = await db.insert(attachments).values(data).returning();
  return attachment;
}

export async function findAttachmentById(id: string) {
  const [attachment] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id));
  return attachment;
}

export async function findAttachmentsForTicket(ticketId: string) {
  return db
    .select()
    .from(attachments)
    .where(eq(attachments.ticketId, ticketId));
}
