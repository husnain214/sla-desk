import type { FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { AppError } from "./app-error";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: "Validation failed",
        details: error.validation.map((e) => ({
          path: e.instancePath,
          message: e.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }

    request.log.error(error);
    reply.code(500).send({ error: "Internal server error" });
  });
}
