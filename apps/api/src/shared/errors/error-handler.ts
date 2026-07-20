import type { FastifyError, FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import fp from "fastify-plugin";
import { AppError } from "./app-error";

export const errorHandler = fp((app: FastifyInstance) => {
  app.setErrorHandler((err, request, reply) => {
    const error = err as FastifyError;

    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: "Validation failed",
        details: error.validation.map((e) => ({
          path: e.instancePath,
          message: e.message,
        })),
      });
    }

    if (error.code === "FST_ERR_CTP_INVALID_JSON") {
      return reply.code(400).send({
        error: "Invalid JSON",
        message: error.message,
      });
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }

    request.log.error(error);
    reply.code(500).send({
      error: "Internal server error",
      message: error.message,
      name: error.name,
    });
  });
});
