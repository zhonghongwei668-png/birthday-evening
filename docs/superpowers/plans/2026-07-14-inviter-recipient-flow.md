# Inviter and Recipient Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate invitation creation from invitation answering so the inviter configures the recipient once, shares a personalized URL, and the recipient opens directly on the welcome invitation.

**Architecture:** Keep the app static and backend-free by encoding only the recipient name and gender in URL query parameters. The base URL remains the inviter’s creation page; a valid `?invite=1&to=...&gender=...` URL hydrates recipient state during the opening animation and begins at `WelcomePage`. Dinner answers remain browser-local React state and are never included in the link.

**Tech Stack:** Next.js 16 static export, React 19 client state, TypeScript, Framer Motion, URLSearchParams, Clipboard API with DOM fallback, Node test runner.

---

### Task 1: Specify the two-role flow with tests

**Files:**
- Modify: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Add creator-link assertions**

```js
assert.match(setup, /生成专属邀请链接/);
assert.match(setup, /复制并发给对方/);
assert.match(setup, /URLSearchParams|searchParams/);
assert.match(setup, /navigator\.clipboard/);
```

- [ ] **Step 2: Add recipient-entry assertions**

```js
assert.match(app, /params\.get\("invite"\)/);
assert.match(app, /params\.get\("to"\)/);
assert.match(app, /params\.get\("gender"\)/);
assert.match(app, /openInvitation/);
assert.match(state, /setStep\(WELCOME_STEP\)/);
assert.match(state, /setStep\(SCHEDULE_STEP\)/);
```

- [ ] **Step 3: Run the test and verify failure**

Run: `node --test tests/invitation-source.test.mjs`

Expected: FAIL because the current setup button opens the invitation locally and final editing returns to the creator screen.

### Task 2: Add recipient-mode initialization

**Files:**
- Modify: `components/invitation/useInvitation.ts`
- Modify: `components/invitation/BirthdayInvitation.tsx`

- [ ] **Step 1: Add a typed recipient initializer**

```ts
const openInvitation = useCallback(
  (recipientName: string, recipientGender: Exclude<RecipientGender, "">) => {
    setAnswers((current) => ({
      ...current,
      recipientName,
      recipientGender,
    }));
    setStep(WELCOME_STEP);
  },
  [],
);
```

- [ ] **Step 2: Restore recipient-facing editing**

```ts
const editPlan = useCallback(() => setStep(SCHEDULE_STEP), []);
```

- [ ] **Step 3: Parse the personalized URL during the opening animation**

```ts
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const name = (params.get("to") ?? "").trim().slice(0, 20);
  const gender = params.get("gender");
  if (
    params.get("invite") === "1" &&
    name &&
    (gender === "female" || gender === "male")
  ) {
    openInvitation(name, gender);
  }
}, [openInvitation]);
```

The base URL remains on `SETUP_STEP`; only a valid personalized link enters `WELCOME_STEP`.

### Task 3: Turn setup into an inviter-only link creator

**Files:**
- Modify: `components/invitation/TemplateSetupPage.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Rename the page’s purpose in the copy**

```tsx
<p>这里是邀请人的制作页面。</p>
<p>填好对方的称呼后，生成一个只属于这次生日晚餐的链接。</p>
```

- [ ] **Step 2: Generate a clean recipient link**

```ts
function createInvitationUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("invite", "1");
  url.searchParams.set("to", answers.recipientName.trim());
  url.searchParams.set("gender", answers.recipientGender);
  setShareUrl(url.toString());
}
```

- [ ] **Step 3: Copy with a mobile-safe fallback**

```ts
async function copyInvitationUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl);
  } catch {
    const input = document.createElement("textarea");
    input.value = shareUrl;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  setCopyState("copied");
}
```

- [ ] **Step 4: Render the handoff panel**

```tsx
<div className="share-link-panel">
  <p>专属邀请已经准备好</p>
  <input value={shareUrl} readOnly aria-label="专属生日邀请链接" />
  <button type="button" onClick={copyInvitationUrl}>复制并发给对方</button>
  <a href={shareUrl} target="_blank" rel="noreferrer">预览对方看到的页面</a>
</div>
```

The creator does not advance into the question flow from this page.

- [ ] **Step 5: Add mobile-first share-panel styles**

Style `.share-link-panel`, `.share-link-input`, `.share-copy-button`, and `.share-preview-link` with the existing cream/gold system, minimum 48px actions, readable wrapping, and no horizontal overflow.

### Task 4: Validate and package the corrected GitHub Pages build

**Files:**
- Modify only if validation reveals a real defect.

- [ ] **Step 1: Run source tests**

Run: `node --test tests/invitation-source.test.mjs`

Expected: all tests pass.

- [ ] **Step 2: Run lint and the production test build**

Run: `pnpm lint && pnpm test`

Expected: exit code 0 and all rendered tests pass.

- [ ] **Step 3: Build with the GitHub repository base path**

Run: `GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/birthday-evening NEXT_PUBLIC_SITE_URL=https://zhonghongwei668-png.github.io/birthday-evening pnpm exec next build --webpack`

Expected: every CSS and JavaScript URL in `out/index.html` starts with `/birthday-evening/_next/` and maps to an existing file under `out/_next/`.

- [ ] **Step 4: Create a new, clearly named upload package**

Copy the validated `out/` contents into `outputs/birthday-evening-inviter-recipient-flow/`, preserve a zero-byte `.nojekyll`, and create `outputs/birthday-evening-inviter-recipient-flow.zip`.

