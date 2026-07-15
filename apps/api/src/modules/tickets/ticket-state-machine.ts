import { ticketStatusEnum } from "../../db/schemas/tickets.schema";

export type TicketStatus = (typeof ticketStatusEnum.enumValues)[number];

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["pending"],
  pending: ["resolved", "open"],
  resolved: ["closed", "open"],
  closed: [],
};

export function canTransition(from: TicketStatus, to: TicketStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
