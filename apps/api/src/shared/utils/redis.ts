import { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import { createClient } from "redis";
import { env } from "../../config/env";

export async function registerRedisRateLimiter(app: FastifyInstance) {
  const redisClient = createClient({ url: env.REDIS_URL });
  await redisClient.connect();

  app.register(fastifyRateLimit, {
    global: false,
    redis: redisClient,
    keyGenerator: (request) => request.user.userId ?? request.ip,
    errorResponseBuilder: (_, context) => ({
      error: `Rate limit exceeded. Try again in ${context.after}.`,
    }),
  });
}
