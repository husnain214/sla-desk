import { z } from "zod";

export { createCommentSchema, type CreateCommentPayload } from "@myapp/shared";

export const ticketParamsSchema = z.object({
  ticketId: z.string(),
});
