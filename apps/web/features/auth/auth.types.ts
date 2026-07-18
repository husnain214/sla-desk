import { signupSchema } from "@myapp/shared";
import { z } from "zod";

export const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;
