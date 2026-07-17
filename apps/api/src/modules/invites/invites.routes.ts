import type { AppInstance } from "../../types";
import { authenticate, requireRole } from "../auth/auth.middleware";
import { createInviteSchema, acceptInviteSchema } from "./invites.type";
import * as invitesService from "./invites.service";

export async function inviteRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      preHandler: [authenticate, requireRole(["admin"])],
      schema: { body: createInviteSchema, tags: ["Invites"] },
    },
    async (request, reply) => {
      const invite = await invitesService.createInvite(
        request.body,
        request.user,
      );
      reply.code(201).send(invite);
    },
  );

  fastify.post(
    "/accept",
    {
      schema: { body: acceptInviteSchema, tags: ["Invites"] },
    },
    async (request, reply) => {
      const user = await invitesService.acceptInvite(request.body);
      reply.code(201).send(user);
    },
  );
}
