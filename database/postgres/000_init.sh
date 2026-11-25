#!/bin/sh
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
  --set=mbacs_password="$MBACS_DB_PASSWORD" \
  --set=n8n_password="$N8N_DB_PASSWORD" <<'EOSQL'
SELECT format('CREATE ROLE mbacs_app LOGIN PASSWORD %L', :'mbacs_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mbacs_app') \gexec

SELECT format('CREATE ROLE n8n_app LOGIN PASSWORD %L', :'n8n_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'n8n_app') \gexec

SELECT 'CREATE DATABASE mbacs_db OWNER mbacs_app'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'mbacs_db') \gexec

SELECT 'CREATE DATABASE n8n_db OWNER n8n_app'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'n8n_db') \gexec
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname mbacs_db --file /opt/mbacs/001_schema.sql
