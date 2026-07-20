import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { comments } from "../../db/schemas/comments.schema";
import { CreateCommentPayload } from "./comments.types";
import { users } from "../../db/schemas/users.schema";

export async function createComment(
  ticketId: string,
  authorId: string,
  payload: CreateCommentPayload,
) {
  const [inserted] = await db
    .insert(comments)
    .values({
      ...payload,
      ticketId,
      authorId,
    })
    .returning();

  const [comment] = await db
    .select({
      comment: comments,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(comments)
    .leftJoin(users, eq(users.id, comments.authorId))
    .where(eq(comments.id, inserted.id));

  return {
    ...comment.comment,
    author: comment.author,
  };
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

  return db.query.comments.findMany({
    where: {
      ticketId,
    },
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
