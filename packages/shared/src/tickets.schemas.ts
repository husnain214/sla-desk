import { z } from "zod";

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const TICKET_STATUSES = [
  "open",
  "pending",
  "resolved",
  "closed",
] as const;

export const createTicketSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(255).optional(),
  priority: z.enum(TICKET_PRIORITIES),
});

export const ticketFiltersSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  assignedAgentId: z.uuid().optional(),
  assignedTeamId: z.uuid().optional(),
  slaBreached: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "slaDueAt", "priority"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
});

export const assignTicketSchema = z.object({
  assignedAgentId: z.string().optional(),
  assignedTeamId: z.string().optional(),
});
// .refine((data) => data.assignedAgentId || data.assignedTeamId, {
//   message: "Must provide either assignedAgentId or assignedTeamId",
// });

export const ticketSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  priority: z.enum(TICKET_PRIORITIES),
  status: z.enum(TICKET_STATUSES),
  customerId: z.uuid(),
  assignedAgentId: z.uuid().nullable(),
  assignedTeamId: z.uuid().nullable(),
  slaBreached: z.boolean(),
  slaDueAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type AssignTicketPayload = z.infer<typeof assignTicketSchema>;
export type CreateTicketPayload = z.infer<typeof createTicketSchema>;
export type TicketFiltersPayload = z.infer<typeof ticketFiltersSchema>;
