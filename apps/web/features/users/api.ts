import { api } from "@/lib/axios";

export async function getAgents() {
  const res = await api.get("/users/agents");
  return res.data as { id: string; name: string }[];
}
