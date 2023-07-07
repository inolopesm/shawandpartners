import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyPostgres from "@fastify/postgres";
import { parse } from "csv-parse";
import env from "env-var";

interface User {
  id: number;
  name: string;
  city: string;
  country: string;
  favoriteSport: string;
}

const app = fastify();

app.register(fastifyCors);
app.register(fastifyMultipart);

app.register(fastifyPostgres, {
  connectionString: env.get("POSTGRES_URL").required().asString(),
});

app.post("/api/files", async function (req, reply) {
  const data = await req.file();

  if (data === undefined) {
    reply.status(400);
    return { message: "file not found" };
  }

  await this.pg.transact(async (client) => {
    const parser = data.file.pipe(parse({ columns: true }));

    for await (const data of parser) {
      const { name, city, country, favorite_sport: favoriteSport } = data;

      await client.query(
        'INSERT INTO "User" ("name", "city", "country", "favoriteSport") VALUES ($1, $2, $3, $4)',
        [name, city, country, favoriteSport]
      );
    }
  });

  return null;
});

app.get("/api/users", async function () {
  const { rows: users } = await this.pg.query<User>(
    'SELECT "id", "name", "city", "country", "favoriteSport" FROM "User"'
  );

  return users;
});

app.listen({ port: env.get("PORT").required().asPortNumber() });
