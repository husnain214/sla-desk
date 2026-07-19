import { api } from "@/lib/axios";
import type {
  AssignTicketPayload,
  CreateTicketPayload,
  TicketFiltersPayload,
} from "@myapp/shared";

export async function createTicket(payload: CreateTicketPayload) {
  const response = await api.post("/tickets", payload);
  return response.data;
}

export async function getTickets(filters: Partial<TicketFiltersPayload>) {
  const response = await api.get("/tickets", { params: filters });
  return response.data;
}

export async function getTicketById(id: string) {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
}

export async function updateTicketStatus(id: string, status: string) {
  const res = await api.patch(`/tickets/${id}/status`, { status });
  return res.data;
}

export async function assignTicket(id: string, payload: AssignTicketPayload) {
  const res = await api.patch(`/tickets/${id}/assign`, payload);
  return res.data;
}

export async function getTicketHistory(ticketId: string) {
  const res = await api.get(`/tickets/${ticketId}/history`);
  return res.data;
}
