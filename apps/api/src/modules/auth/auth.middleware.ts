import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "./auth.types";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({ error: "Unauthorized" });
  }
}

export function requireRole(allowedRoles: JwtPayload["role"][]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      reply.code(403).send({ error: "Forbidden" });
    }
  };
}
