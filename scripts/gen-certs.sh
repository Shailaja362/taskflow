#!/usr/bin/env bash
# Generate a self-signed TLS certificate for local HTTPS testing.
set -euo pipefail
CERT_DIR="$(dirname "$0")/../nginx/certs"
mkdir -p "$CERT_DIR"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/server.key" \
  -out "$CERT_DIR/server.crt" \
  -subj "/C=IN/ST=TN/L=Coimbatore/O=TaskFlow/CN=localhost"
echo "Self-signed cert written to $CERT_DIR"
