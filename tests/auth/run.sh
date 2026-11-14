#!/usr/bin/env bash
# Integration test for the login (US-004). Starts the site, oauth2-proxy and
# Dex (with a mock login) via Docker Compose and walks through the login flow
# with curl, the way a browser would. Usage: tests/auth/run.sh
set -euo pipefail

cd "$(dirname "$0")"
BASE=http://localhost:8088
MOCK_EMAIL=kilgore@kilgore.trout # the fixed user of Dex's mock connector

work=$(mktemp -d)
export AUTH_TEST_EMAILS_DIR="$work/emails"
mkdir -p "$AUTH_TEST_EMAILS_DIR"
echo "$MOCK_EMAIL" >"$AUTH_TEST_EMAILS_DIR/allowed-emails.txt"
chmod -R a+rX "$work"

cleanup() {
  if [[ "${KEEP_RUNNING:-}" != "1" ]]; then
    docker compose down --volumes --remove-orphans >/dev/null 2>&1 || true
  fi
  rm -rf "$work"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $*" >&2
  docker compose logs --no-color --tail=40 >&2 || true
  exit 1
}
pass() { echo "ok - $*"; }

# status URL [curl args...] -> HTTP status code
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
# location URL [curl args...] -> Location header of the response
location() { curl -s -o /dev/null -w '%{redirect_url}' "$@"; }

# AUTH_TEST_NO_BUILD=1 reuses an existing vriendenweekend:auth-test image.
build=(--build)
[[ "${AUTH_TEST_NO_BUILD:-}" == "1" ]] && build=()
docker compose up "${build[@]}" --detach --quiet-pull 2>/dev/null
for _ in $(seq 1 60); do
  [[ "$(status "$BASE/healthz")" == 200 && "$(status "$BASE/dex/.well-known/openid-configuration")" == 200 && "$(status "$BASE/oauth2/userinfo")" == 401 ]] && break
  sleep 1
done

[[ "$(status "$BASE/healthz")" == 200 ]] || fail "healthz"
pass "site is healthy"

[[ "$(status "$BASE/")" == 200 ]] || fail "home page should be public"
[[ "$(status "$BASE/inloggen")" == 200 ]] || fail "login page should be public"
pass "public pages need no login"

[[ "$(status "$BASE/oauth2/userinfo")" == 401 ]] || fail "userinfo without session should be 401"
pass "no session: userinfo is 401"

for path in /leden /leden.html /leden/iets; do
  got=$(location "$BASE$path")
  [[ "$got" == "$BASE/inloggen?rd=$path" ]] || fail "$path redirected to '$got'"
done
pass "members pages redirect to the login page"

# Without connector_id Dex shows its own chooser; with it, Dex is skipped.
chooser=$(curl -s -L -o "$work/chooser.html" -w '%{url_effective}' -c "$work/jar0" -b "$work/jar0" "$BASE/oauth2/start?rd=/")
[[ "$chooser" == "$BASE/dex/auth?"* ]] && grep -q "mock-other" "$work/chooser.html" ||
  fail "expected Dex's chooser, got '$chooser'"
pass "connector_id picks the provider (Dex's chooser is skipped)"

# login JAR START_PATH -> final URL after following all redirects
login() {
  curl -s -L -o "$work/last.html" -w '%{url_effective}' -c "$1" -b "$1" \
    "$BASE/oauth2/start?rd=$2&connector_id=mock"
}

jar="$work/jar"
final=$(login "$jar" /leden)
[[ "$final" == "$BASE/leden" ]] || fail "login ended at '$final'"
grep -q "Voor deelnemers" "$work/last.html" || fail "members page content missing"
pass "login with an allowed email lands on the members page"

info=$(curl -s -b "$jar" "$BASE/oauth2/userinfo")
[[ "$info" == *"\"email\":\"$MOCK_EMAIL\""* ]] || fail "userinfo was '$info'"
pass "userinfo returns the email"

cookie=$(grep -c '_oauth2_proxy' "$jar" || true)
[[ "$cookie" -ge 1 ]] || fail "no session cookie"
expiry=$(awk '$6 == "_oauth2_proxy" { print $5 }' "$jar" | head -1)
(( expiry - $(date +%s) > 7 * 24 * 3600 )) || fail "session cookie expires within a week"
pass "session lasts longer than a week"

[[ "$(status -b "$jar" "$BASE/leden")" == 200 ]] || fail "members page with session"
pass "members page is served with a session"

curl -s -o /dev/null -c "$jar" -b "$jar" "$BASE/oauth2/sign_out?rd=%2F"
[[ "$(status -b "$jar" "$BASE/oauth2/userinfo")" == 401 ]] || fail "still logged in after sign out"
pass "logout ends the session"

# An email that is not on the allow list gets the Dutch error on the login page.
echo "iemand-anders@example.com" >"$AUTH_TEST_EMAILS_DIR/allowed-emails.txt"
for _ in $(seq 1 20); do
  final=$(login "$work/jar2" /leden)
  [[ "$final" == "$BASE/inloggen?fout=geen-toegang" ]] && break
  rm -f "$work/jar2"
  sleep 1
done
[[ "$final" == "$BASE/inloggen?fout=geen-toegang" ]] || fail "rejected login ended at '$final'"
[[ "$(status -b "$work/jar2" "$BASE/oauth2/userinfo")" == 401 ]] || fail "rejected user has a session"
pass "email not on the allow list is refused (list reloads without restart)"

echo "All login checks passed."
