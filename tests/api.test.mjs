import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { createApp } from "../src/api/app.mjs";

const calls = [];
const workshopId = "00000000-0000-4000-8000-000000000001";
const repository = {
  health: async () => ({ database: "ok" }),
  list: async (owner) => { calls.push(["list", owner]); return []; },
  create: async (owner, input) => { calls.push(["create", owner, input]); return { id: workshopId, revision: 0 }; },
  state: async (owner, id) => { calls.push(["state", owner, id]); return { crm: {}, revision: 2 }; },
  sync: async (owner, id, revision, data) => { calls.push(["sync", owner, id, revision, data]); return { synced: true, revision: revision + 1 }; },
  mutate: async (owner, id, name, args) => { calls.push(["mutate", owner, id, name, args]); return { revision: 3 }; },
};

async function invoke(path, { method = "GET", headers = {}, payload } = {}) {
  const request = Readable.from(payload === undefined ? [] : [Buffer.from(JSON.stringify(payload))]);
  request.method = method;
  request.url = path;
  request.headers = headers;
  const response = {
    status: 0,
    headers: {},
    writeHead(status, nextHeaders) { this.status = status; this.headers = nextHeaders; },
    end(value = "") { this.body = String(value); },
  };
  const app = createApp({ repository, proxyToken: "test-secret", ownerKey: "test-owner" });
  await app(request, response);
  return { status: response.status, json: JSON.parse(response.body) };
}

test("health check tidak membutuhkan token", async () => {
  const response = await invoke("/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.json, { status: "ok", database: "ok" });
});

test("API menolak request tanpa token reverse proxy", async () => {
  const response = await invoke("/api", { method: "POST", payload: {} });
  assert.equal(response.status, 401);
});

test("kontrak dashboard create diteruskan ke repository", async () => {
  calls.length = 0;
  const response = await invoke("/api", {
    method: "POST",
    headers: { "content-type": "application/json", "x-mbacs-proxy-token": "test-secret" },
    payload: { action: "create", args: { name: "Bengkel Test" } },
  });
  assert.equal(response.status, 200);
  assert.equal(response.json.result.id, workshopId);
  assert.deepEqual(calls[0], ["create", "test-owner", { name: "Bengkel Test" }]);
});

test("REST state mendukung optimistic concurrency", async () => {
  calls.length = 0;
  const response = await invoke(`/api/v1/workshops/${workshopId}/state`, {
    method: "PUT",
    headers: { "content-type": "application/json", "x-mbacs-proxy-token": "test-secret" },
    payload: { revision: 4, data: { customers: [] } },
  });
  assert.equal(response.status, 200);
  assert.equal(response.json.result.revision, 5);
  assert.deepEqual(calls[0], ["sync", "test-owner", workshopId, 4, { customers: [] }]);
});
