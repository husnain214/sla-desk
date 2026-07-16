import { app } from "./app";
import { env } from "./config/env";
import { setupRealtime } from "./realtime";
import { slaBreachQueue } from "./workers/queue";

try {
  await setupRealtime(app);
  await app.listen({ port: env.PORT, host: "0.0.0.0" });

  await slaBreachQueue.add(
    "check-sla-breaches",
    {},
    { repeat: { every: 60_000 } },
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
