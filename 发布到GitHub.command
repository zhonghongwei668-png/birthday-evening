#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${SCRIPT_DIR}" || exit 1

"${SCRIPT_DIR}/scripts/publish-github.sh" "$@"
status=$?

printf '\n按回车键关闭窗口…'
IFS= read -r _
exit "${status}"
