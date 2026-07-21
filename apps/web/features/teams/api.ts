import { api } from "@/lib/axios";
import { CreateTeamPayload, Team } from "@myapp/shared";

export async function getTeams() {
  const res = await api.get("/teams");
  return res.data as Team[];
}
export async function createTeam(payload: CreateTeamPayload) {
  const res = await api.post("/teams", payload);
  return res.data;
}
export async function deleteTeam(id: string) {
  await api.delete(`/teams/${id}`);
}
