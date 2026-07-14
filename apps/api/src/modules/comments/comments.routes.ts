import type { AppInstance } from "../../types";

import { authenticate } from "../auth/auth.middleware";
import { createCommentSchema, ticketParamsSchema } from "./comments.types";
import * as commentService from "./comments.service";

export async function commentRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: createCommentSchema,
        params: ticketParamsSchema,
        tags: ["Comments"],
      },
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const comment = await commentService.createComment(
        request.params.ticketId,
        request.user,
        request.body,
      );

      reply.status(201).send(comment);
    },
  );

  fastify.get(
    "/",
    {
      schema: {
        params: ticketParamsSchema,
        tags: ["Comments"],
      },
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const comments = await commentService.getComments(
        request.params.ticketId,
        request.user,
      );
      reply.send(comments);
    },
  );
}
