import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const teamSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export type CreateTeamPayload = z.infer<typeof createTeamSchema>;
export type Team = z.infer<typeof teamSchema>;
