import { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import Redis from "ioredis";
import fp from "fastify-plugin";
import { env } from "../../config/env";

export const redisRateLimiter = fp(async (app: FastifyInstance) => {
  const redisClient = new Redis(env.REDIS_URL);

  await app.register(fastifyRateLimit, {
    global: false,
    redis: redisClient,
    hook: "preHandler",
    keyGenerator: async (request) => request.user.userId ?? request.ip,
    errorResponseBuilder: (_, context) => ({
      error: `Rate limit exceeded. Try again in ${context.after}.`,
    }),
  });
});
