#!/usr/bin/env bash
# Poll the API health endpoint; exit non-zero if unhealthy (used in CI smoke test).
set -euo pipefail
URL="${1:-http://localhost:4000/health}"
RETRIES="${2:-10}"
for i in $(seq 1 "$RETRIES"); do
  if curl -fsS "$URL" >/dev/null 2>&1; then
    echo "Healthy: $URL"
    exit 0
  fi
  echo "Attempt $i/$RETRIES failed; retrying in 3s..."
  sleep 3
done
echo "Service did not become healthy: $URL" >&2
exit 1
