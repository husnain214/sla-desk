import { AppInstance } from "../../types";
import { z } from "zod";
import { authenticate, requireRole } from "../auth/auth.middleware";
import * as userRepository from "./users.repository";
import * as userService from "./users.service";

export function userRoutes(fastify: AppInstance) {
  fastify.get(
    "/agents",
    {
      preHandler: [authenticate, requireRole(["admin", "agent"])],
      schema: { tags: ["Users"] },
    },
    async (_, reply) => {
      const agents = await userRepository.findUsersByRole("agent");
      reply.send(agents.map(({ passwordHash, ...safe }) => safe));
    },
  );

  fastify.patch(
    "/:id/team",
    {
      preHandler: [authenticate, requireRole(["admin"])],
      schema: {
        params: z.object({ id: z.string() }),
        body: z.object({ teamId: z.uuid().nullable() }),
        tags: ["Users"],
      },
    },
    async (request, reply) => {
      const user = await userService.assignUserToTeam(
        request.params.id,
        request.body.teamId,
        request.user,
      );
      reply.send(user);
    },
  );
}
