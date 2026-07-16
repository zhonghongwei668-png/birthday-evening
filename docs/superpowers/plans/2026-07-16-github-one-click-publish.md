# GitHub One-Click Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe one-click Mac publishing program that commits each finished version to a clean GitHub source branch and lets GitHub Actions rebuild the existing GitHub Pages site automatically.

**Architecture:** Keep the current local repository as the source of truth and publish `HEAD` to a dedicated remote `source` branch so the manually assembled remote `main` branch is never overwritten. A GitHub Actions workflow triggered by `source` validates, builds, and deploys the static `out/` artifact. A double-clickable macOS wrapper calls a guarded shell script that checks the project, tests it, creates a version commit when needed, and pushes without force.

**Tech Stack:** POSIX shell, Git, pnpm, Next.js static export, Node test runner, GitHub Actions, GitHub Pages

---

### Task 1: Define automation contract with source tests

**Files:**
- Create: `tests/github-publish.test.mjs`
- Test: `tests/github-publish.test.mjs`

- [ ] **Step 1: Write a source-level test that requires the workflow to trigger on `source`, use GitHub Pages permissions, build `out/`, and requires the local publisher to validate, guard secrets, and push `HEAD:source`.**
- [ ] **Step 2: Run `node --test tests/github-publish.test.mjs` and verify it fails because the publishing files and source-branch trigger do not exist yet.**

### Task 2: Create the guarded publisher

**Files:**
- Create: `scripts/publish-github.sh`
- Create: `发布到GitHub.command`
- Modify: `.gitignore`
- Test: `tests/github-publish.test.mjs`

- [ ] **Step 1: Implement `scripts/publish-github.sh` with project-root detection, dependency checks, remote validation, remote-source ancestry protection, lint/test/static-build checks, `.env` rejection, optional version message, conditional commit, and `git push github HEAD:source`.**
- [ ] **Step 2: Add a double-clickable `发布到GitHub.command` that opens Terminal, changes to its own directory, and invokes the publisher while preserving its exit status.**
- [ ] **Step 3: Ensure generated folders, local credentials, and environment files remain ignored, then mark both scripts executable.**
- [ ] **Step 4: Run `node --test tests/github-publish.test.mjs` and verify the publisher contract passes.**

### Task 3: Move automated Pages deployment to the clean source branch

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Test: `tests/github-publish.test.mjs`

- [ ] **Step 1: Change the workflow push trigger from `main` to `source`.**
- [ ] **Step 2: Add the existing project test suite before the GitHub Pages static build and keep `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` derived from Pages configuration.**
- [ ] **Step 3: Use a deterministic webpack static export and upload only `out/`, with Pages write and identity-token permissions unchanged.**
- [ ] **Step 4: Run the automation source test and verify all workflow assertions pass.**

### Task 4: Document the one-time switch and normal update flow

**Files:**
- Modify: `DEPLOYMENT.md`
- Modify: `README.md`

- [ ] **Step 1: Document the one-time GitHub Pages setting: Settings → Pages → Source → GitHub Actions.**
- [ ] **Step 2: Document the normal workflow: edit the invitation, double-click `发布到GitHub.command`, enter a short version note, and wait for the Actions run to turn green.**
- [ ] **Step 3: Document safety behavior: no force push, no stored token, failed validation stops publication, and the live URL remains unchanged.**

### Task 5: Validate and publish the automation itself

**Files:**
- Modify: all files above

- [ ] **Step 1: Run `pnpm lint` and expect no errors.**
- [ ] **Step 2: Run `pnpm test` and expect all tests to pass.**
- [ ] **Step 3: Run `GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/birthday-evening NEXT_PUBLIC_SITE_URL=https://zhonghongwei668-png.github.io/birthday-evening pnpm exec next build --webpack` and verify `out/index.html` references `/birthday-evening/` assets.**
- [ ] **Step 4: Commit the automation with message `feat: add one-click GitHub publishing`.**
- [ ] **Step 5: Push the commit to `github/source`; if terminal authentication is unavailable, stop without changing `main` and give the user the single remaining login/push action.**

### Self-review

- [ ] The plan covers safe source upload, automatic site rebuild, a double-clickable nontechnical entry point, tests, documentation, and migration without overwriting the existing remote `main` branch.
- [ ] No task requires force-pushing, saving a GitHub token, or committing generated site output.
- [ ] Every future release either publishes a validated source commit or stops with a clear error before changing GitHub.
