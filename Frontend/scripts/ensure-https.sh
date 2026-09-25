#!/usr/bin/env bash
# Ensures brijstays.in is always served over HTTPS at the Cloudflare edge.
# Fixes the two live issues:
#   1. www.brijstays.in has no DNS record (NXDOMAIN) -> add proxied CNAME to apex
#   2. Cloudflare "Always Use HTTPS" may be off -> turn it on so http is upgraded
#      at the edge before it even hits the Worker
#   3. Verifies the Worker is sending HSTS (the code in src/server.ts already does)
#
# Usage:  CF_API_TOKEN=xxx CF_ZONE=brijstays.in ./ensure-https.sh
#     or  CF_API_TOKEN=xxx CF_ZONE_ID=yyy         ./ensure-https.sh
# Reads the same .deploy.env as purge-cache.sh (gitignored).
set -euo pipefail
cd "$(dirname "$0")"
[ -f .deploy.env ] && . ./.deploy.env
: "${CF_API_TOKEN:?set CF_API_TOKEN in .deploy.env or env (needs Zone:Read + DNS:Edit + Zone:Edit)}"

if [ -z "${CF_ZONE_ID:-}" ]; then
  : "${CF_ZONE:?set CF_ZONE (domain) or CF_ZONE_ID in .deploy.env}"
  echo "→ Looking up zone $CF_ZONE ..."
  CF_ZONE_ID=$(curl -fsS -H "Authorization: Bearer ${CF_API_TOKEN}" \
    "https://api.cloudflare.com/client/v4/zones?name=${CF_ZONE}" \
    | grep -oE '"id":"[0-9a-f]{32}"' | head -1 | cut -d'"' -f4)
  : "${CF_ZONE_ID:?could not find zone id for $CF_ZONE}"
fi
echo "→ Zone $CF_ZONE_ID"

# 1. Ensure www CNAME exists and is proxied
echo "→ Checking www DNS ..."
EXISTING=$(curl -fsS -H "Authorization: Bearer ${CF_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records?name=www.brijstays.in&type=CNAME" \
  | grep -o '"name":"www.brijstays.in"' | head -1 || true)
if [ -n "$EXISTING" ]; then
  echo "  www.brijstays.in already exists — skipping create"
else
  echo "  www.brijstays.in missing (NXDOMAIN) — creating proxied CNAME → brijstays.in"
  curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
    -d '{"type":"CNAME","name":"www","content":"brijstays.in","proxied":true,"ttl":1}' | cat
  echo
fi

# 2. Ensure Always Use HTTPS is ON (edge-level http→https before Worker)
echo "→ Enabling Always Use HTTPS ..."
curl -fsS -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/always_use_https" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
  -d '{"value":"on"}' | cat
echo

# 3. Ensure Automatic HTTPS Rewrites is ON (fixes mixed content)
echo "→ Enabling Automatic HTTPS Rewrites ..."
curl -fsS -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/automatic_https_rewrites" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
  -d '{"value":"on"}' | cat
echo

echo "Done. Verify:"
echo "  dig www.brijstays.in  (should return Cloudflare IPs, not NXDOMAIN)"
echo "  curl -I http://brijstays.in/        (should 301 to https://...)"
echo "  curl -I https://www.brijstays.in/   (should 301 to https://brijstays.in/)"
echo "  curl -I https://brijstays.in/       (should include strict-transport-security: max-age=31536000; includeSubDomains; preload)"
