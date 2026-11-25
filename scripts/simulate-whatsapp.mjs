import { randomUUID } from "node:crypto";

const options = Object.fromEntries(process.argv.slice(2).map((entry) => {
  const [key, ...value] = entry.replace(/^--/, "").split("=");
  return [key, value.join("=")];
}));

const baseUrl = (process.env.MBACS_PUBLIC_URL || "http://localhost:8080").replace(/\/$/, "");
const username = process.env.MBACS_BASIC_AUTH_USER || "mbacs";
const password = process.env.MBACS_BASIC_AUTH_PASSWORD;
if (!password) throw new Error("MBACS_BASIC_AUTH_PASSWORD wajib diisi untuk menjalankan simulator.");

const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
const payload = {
  externalId: options.id || `sim-${randomUUID()}`,
  from: options.phone || "081200009911",
  name: options.name || "Rina Simulator",
  body: options.message || "Halo, saya ingin booking servis rutin besok.",
  vehicle: options.vehicle || "Toyota Calya 2021",
  plate: options.plate || "B 1234 SIM",
  receivedLabel: "Baru saja",
};

async function request(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { authorization, "content-type": "application/json", ...init.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Request gagal dengan HTTP ${response.status}.`);
  return result;
}

const n8nWebhook = process.env.MBACS_N8N_WEBHOOK_URL;
if (n8nWebhook) {
  const result = await request(n8nWebhook, { method: "POST", body: JSON.stringify(payload) });
  console.log(JSON.stringify({ route: "n8n", payload, response: result }, null, 2));
} else {
  let workspaces = (await request(`${baseUrl}/api/v1/workshops`)).result || [];
  if (!workspaces.length) {
    const created = await request(`${baseUrl}/api/v1/workshops`, {
      method: "POST",
      body: JSON.stringify({ name: "MBACS Workshop" }),
    });
    workspaces = [created.result];
  }
  const workshopId = options.workshop || workspaces[0].id;
  const result = await request(`${baseUrl}/api/v1/workshops/${workshopId}/webhooks/whatsapp`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log(JSON.stringify({ route: "api", workshopId, payload, response: result }, null, 2));
}
