import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.email(),
  role: z.literal("agent"),
  teamId: z.uuid().optional(),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(8),
});

export type CreateInvitePayload = z.infer<typeof createInviteSchema>;
export type AcceptInvitePayload = z.infer<typeof acceptInviteSchema>;
