import { api } from "@/lib/axios";
import type { CreateCommentPayload } from "@myapp/shared";

export async function createComment(
  ticketId: string,
  payload: CreateCommentPayload,
) {
  const res = await api.post(`/tickets/${ticketId}/comments`, payload);
  return res.data;
}
