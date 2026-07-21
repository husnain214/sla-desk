import { api } from "@/lib/axios";
import { CannedReply, CreateCannedReplyPayload } from "@myapp/shared";

export async function getCannedReplies() {
  const res = await api.get("/canned-replies");
  return res.data as CannedReply[];
}
export async function createCannedReply(payload: CreateCannedReplyPayload) {
  const res = await api.post("/canned-replies", payload);
  return res.data;
}
