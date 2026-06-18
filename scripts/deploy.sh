#!/usr/bin/env bash
# Simple deploy helper: build images, run DB migrations (schema auto-init),
# and bring the stack up. Mirrors what the Jenkins deploy stage does.
set -euo pipefail
echo "==> Building images"
docker compose build
echo "==> Starting stack"
docker compose up -d
echo "==> Waiting for API health"
./scripts/healthcheck.sh http://localhost:4000/health 20
echo "==> Deploy complete. Frontend: http://localhost:8080  HTTPS: https://localhost"
