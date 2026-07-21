import { eq } from "drizzle-orm";
import { db } from "../../db";
import { teams } from "../../db/schemas/teams.schema";

type NewTeam = typeof teams.$inferInsert;

export async function insertTeam(data: NewTeam) {
  const [team] = await db.insert(teams).values(data).returning();
  return team;
}

export async function findAllTeams() {
  return db.select().from(teams);
}

export async function findTeamById(id: string) {
  return db.select().from(teams).where(eq(teams.id, id));
}

export async function deleteTeam(id: string) {
  const [team] = await db.delete(teams).where(eq(teams.id, id)).returning();
  return team;
}
