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
