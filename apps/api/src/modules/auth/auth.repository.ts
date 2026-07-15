import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schemas/users.schema";

type NewUser = typeof users.$inferInsert;

export async function createUser(data: NewUser) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}
