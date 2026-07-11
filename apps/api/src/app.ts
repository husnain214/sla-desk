import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", (_, res) => {
  res.send({ message: "Server is running" });
});

export default app;
