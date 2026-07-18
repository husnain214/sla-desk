import { z } from "zod";

export { createTicketSchema, type CreateTicketPayload } from "@myapp/shared";

export const ticketParamsSchema = z.object({
  ticketId: z.string(),
});
