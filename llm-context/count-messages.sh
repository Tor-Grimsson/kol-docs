#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/count-messages.sh [increment|reset|show|set <n>]

Tracks assistant reply counts to keep checkpoint cadence compliant.
- increment (default): increase count by 1 and display warnings at 10/15
- reset: set count to 0
- show: display current count without changing it
- set <n>: force the counter to a specific value

Counts are stored in .codex/message-count within the repo root.
EOF
}

ACTION=${1:-increment}
VALUE=${2:-}

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
STATE_DIR="${ROOT_DIR}/.codex"
STATE_FILE="${STATE_DIR}/message-count"

mkdir -p "${STATE_DIR}"

if [[ ! -f "${STATE_FILE}" ]]; then
  echo "0" > "${STATE_FILE}"
fi

read -r COUNT < "${STATE_FILE}"

is_integer() {
  [[ $1 =~ ^-?[0-9]+$ ]]
}

case "${ACTION}" in
  -h|--help|help)
    usage
    exit 0
    ;;
  reset)
    COUNT=0
    ;;
  show)
    ;;
  set)
    if ! is_integer "${VALUE}"; then
      echo "Error: set requires an integer value." >&2
      exit 1
    fi
    COUNT=${VALUE}
    ;;
  increment|"")
    COUNT=$((COUNT + 1))
    ;;
  *)
    echo "Unknown action: ${ACTION}" >&2
    usage
    exit 1
    ;;
esac

echo "${COUNT}" > "${STATE_FILE}"

if [[ "${ACTION}" != "show" ]]; then
  echo "Current reply count: ${COUNT}"
fi

if (( COUNT >= 15 )); then
  echo "🚨 OVERLIMIT: checkpoint immediately before replying again."
elif (( COUNT >= 10 )); then
  echo "⚠️  You have reached 10 responses. Create a checkpoint before continuing."
fi
