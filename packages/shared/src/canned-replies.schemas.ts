import { z } from "zod";

export const createCannedReplySchema = z.object({
  title: z.string().trim().min(1).max(100),
  body: z.string().trim().min(1),
});

export const cannedReplySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  body: z.string(),
  createdById: z.uuid(),
});

export type CreateCannedReplyPayload = z.infer<typeof createCannedReplySchema>;
export type CannedReply = z.infer<typeof cannedReplySchema>;
