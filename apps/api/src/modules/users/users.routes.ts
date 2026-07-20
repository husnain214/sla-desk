import { AppInstance } from "../../types";
import { authenticate, requireRole } from "../auth/auth.middleware";
import * as userRepository from "./users.repository";

export default function userRoutes(fastify: AppInstance) {
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
}
