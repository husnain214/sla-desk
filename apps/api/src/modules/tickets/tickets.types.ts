import { z } from "zod";
import {
  ticketPriorityEnum,
  tickets,
  ticketStatusEnum,
} from "../../db/schemas/tickets.schema";

export const createTicketSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(255).optional(),
  priority: z.enum(ticketPriorityEnum.enumValues),
});

export const ticketFiltersSchema = z.object({
  status: z.enum(ticketStatusEnum.enumValues).optional(),
  priority: z.enum(ticketPriorityEnum.enumValues).optional(),
  assignedAgentId: z.uuid().optional(),
  assignedTeamId: z.uuid().optional(),
  slaBreached: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "slaDueAt", "priority"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateTicketPayload = z.infer<typeof createTicketSchema>;
export type TicketFiltersPayload = z.infer<typeof ticketFiltersSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
