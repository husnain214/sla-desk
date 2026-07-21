import { api } from "@/lib/axios";

export async function getAgents() {
  const res = await api.get("/users/agents");
  return res.data as {
    id: string;
    name: string;
    teamId: string;
    email: string;
  }[];
}

export async function assignUserToTeam(userId: string, teamId: string | null) {
  const res = await api.patch(`/users/${userId}/team`, { teamId });
  return res.data;
}
