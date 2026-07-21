import { eq } from "drizzle-orm";
import { users } from "../../db/schemas/users.schema";
import { db } from "../../db";
import { teams } from "../../db/schemas/teams.schema";

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
  return db.query.users.findMany({ where: { role }, with: { team: true } });
}

export async function updateUserTeam(userId: string, teamId: string | null) {
  const [user] = await db
    .update(users)
    .set({ teamId })
    .where(eq(users.id, userId))
    .returning();
  return user;
}

export async function updateUser(id: string, data: Partial<NewUser>) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
}
