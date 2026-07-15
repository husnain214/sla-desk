import { eq } from "drizzle-orm";
import { db } from "../../db";
import { invites } from "../../db/schemas/invites.schema";

type NewInvite = typeof invites.$inferInsert;

export async function createInvite(data: NewInvite) {
  const [invite] = await db.insert(invites).values(data).returning();
  return invite;
}

export async function findInviteByToken(token: string) {
  const [invite] = await db
    .select()
    .from(invites)
    .where(eq(invites.token, token));
  return invite;
}

export async function markInviteUsed(id: string) {
  const [invite] = await db
    .update(invites)
    .set({ usedAt: new Date() })
    .where(eq(invites.id, id))
    .returning();
  return invite;
}
