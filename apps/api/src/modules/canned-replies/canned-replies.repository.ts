import { db } from "../../db";
import { cannedReplies } from "../../db/schemas/canned-replies.schema";

type NewCannedReply = typeof cannedReplies.$inferInsert;

export async function insertCannedReply(data: NewCannedReply) {
  const [reply] = await db.insert(cannedReplies).values(data).returning();
  return reply;
}

export async function findAllCannedReplies() {
  return db.query.cannedReplies.findMany();
}
