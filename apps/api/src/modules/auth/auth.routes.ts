import type { AppInstance } from "../../types";
import { authenticate } from "./auth.middleware";
import { loginSchema, signupSchema } from "./auth.types";
import { loginUser, signupUser } from "./auth.service";
import { env } from "../../config/env";

export async function authRoutes(fastify: AppInstance) {
  fastify.post(
    "/signup",
    { schema: { body: signupSchema, tags: ["Auth"] } },
    async (request, reply) => {
      const user = await signupUser(request.body);
      reply.code(201).send(user);
    },
  );

  fastify.post(
    "/login",
    { schema: { body: loginSchema, tags: ["Auth"] } },
    async (request, reply) => {
      const user = await loginUser(request.body);
      const token = fastify.jwt.sign(
        { userId: user.id, role: user.role },
        { expiresIn: "1h" },
      );

      reply.setCookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour, matches JWT expiry
      });

      reply.send({ user });
    },
  );

  fastify.get(
    "/me",
    { schema: { tags: ["Auth"] }, preHandler: [authenticate] },
    async (request, reply) => {
      reply.send(request.user);
    },
  );

  fastify.post("/logout", async (_, reply) => {
    reply.clearCookie("token", { path: "/" });
    reply.send({ success: true });
  });
}
