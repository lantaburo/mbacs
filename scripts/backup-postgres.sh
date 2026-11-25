#!/bin/sh
set -eu

backup_dir="${MBACS_BACKUP_DIR:-./backups}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="$backup_dir/mbacs-$timestamp.dump"

mkdir -p "$backup_dir"
docker compose exec -T postgres pg_dump \
  --username mbacs_app \
  --dbname mbacs_db \
  --format custom \
  --no-owner > "$backup_file"

printf '%s\n' "Backup MBACS tersimpan: $backup_file"
