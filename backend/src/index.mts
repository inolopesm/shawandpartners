import { createInterface } from "node:readline";
import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";

const app = fastify();

app.register(fastifyMultipart);

app.post("/api/files", async (req, reply) => {
  const data = await req.file();

  if (data === undefined) {
    reply.status(400);
    return { message: "file not found" };
  }

  const rl = createInterface({ input: data.file });

  for await (const line of rl) {
    console.log(line);
  }

  return null;
});

app.listen({ port: 3000 });
