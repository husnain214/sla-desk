import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { comments } from "../../db/schemas/comments.schema";
import { CreateCommentPayload } from "./comments.types";

export async function createComment(
  ticketId: string,
  authorId: string,
  payload: CreateCommentPayload,
) {
  const [comment] = await db
    .insert(comments)
    .values({
      ...payload,
      ticketId,
      authorId,
    })
    .returning();

  return comment;
}

export async function findCommentsForTicket(
  ticketId: string,
  includeInternalComments: boolean,
) {
  const conditions = [
    eq(comments.ticketId, ticketId),
    isNull(comments.deletedAt),
  ];

  if (!includeInternalComments) {
    conditions.push(eq(comments.isInternal, false));
  }

  return db
    .select()
    .from(comments)
    .where(and(...conditions));
}
