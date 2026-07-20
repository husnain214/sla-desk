import { eq } from "drizzle-orm";
import { users } from "../../db/schemas/users.schema";
import { db } from "../../db";

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

export async function findUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function findUsersByRole(role: "agent" | "admin" | "customer") {
  return db.select().from(users).where(eq(users.role, role));
}
