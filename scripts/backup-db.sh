#!/usr/bin/env bash
# Back up the Postgres database to a timestamped gzipped dump.
set -euo pipefail
TS="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$OUT_DIR"
echo "Backing up database to $OUT_DIR/taskflow_$TS.sql.gz"
docker compose exec -T db pg_dump -U taskflow taskflow | gzip > "$OUT_DIR/taskflow_$TS.sql.gz"
# Retention: keep only the 7 most recent backups
ls -1t "$OUT_DIR"/taskflow_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -v
echo "Backup complete."
