import { loginSchema, signupSchema } from "./auth.types";
import { loginUser, signupUser } from "./auth.service";
import { authenticate } from "./auth.middleware";
import type { AppInstance } from "../../types";

export async function authRoutes(fastify: AppInstance) {
  fastify.post(
    "/signup",
    { schema: { body: signupSchema } },
    async (request, reply) => {
      const user = await signupUser(request.body);
      reply.code(201).send(user);
    },
  );

  fastify.post(
    "/login",
    { schema: { body: loginSchema } },
    async (request, reply) => {
      const user = await loginUser(request.body);
      const token = fastify.jwt.sign(
        { userId: user.id, role: user.role },
        { expiresIn: "1h" },
      );
      reply.send({ token });
    },
  );

  fastify.get(
    "/auth/me",
    { preHandler: [authenticate] },
    async (request, reply) => {
      reply.send(request.user);
    },
  );
}
