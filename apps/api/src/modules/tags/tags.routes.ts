import type { AppInstance } from "../../types";
import { authenticate, requireRole } from "../auth/auth.middleware";
import { createTagSchema } from "@myapp/shared";
import * as tagsService from "./tags.service";

export async function tagRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      preHandler: [authenticate, requireRole(["admin", "agent"])],
      schema: { body: createTagSchema },
    },
    async (request, reply) => {
      const tag = await tagsService.createTag(request.body.name);
      reply.code(201).send(tag);
    },
  );

  fastify.get("/", { preHandler: [authenticate] }, async (request, reply) => {
    reply.send(await tagsService.listTags());
  });
}
