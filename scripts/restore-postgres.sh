#!/bin/sh
set -eu

if [ "$#" -ne 1 ] || [ ! -f "$1" ]; then
  printf '%s\n' "Pemakaian: scripts/restore-postgres.sh backups/mbacs-TIMESTAMP.dump" >&2
  exit 2
fi

backup_file="$1"
printf '%s\n' "PERINGATAN: restore akan mengganti data MBACS saat ini." >&2
printf '%s' "Ketik RESTORE untuk melanjutkan: " >&2
read -r confirmation
[ "$confirmation" = "RESTORE" ] || { printf '%s\n' "Restore dibatalkan." >&2; exit 1; }

docker compose exec -T postgres pg_restore \
  --username mbacs_app \
  --dbname mbacs_db \
  --clean \
  --if-exists \
  --no-owner < "$backup_file"

printf '%s\n' "Restore MBACS selesai dari: $backup_file"
