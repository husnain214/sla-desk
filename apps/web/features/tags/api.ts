import { api } from "@/lib/axios";
import { Tag } from "@myapp/shared";

export async function getTags() {
  const res = await api.get("/tags");
  return res.data as Tag[];
}
export async function createTag(name: string) {
  const res = await api.post("/tags", { name });
  return res.data;
}
export async function tagTicket(ticketId: string, tagId: string) {
  await api.post(`/tickets/${ticketId}/tags/${tagId}`);
}
export async function untagTicket(ticketId: string, tagId: string) {
  await api.delete(`/tickets/${ticketId}/tags/${tagId}`);
}
