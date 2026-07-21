import { api } from "@/lib/axios";
import type { CreateInvitePayload, AcceptInvitePayload } from "@myapp/shared";

export async function createInvite(payload: CreateInvitePayload) {
  const res = await api.post("/invites", payload);
  return res.data;
}

export async function acceptInvite(payload: AcceptInvitePayload) {
  const res = await api.post("/invites/accept", payload);
  return res.data;
}
