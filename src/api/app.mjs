import { timingSafeEqual } from "node:crypto";

const MAX_BODY_BYTES = 500_000;
const mutationActions = new Set(["customer", "lead", "appointment", "message", "advance_lead", "grant"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const json = (response, status, body) => {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(body));
};

const safeEqual = (left = "", right = "") => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

async function body(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError("Kiriman terlalu besar.", 413);
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError("JSON tidak valid.", 400);
  }
}

function requireAuth(request, proxyToken) {
  if (!proxyToken) throw new HttpError("MBACS_PROXY_TOKEN belum dikonfigurasi.", 503);
  if (!safeEqual(request.headers["x-mbacs-proxy-token"], proxyToken)) {
    throw new HttpError("Akses API tidak diizinkan.", 401);
  }
}

function workshopId(value) {
  if (!uuidPattern.test(String(value || ""))) throw new HttpError("ID workshop tidak valid.");
  return value;
}

async function legacy(repository, ownerKey, payload) {
  const name = payload?.action;
  const args = payload?.args || {};
  if (name === "list") return repository.list(ownerKey);
  if (name === "create") return repository.create(ownerKey, args);
  if (name === "state") return repository.state(ownerKey, workshopId(args.workshop));
  if (name === "sync") {
    const revision = Number(args.revision);
    if (!Number.isSafeInteger(revision) || revision < 0) throw new HttpError("Revision tidak valid.");
    return repository.sync(ownerKey, workshopId(args.workshop), revision, args.data);
  }
  if (mutationActions.has(name)) return repository.mutate(ownerKey, workshopId(args.workshop), name, args);
  throw new HttpError("Tindakan API tidak ditemukan.", 404);
}

async function versioned(repository, ownerKey, request, url) {
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 3 && parts[2] === "workshops") {
    if (request.method === "GET") return repository.list(ownerKey);
    if (request.method === "POST") return repository.create(ownerKey, await body(request));
  }

  const id = parts[3];
  if (parts.length === 5 && parts[2] === "workshops" && parts[4] === "state") {
    if (request.method === "GET") return repository.state(ownerKey, workshopId(id));
    if (request.method === "PUT") {
      const payload = await body(request);
      const revision = Number(payload.revision);
      if (!Number.isSafeInteger(revision) || revision < 0) throw new HttpError("Revision tidak valid.");
      return repository.sync(ownerKey, workshopId(id), revision, payload.data);
    }
  }

  if (parts.length === 6 && parts[2] === "workshops" && parts[4] === "actions" && request.method === "POST") {
    const name = parts[5];
    if (!mutationActions.has(name)) throw new HttpError("Tindakan API tidak ditemukan.", 404);
    return repository.mutate(ownerKey, workshopId(id), name, await body(request));
  }
  throw new HttpError("Endpoint tidak ditemukan.", 404);
}

export function createApp({ repository, proxyToken, ownerKey = "local-owner" }) {
  return async (request, response) => {
    const url = new URL(request.url, "http://mbacs.local");
    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return json(response, 200, { status: "ok", ...(await repository.health()) });
      }
      if (url.pathname !== "/api" && !url.pathname.startsWith("/api/v1/")) {
        throw new HttpError("Endpoint tidak ditemukan.", 404);
      }
      requireAuth(request, proxyToken);

      let result;
      if (url.pathname === "/api") {
        if (request.method !== "POST") throw new HttpError("Metode tidak didukung.", 405);
        result = await legacy(repository, ownerKey, await body(request));
      } else {
        result = await versioned(repository, ownerKey, request, url);
      }
      return json(response, 200, { result });
    } catch (error) {
      const status = Number(error.status) || 500;
      if (status >= 500) console.error(error);
      return json(response, status, { error: status >= 500 ? "Layanan MBACS sedang bermasalah." : error.message });
    }
  };
}
