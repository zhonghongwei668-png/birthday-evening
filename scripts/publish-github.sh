#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REMOTE_NAME="github"
REMOTE_BRANCH="source"
LIVE_URL="https://zhonghongwei668-png.github.io/birthday-evening/"
ACTIONS_URL="https://github.com/zhonghongwei668-png/birthday-evening/actions"
CODEX_RUNTIME="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies"
DEPLOY_KEY="${HOME}/.ssh/birthday-evening-github"

if [[ -x "${CODEX_RUNTIME}/node/bin/node" ]]; then
  export PATH="${CODEX_RUNTIME}/node/bin:${CODEX_RUNTIME}/bin/fallback:${PATH}"
fi

cd "${PROJECT_ROOT}"

fail() {
  printf '\n发布已停止：%s\n' "$1" >&2
  exit 1
}

for command_name in git node pnpm; do
  command -v "${command_name}" >/dev/null 2>&1 || fail "电脑中找不到 ${command_name}，请先安装 Node.js、pnpm 和 Git。"
done

[[ -f "${DEPLOY_KEY}" ]] || fail "缺少生日邀请仓库的专用上传密钥，请先完成一次 GitHub 授权。"
export GIT_SSH_COMMAND="ssh -i ${DEPLOY_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "当前文件夹不是 Git 项目。"
git remote get-url "${REMOTE_NAME}" >/dev/null 2>&1 || fail "缺少名为 github 的远程仓库。"

printf '\nA Little Birthday Evening · 一键发布\n'
printf '%s\n' '--------------------------------------'
printf '正在确认 GitHub 源码分支…\n'

if git ls-remote --exit-code --heads "${REMOTE_NAME}" "${REMOTE_BRANCH}" >/dev/null 2>&1; then
  git fetch --quiet "${REMOTE_NAME}" \
    "+refs/heads/${REMOTE_BRANCH}:refs/remotes/${REMOTE_NAME}/${REMOTE_BRANCH}"

  if ! git merge-base --is-ancestor \
    "refs/remotes/${REMOTE_NAME}/${REMOTE_BRANCH}" HEAD; then
    fail "GitHub 上的 source 分支包含本机没有的更新。为保护文件，本程序不会强制覆盖，请先同步后再发布。"
  fi
fi

printf '\n1/3 正在检查页面代码…\n'
if [[ ! -d node_modules ]]; then
  printf '首次运行，正在准备发布环境…\n'
  pnpm install --frozen-lockfile
fi
pnpm run lint
pnpm run test

printf '\n2/3 正在检查 GitHub Pages 版本…\n'
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH="/birthday-evening" \
NEXT_PUBLIC_SITE_URL="${LIVE_URL%/}" \
NEXT_TELEMETRY_DISABLED="1" \
pnpm exec next build --webpack

git add -A

if git diff --cached --name-only | grep -E '(^|/)\.env($|\.)' >/dev/null 2>&1; then
  fail "检测到环境配置文件（.env）。为避免上传隐私信息，已取消发布。"
fi

if ! git diff --cached --quiet; then
  version_note="${1:-}"

  if [[ -z "${version_note}" && -t 0 ]]; then
    printf '\n请输入这次更新的简短说明（直接回车将使用当前时间）：\n> '
    IFS= read -r version_note
  fi

  if [[ -z "${version_note}" ]]; then
    version_note="$(date '+%Y-%m-%d %H:%M')"
  fi

  git commit -m "release: ${version_note}"
else
  printf '没有发现需要提交的新改动，将检查 GitHub 是否已同步。\n'
fi

printf '\n3/3 正在上传源文件到 GitHub…\n'
git push github HEAD:source

printf '\n发布完成。GitHub 会自动生成并更新网页。\n'
printf '进度：%s\n' "${ACTIONS_URL}"
printf '网页：%s\n' "${LIVE_URL}"
