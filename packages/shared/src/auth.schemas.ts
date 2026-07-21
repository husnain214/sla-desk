import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

export type SignupPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
