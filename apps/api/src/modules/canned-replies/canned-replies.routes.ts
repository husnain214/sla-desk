import { createCannedReplySchema } from "@myapp/shared";
import type { AppInstance } from "../../types";
import { authenticate, requireRole } from "../auth/auth.middleware";
import * as repo from "./canned-replies.repository";

export async function cannedReplyRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      preHandler: [authenticate, requireRole(["agent", "admin"])],
      schema: { body: createCannedReplySchema },
    },
    async (request, reply) => {
      const created = await repo.insertCannedReply({
        ...request.body,
        createdById: request.user.userId,
      });
      reply.code(201).send(created);
    },
  );

  fastify.get(
    "/",
    { preHandler: [authenticate, requireRole(["agent", "admin"])] },
    async (request, reply) => {
      reply.send(await repo.findAllCannedReplies());
    },
  );
}
