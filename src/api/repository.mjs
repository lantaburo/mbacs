import pg from "pg";
import { action, clean, sanitizeCRM, workshop } from "../domain.mjs";

const { Pool } = pg;

export class RepositoryError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const schema = `
  CREATE TABLE IF NOT EXISTS workshop_snapshots (
    workshop_id UUID PRIMARY KEY REFERENCES workshops(id) ON DELETE CASCADE,
    owner_key TEXT NOT NULL,
    revision BIGINT NOT NULL DEFAULT 0,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS workshop_snapshots_owner_idx
    ON workshop_snapshots(owner_key, updated_at DESC);
`;

export function createRepository({ connectionString, pool: suppliedPool } = {}) {
  const pool = suppliedPool || new Pool({
    connectionString,
    max: Number(process.env.MBACS_DB_POOL_SIZE || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  return {
    async initialize() {
      await pool.query(schema);
    },

    async health() {
      await pool.query("SELECT 1");
      return { database: "ok" };
    },

    async list(ownerKey) {
      const result = await pool.query(
        `SELECT w.id, w.name, s.revision
           FROM workshop_snapshots s
           JOIN workshops w ON w.id = s.workshop_id
          WHERE s.owner_key = $1
          ORDER BY w.created_at ASC`,
        [ownerKey],
      );
      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        role: "owner",
        revision: Number(row.revision),
      }));
    },

    async create(ownerKey, input = {}) {
      const record = workshop({ ...input, actor: ownerKey });
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const created = await client.query(
          `INSERT INTO workshops(name, timezone, phone, address)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name`,
          [record.profile.name, record.profile.timezone, record.profile.phone || null, record.profile.address || null],
        );
        await client.query(
          `INSERT INTO workshop_snapshots(workshop_id, owner_key, data)
           VALUES ($1, $2, $3::jsonb)`,
          [created.rows[0].id, ownerKey, JSON.stringify(record)],
        );
        await client.query("COMMIT");
        return { id: created.rows[0].id, name: created.rows[0].name, role: "owner", revision: 0 };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async state(ownerKey, workshopId) {
      const result = await pool.query(
        `SELECT data, revision
           FROM workshop_snapshots
          WHERE workshop_id = $1 AND owner_key = $2`,
        [workshopId, ownerKey],
      );
      if (!result.rowCount) throw new RepositoryError("Workshop tidak ditemukan.", 404);
      return { ...result.rows[0].data, revision: Number(result.rows[0].revision) };
    },

    async sync(ownerKey, workshopId, revision, data) {
      const crm = sanitizeCRM(data);
      const result = await pool.query(
        `UPDATE workshop_snapshots
            SET data = jsonb_set(data, '{crm}', $1::jsonb),
                revision = revision + 1,
                updated_at = now()
          WHERE workshop_id = $2 AND owner_key = $3 AND revision = $4
          RETURNING revision`,
        [JSON.stringify(crm), workshopId, ownerKey, revision],
      );
      if (!result.rowCount) {
        const exists = await pool.query(
          "SELECT 1 FROM workshop_snapshots WHERE workshop_id = $1 AND owner_key = $2",
          [workshopId, ownerKey],
        );
        if (!exists.rowCount) throw new RepositoryError("Workshop tidak ditemukan.", 404);
        throw new RepositoryError("Data berubah di perangkat lain. Muat ulang sebelum menyimpan.", 409);
      }
      return {
        synced: true,
        revision: Number(result.rows[0].revision),
        counts: Object.fromEntries(Object.entries(crm).map(([key, value]) => [key, value.length])),
      };
    },

    async mutate(ownerKey, workshopId, name, args = {}) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const selected = await client.query(
          `SELECT data, revision
             FROM workshop_snapshots
            WHERE workshop_id = $1 AND owner_key = $2
            FOR UPDATE`,
          [workshopId, ownerKey],
        );
        if (!selected.rowCount) throw new RepositoryError("Workshop tidak ditemukan.", 404);
        const record = selected.rows[0].data;
        const result = action(record, name, args, ownerKey);
        const updated = await client.query(
          `UPDATE workshop_snapshots
              SET data = $1::jsonb, revision = revision + 1, updated_at = now()
            WHERE workshop_id = $2
            RETURNING revision`,
          [JSON.stringify(record), workshopId],
        );
        await client.query("COMMIT");
        return { result, revision: Number(updated.rows[0].revision) };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async receiveWhatsApp(ownerKey, workshopId, payload = {}) {
      const externalId = clean(payload.externalId, 200);
      if (!externalId) throw new RepositoryError("externalId WhatsApp wajib diisi.");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const event = await client.query(
          `INSERT INTO webhook_events(workshop_id, provider, external_id, event_type, payload, status)
           SELECT $1, 'whatsapp', $2, 'message', $3::jsonb, 'received'
            WHERE EXISTS (
              SELECT 1 FROM workshop_snapshots WHERE workshop_id = $1 AND owner_key = $4
            )
           ON CONFLICT (provider, external_id) DO NOTHING
           RETURNING id`,
          [workshopId, externalId, JSON.stringify(payload), ownerKey],
        );
        if (!event.rowCount) {
          const access = await client.query(
            "SELECT 1 FROM workshop_snapshots WHERE workshop_id = $1 AND owner_key = $2",
            [workshopId, ownerKey],
          );
          if (!access.rowCount) throw new RepositoryError("Workshop tidak ditemukan.", 404);
          await client.query("COMMIT");
          return { accepted: true, duplicate: true, externalId };
        }

        const selected = await client.query(
          `SELECT data
             FROM workshop_snapshots
            WHERE workshop_id = $1 AND owner_key = $2
            FOR UPDATE`,
          [workshopId, ownerKey],
        );
        const record = selected.rows[0].data;
        const result = action(record, "receive_message", payload, "whatsapp-webhook");
        const updated = await client.query(
          `UPDATE workshop_snapshots
              SET data = $1::jsonb, revision = revision + 1, updated_at = now()
            WHERE workshop_id = $2
            RETURNING revision`,
          [JSON.stringify(record), workshopId],
        );
        await client.query(
          "UPDATE webhook_events SET status = 'processed', processed_at = now() WHERE id = $1",
          [event.rows[0].id],
        );
        await client.query("COMMIT");
        return { accepted: true, duplicate: false, externalId, ...result, revision: Number(updated.rows[0].revision) };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async close() {
      await pool.end();
    },
  };
}
