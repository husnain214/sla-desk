import { tickets } from "../../db/schemas/tickets.schema";

export {
  createTicketSchema,
  ticketFiltersSchema,
  updateTicketStatusSchema,
  assignTicketSchema,
  type CreateTicketPayload,
  type TicketFiltersPayload,
  type AssignTicketPayload,
} from "@myapp/shared";
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
