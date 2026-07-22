import type { AppInstance } from "../../types";
import { authenticate, requireRole } from "../auth/auth.middleware";
import { createTeamSchema } from "@myapp/shared";
import * as teamsService from "./teams.service";
import { z } from "zod";

export async function teamRoutes(fastify: AppInstance) {
  fastify.post(
    "/",
    {
      preHandler: [authenticate, requireRole(["admin"])],
      schema: { body: createTeamSchema, tags: ["Teams"] },
    },
    async (request, reply) => {
      const team = await teamsService.createTeam(request.body);
      reply.code(201).send(team);
    },
  );

  fastify.get(
    "/",
    {
      preHandler: [authenticate, requireRole(["admin", "agent"])],
      schema: {
        tags: ["Teams"],
      },
    },
    async (_, reply) => {
      reply.send(await teamsService.listTeams());
    },
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate, requireRole(["admin"])],
      schema: { params: z.object({ id: z.string() }), tags: ["Teams"] },
    },
    async (request, reply) => {
      await teamsService.deleteTeamById(request.params.id);
      reply.code(204).send();
    },
  );
}
