import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publishes clean source through a guarded one-click program", async () => {
  const [publisher, launcher, publisherStats, launcherStats] = await Promise.all([
    readFile(new URL("scripts/publish-github.sh", root), "utf8"),
    readFile(new URL("发布到GitHub.command", root), "utf8"),
    stat(new URL("scripts/publish-github.sh", root)),
    stat(new URL("发布到GitHub.command", root)),
  ]);

  assert.match(publisher, /pnpm run lint/);
  assert.match(publisher, /pnpm run test/);
  assert.match(publisher, /next build --webpack/);
  assert.match(publisher, /NEXT_PUBLIC_BASE_PATH="\/birthday-evening"/);
  assert.match(publisher, /git push github HEAD:source/);
  assert.match(publisher, /merge-base --is-ancestor/);
  assert.match(publisher, /birthday-evening-github/);
  assert.match(publisher, /GIT_SSH_COMMAND/);
  assert.match(publisher, /git diff --cached --name-only/);
  assert.match(publisher, /\.env/);
  assert.doesNotMatch(publisher, /--force|-f\s+github/);
  assert.match(launcher, /scripts\/publish-github\.sh/);
  assert.ok(publisherStats.mode & 0o100, "publisher should be executable");
  assert.ok(launcherStats.mode & 0o100, "launcher should be executable");
});

test("deploys GitHub Pages only from the clean source branch", async () => {
  const workflow = await readFile(
    new URL(".github/workflows/deploy-pages.yml", root),
    "utf8",
  );

  assert.match(workflow, /branches:\s*\n\s*- source/);
  assert.doesNotMatch(workflow, /branches:\s*\n\s*- main/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /pnpm run test/);
  assert.match(workflow, /next build --webpack/);
  assert.match(workflow, /NEXT_PUBLIC_BASE_PATH: \$\{\{ steps\.pages\.outputs\.base_path \}\}/);
  assert.match(workflow, /path: \.\/out/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
});
