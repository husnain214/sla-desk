import type { AppInstance } from "../../types";
import { authenticate } from "./auth.middleware";
import { loginSchema, signupSchema } from "./auth.types";
import { loginUser, signupUser } from "./auth.service";
import * as authService from "./auth.service";
import * as userRepository from "../users/users.repository";
import { env } from "../../config/env";
import { changePasswordSchema, updateProfileSchema } from "@myapp/shared";

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
      const user = await userRepository.findUserById(request.user.userId);
      if (!user) {
        return reply.code(401).send({ error: "User not found" });
      }
      const { passwordHash, ...safeUser } = user;
      reply.send(safeUser);
    },
  );

  fastify.patch(
    "/me",
    { preHandler: [authenticate], schema: { body: updateProfileSchema } },
    async (request, reply) => {
      const user = await authService.updateProfile(
        request.user.userId,
        request.body,
      );
      const { passwordHash, ...safe } = user;
      reply.send(safe);
    },
  );

  fastify.patch(
    "/password",
    { preHandler: [authenticate], schema: { body: changePasswordSchema } },
    async (request, reply) => {
      await authService.changePassword(request.user.userId, request.body);
      reply.send({ success: true });
    },
  );

  fastify.post("/logout", { schema: { tags: ["Auth"] } }, async (_, reply) => {
    reply.clearCookie("token", { path: "/" });
    reply.send({ success: true });
  });
}
