import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

export const tagSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const tagParamsSchema = z.object({ id: z.string(), tagId: z.string() });

export type CreateTagPayload = z.infer<typeof createTagSchema>;
export type Tag = z.infer<typeof tagSchema>;
