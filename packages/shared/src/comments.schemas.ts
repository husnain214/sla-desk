import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string(),
  isInternal: z.boolean(),
});

export type CreateCommentPayload = z.infer<typeof createCommentSchema>;
