import { createServer } from "node:http";
import { createApp } from "./app.mjs";
import { createRepository } from "./repository.mjs";

const port = Number(process.env.PORT || 3000);
const connectionString = process.env.DATABASE_URL;
const proxyToken = process.env.MBACS_PROXY_TOKEN || "";
if (!connectionString && !process.env.PGHOST) throw new Error("DATABASE_URL atau PGHOST wajib dikonfigurasi.");
if (proxyToken.length < 32) throw new Error("MBACS_PROXY_TOKEN wajib berisi minimal 32 karakter.");

const repository = createRepository({ connectionString });
await repository.initialize();

const server = createServer(createApp({
  repository,
  proxyToken,
  ownerKey: process.env.MBACS_OWNER_KEY || "local-owner",
}));

server.listen(port, "0.0.0.0", () => {
  console.log(`MBACS API aktif pada port ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} diterima, menghentikan MBACS API...`);
  server.close(async () => {
    await repository.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
