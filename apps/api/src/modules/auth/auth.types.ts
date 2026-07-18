export {
  loginSchema,
  signupSchema,
  type SignupPayload,
  type LoginPayload,
} from "@myapp/shared";

export type JwtPayload = {
  userId: string;
  role: "customer" | "agent" | "admin";
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
