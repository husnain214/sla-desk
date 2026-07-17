import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/errors/error-handler";
import { ticketRoutes } from "./modules/tickets/tickets.routes";
import { commentRoutes } from "./modules/comments/comments.routes";
import { redisRateLimiter } from "./shared/utils/redis-rate-limiter";
import { inviteRoutes } from "./modules/invites/invites.routes";

export const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SLA Desk API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(errorHandler);
await app.register(redisRateLimiter);

app.register(fastifyJwt, { secret: env.JWT_SECRET });

app.register(authRoutes, { prefix: "/auth" });
app.register(ticketRoutes, { prefix: "/tickets" });
app.register(commentRoutes, { prefix: "/tickets/:ticketId/comments" });
app.register(inviteRoutes, { prefix: "/invites" });

app.get("/", (_, res) => {
  res.send({ message: "Server is running" });
});
