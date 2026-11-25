import { action,workshop,clean,readOnlyActions,ownerActions } from "./domain.mjs";
import { assets } from "./assets.mjs";

const methodSpecs = {
  list: ["Daftar workshop MBACS yang dapat diakses", []],
  create: ["Buat workspace CRM bengkel", ["name"], ["phone", "address"], [], [], ["seed"]],
  state: ["Baca profil, pelanggan, kendaraan, lead, percakapan, booking, dan tugas", ["workshop"]],
  sync: ["Sinkronkan snapshot CRM setelah perubahan pengguna", ["workshop"], [], [], ["revision"], ["data"]],
  customer: ["Tambah pelanggan dan kendaraan", ["workshop", "name", "phone"], ["vehicle", "plate"]],
  lead: ["Tambah lead dengan kebutuhan dan next action", ["workshop", "name", "need"], ["vehicle", "next"], [], ["score"]],
  appointment: ["Buat booking bengkel", ["workshop", "name", "date", "time", "job"], [], [], ["bay"]],
  message: ["Simpan draf balasan CS pada percakapan", ["workshop", "conversation", "body"]],
  advance_lead: ["Pindahkan lead ke tahap berikutnya", ["workshop"], ["next"], [], ["from", "index"]],
  grant: ["Kelola akses workshop berdasarkan email akun", ["workshop", "email", "role"]]
};

const schemas = Object.entries(methodSpecs).map(([name, [description, required, strings = [], bools = [], numbers = [], objects = []]]) => ({
  name,
  description,
  inputSchema: {
    type: "object",
    properties: Object.fromEntries([
      ...[...required, ...strings].map(key => [key, { type: "string" }]),
      ...bools.map(key => [key, { type: "boolean" }]),
      ...numbers.map(key => [key, { type: "number" }]),
      ...objects.map(key => [key, { type: "object", additionalProperties: true }])
    ]),
    required,
    additionalProperties: false
  },
  annotations: { readOnlyHint: readOnlyActions.has(name), destructiveHint: false, openWorldHint: false }
}));

const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });
class RequestError extends Error { constructor(message, status) { super(message); this.status = status; } }
const roleFor = (row, record, user) => row.owner === user.id ? "owner" : record.members[user.email] || null;

async function execute(db, user, name, args) {
  if (!Object.hasOwn(methodSpecs, name)) throw new RequestError("Tindakan tidak ditemukan.", 404);
  if (name === "list") {
    const rows = await db.prepare("SELECT id, owner, revision, data FROM workshops WHERE owner = ?1 OR EXISTS (SELECT 1 FROM json_each(json_extract(data, '$.members')) WHERE key = ?2) ORDER BY id").bind(user.id, user.email).all();
    return rows.results.map(row => { const record = JSON.parse(row.data); return { id: row.id, name: record.profile.name, role: roleFor(row, record, user), revision: row.revision }; }).filter(row => row.role);
  }
  if (name === "create") {
    const id = crypto.randomUUID();
    const record = workshop({ ...args, actor: user.email });
    await db.prepare("INSERT INTO workshops (id, owner, data) VALUES (?, ?, ?)").bind(id, user.id, JSON.stringify(record)).run();
    return { id, name: record.profile.name, revision: 0 };
  }

  const id = clean(args.workshop, 64);
  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await db.prepare("SELECT owner, revision, data FROM workshops WHERE id = ?").bind(id).first();
    if (!row) throw new RequestError("Workshop tidak ditemukan.", 404);
    const record = JSON.parse(row.data);
    const role = roleFor(row, record, user);
    if (!role) throw new RequestError("Akses workshop tidak tersedia.", 403);
    if (ownerActions.has(name) && role !== "owner") throw new RequestError("Tindakan ini memerlukan akses pemilik.", 403);
    if (name === "state") return { ...record, revision: row.revision };
    if (name === "sync" && Number(args.revision) !== row.revision) throw new RequestError("Data berubah di perangkat lain. Muat ulang sebelum menyimpan.", 409);
    const result = action(record, name, args, user.email);
    const updated = await db.prepare("UPDATE workshops SET data = ?, revision = revision + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND revision = ?").bind(JSON.stringify(record), id, row.revision).run();
    if (updated.meta.changes === 1) return { ...result, revision: row.revision + 1 };
  }
  throw new RequestError("Data sedang diperbarui. Coba lagi.", 409);
}

const rpc = (id, data) => ({ jsonrpc: "2.0", id, result: data });
async function handleMcp(db, user, body) {
  const id = body?.id ?? null;
  if (body?.method === "server/discover") return json(rpc(id, { supportedVersions: ["2026-07-28"], capabilities: { tools: {} } }));
  if (body?.method === "initialize") return json(rpc(id, { protocolVersion: body.params?.protocolVersion ?? "2026-07-28", capabilities: { tools: {} }, serverInfo: { name: "MBACS CRM", version: "2.0.0" } }));
  if (body?.method === "ping") return json(rpc(id, {}));
  if (body?.method === "notifications/initialized") return new Response(null, { status: 202 });
  if (body?.method === "tools/list") return json(rpc(id, { tools: schemas }));
  if (body?.method === "tools/call") {
    if (!user) return json({ jsonrpc: "2.0", id, error: { code: -32001, message: "Masuk dengan ChatGPT untuk mengakses MBACS." } });
    try {
      const result = await execute(db, user, body.params?.name, body.params?.arguments ?? {});
      return json(rpc(id, { content: [{ type: "text", text: JSON.stringify(result) }], isError: false }));
    } catch (error) {
      return json(rpc(id, { content: [{ type: "text", text: error.message }], isError: true }));
    }
  }
  return json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
}

const assetResponse = ([body, type]) => new Response(body, { headers: { "content-type": type, "x-content-type-options": "nosniff", "cache-control": type.startsWith("text/html") ? "no-store" : "public, max-age=300" } });

export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (request.method === "GET") {
    const asset = assets[url.pathname];
    return asset ? assetResponse(asset) : new Response("Halaman tidak ditemukan", { status: 404 });
  }
  if (request.method !== "POST" || !["/api", "/mcp"].includes(url.pathname)) return new Response(null, { status: 405 });
  if (url.pathname === "/api" && request.headers.get("origin") !== url.origin) return json({ error: "Asal permintaan tidak valid." }, 403);
  const userId = request.headers.get("oai-authenticated-user-id");
  if (!userId) return json({ error: "Masuk dengan ChatGPT untuk melanjutkan." }, 401);
  const user = { id: userId, email: clean(request.headers.get("oai-authenticated-user-email"), 254).toLowerCase() };
  try {
    const payload = await request.text();
    if (payload.length > 500000) return json({ error: "Kiriman terlalu besar." }, 413);
    const body = JSON.parse(payload);
    if (url.pathname === "/mcp") return handleMcp(env.DB, user, body);
    return json({ result: await execute(env.DB, user, body?.action, body?.args ?? {}) });
  } catch (error) {
    return json({ error: error.message }, error.status ?? 400);
  }
} };
