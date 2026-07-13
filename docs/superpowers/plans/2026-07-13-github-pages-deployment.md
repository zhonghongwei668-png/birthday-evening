# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Pages deployment path that publishes the existing invitation as a static site without changing its design or breaking Sites and Vercel builds.

**Architecture:** Keep the current React/Next.js source as the single implementation. Enable `output: "export"`, repository-aware `basePath`, and trailing-slash output only when `GITHUB_PAGES=true`; use a GitHub Actions workflow to build `out/` and deploy it through GitHub Pages. Build absolute metadata URLs from the configured deployment URL so the Open Graph image works on both user Pages and project Pages.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 4, Framer Motion, pnpm, GitHub Actions, GitHub Pages

---

### Task 1: Lock the GitHub Pages deployment contract with a source test

**Files:**
- Modify: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
test("supports a repository-aware GitHub Pages static export", async () => {
  const [workflow, nextConfig, packageSource, layout] = await Promise.all([
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  const packageJson = JSON.parse(packageSource);
  assert.equal(packageJson.scripts["build:github"], "GITHUB_PAGES=true next build");
  assert.match(nextConfig, /output:\s*isGitHubPages \? "export"/);
  assert.match(nextConfig, /basePath/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(layout, /GITHUB_REPOSITORY_OWNER/);
  assert.match(layout, /og\.png/);
});
```

- [ ] **Step 2: Run the source test and verify it fails**

Run: `node --test tests/invitation-source.test.mjs`

Expected: FAIL because `.github/workflows/deploy-pages.yml` and `build:github` do not exist.

- [ ] **Step 3: Commit the completed deployment contract together with Tasks 2–4**

The test is intentionally committed with the implementation after all three build targets pass.

### Task 2: Add a conditional static-export build

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Compute the repository-aware base path**

```ts
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
```

- [ ] **Step 2: Enable export settings only for GitHub Pages**

```ts
const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? githubBasePath : "",
  trailingSlash: isGitHubPages,
  images: { unoptimized: isGitHubPages },
  typescript: { tsconfigPath: "tsconfig.next.json" },
};
```

- [ ] **Step 3: Add the dedicated build script**

```json
"build:github": "GITHUB_PAGES=true next build"
```

### Task 3: Make share metadata work on a GitHub project path

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Derive the default GitHub Pages URL during Actions builds**

```ts
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER?.toLowerCase();
const githubBasePath =
  repositoryName && !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}`
    : "";
const githubPagesUrl =
  repositoryOwner && repositoryName
    ? `https://${repositoryOwner}.github.io${githubBasePath}`
    : undefined;
```

- [ ] **Step 2: Use fully qualified canonical and Open Graph URLs**

```ts
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  githubPagesUrl ??
  (productionHost ? `https://${productionHost}` : sitesUrl)
).replace(/\/$/, "");
const socialImageUrl = `${siteUrl}/og.png`;
```

Set `alternates.canonical`, `openGraph.url`, `openGraph.images[0].url`, and `twitter.images[0]` to those absolute values.

### Task 4: Add the official GitHub Pages workflow and documentation

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Create: `public/.nojekyll`
- Modify: `DEPLOYMENT.md`
- Modify: `README.md`

- [ ] **Step 1: Add the deployment workflow**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
        with:
          version: 11.7.0
      - uses: actions/setup-node@v6
        with:
          node-version: 22.13.0
          cache: pnpm
      - id: pages
        uses: actions/configure-pages@v6
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build:github
        env:
          GITHUB_PAGES: "true"
          NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}
          NEXT_PUBLIC_SITE_URL: ${{ steps.pages.outputs.base_url }}
      - uses: actions/upload-pages-artifact@v5
        with:
          path: out
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Document repository setup**

Document creating or selecting a GitHub repository, setting **Settings → Pages → Source** to **GitHub Actions**, pushing `main`, and opening the Actions-generated Pages URL. Explain that a repository named `<owner>.github.io` uses the domain root while any other repository uses `/<repository-name>/` automatically.

### Task 5: Validate every supported deployment target

**Files:**
- Test: `tests/invitation-source.test.mjs`
- Generated only: `dist/`, `.next/`, `out/`

- [ ] **Step 1: Run source and rendered tests**

Run: `pnpm run test`

Expected: all tests pass and the Sites `dist/server/index.js` build remains valid.

- [ ] **Step 2: Run the Vercel build**

Run: `pnpm run build:vercel`

Expected: Next.js production build succeeds without creating a static `out/` requirement.

- [ ] **Step 3: Run a project Pages build**

Run: `GITHUB_REPOSITORY=mima0000/birthday-evening GITHUB_REPOSITORY_OWNER=mima0000 NEXT_PUBLIC_BASE_PATH=/birthday-evening NEXT_PUBLIC_SITE_URL=https://mima0000.github.io/birthday-evening pnpm run build:github`

Expected: `out/index.html`, `out/og.png`, and `out/birthday-evening/_next/`-compatible asset references are generated with `/birthday-evening` prefixes.

- [ ] **Step 4: Inspect the exported HTML**

Run: `rg -n '/birthday-evening/_next/|https://mima0000.github.io/birthday-evening/og.png' out/index.html`

Expected: both the asset base path and absolute Open Graph image URL are present.

- [ ] **Step 5: Run lint**

Run: `pnpm run lint`

Expected: no ESLint errors.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy-pages.yml next.config.ts package.json app/layout.tsx DEPLOYMENT.md README.md tests/invitation-source.test.mjs docs/superpowers/plans/2026-07-13-github-pages-deployment.md
git commit -m "feat: add GitHub Pages deployment"
```

### Task 6: Connect and publish to the user's GitHub repository

**Files:**
- No source changes required after validation.

- [ ] **Step 1: Obtain the exact GitHub repository URL from the user**

Accept either `https://github.com/<owner>/<repository>` or the matching SSH URL. Do not guess the owner or repository name.

- [ ] **Step 2: Push the validated `main` branch**

Add the repository as a Git remote only after the user provides it and confirms it is the intended public repository. Push `main`, then wait for the Pages workflow.

- [ ] **Step 3: Verify the GitHub Pages URL in WeChat**

Open the exact Pages URL in WeChat. Confirm the welcome screen loads, the July options are tappable, the invitation card generates, and **Save this moment** produces a PNG.
