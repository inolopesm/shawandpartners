import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { parse } from "csv-parse";

const app = fastify();

app.register(fastifyMultipart);

app.post("/api/files", async (req, reply) => {
  const data = await req.file();

  if (data === undefined) {
    reply.status(400);
    return { message: "file not found" };
  }

  const parser = data.file.pipe(parse());

  for await (const data of parser) {
    const [name, city, country, favoriteSport] = data;
    console.log({ name, city, country, favoriteSport });
  }

  return null;
});

app.listen({ port: 3000 });
