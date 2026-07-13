# Birthday Invitation Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing birthday dinner flow into a faster, warmer, share-ready digital restaurant invitation for two old classmates.

**Architecture:** Keep the existing nine-screen client-side state machine and its `InvitationAnswers` contract. Refine copy and component names in place, add one lightweight opening screen and one low-priority personal note, then support both the existing vinext build and a standard Next.js Vercel build without adding runtime dependencies.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, html2canvas, Next.js/vinext

---

### Task 1: Copy Contract and Component Names

**Files:**
- Modify: `components/invitation/WelcomePage.tsx`
- Modify: `components/invitation/QuestionPage.tsx`
- Modify: `components/invitation/DinnerPlanPage.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Test: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Add source assertions for the requested copy**

```js
assert.match(welcome, /一份提前准备的小小晚餐计划/);
assert.match(welcome, /距离你的生日还有一点时间。/);
assert.doesNotMatch(allCopy, /陪伴一生|未来一直|喜欢你|命中注定/);
```

- [ ] **Step 2: Rename the exported components without changing state flow**

```ts
export function WelcomePage(props: { onStart: () => void }) {}
export function QuestionPage(props: QuestionPageProps) {}
export function DinnerPlanPage(props: DinnerPlanPageProps) {}
```

Update `BirthdayInvitation.tsx` to render those names while preserving all existing answer bindings, back navigation, and the July calendar.

- [ ] **Step 3: Apply the exact welcome copy**

Use `一份提前准备的小小晚餐计划` and separate `距离你的生日还有一点时间。` from `想提前准备一个轻松的晚上。`. Keep the supplied remaining paragraphs and `开始` button verbatim.

### Task 2: Lightweight Opening and Personal Tone

**Files:**
- Create: `components/invitation/OpeningPage.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Modify: `components/invitation/WelcomePage.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add a short first-open state**

```ts
const [isOpening, setIsOpening] = useState(true);
useEffect(() => {
  const timer = window.setTimeout(() => setIsOpening(false), 560);
  return () => window.clearTimeout(timer);
}, []);
```

Render only a title, a tiny gold mark, and a CSS line reveal. Honor reduced-motion by shortening the delay and removing spatial motion.

- [ ] **Step 2: Add the low-pressure reunion line**

Set the small welcome footer to `好久不见，找个晚上重新见面，聊聊天，吃顿饭。` so the relationship reads clearly as old classmates rather than romance.

- [ ] **Step 3: Keep motion inexpensive**

Use opacity and transform only, avoid media, blur animation, layout animation, and per-frame JavaScript. All primary and selection controls remain at least 48px high.

### Task 3: Invitation Card, Save Action, and Hidden Notes

**Files:**
- Modify: `components/invitation/FinalScreen.tsx`
- Modify: `components/invitation/InvitationCard.tsx`
- Modify: `app/globals.css`
- Test: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Rename the export action**

```ts
const exportLabel = exportState === "working"
  ? "Saving this moment…"
  : exportState === "saved"
    ? "Moment saved"
    : "Save this moment";
```

Keep PNG export and `重新编辑`; do not add an invitation confirmation action.

- [ ] **Step 2: Preserve the three-second postscript**

Keep the existing 3000ms timer and exact P.S. paragraphs. The postscript remains outside the captured card and uses smaller, muted typography.

- [ ] **Step 3: Add the personal preparation note**

Render this as a second quiet note below the P.S.:

```text
其实准备这个小页面，
只是觉得生日一年一次。

提前认真安排一点东西，
比临时说一句生日快乐更有意思。
```

### Task 4: Share Metadata and Vercel Compatibility

**Files:**
- Modify: `app/layout.tsx`
- Create: `vercel.json`
- Create: `DEPLOYMENT.md`
- Modify: `README.md`

- [ ] **Step 1: Add site-specific share metadata**

Set title, description, canonical metadata base, Open Graph, and X card fields. Add `public/og.png` only if a generated share card passes exact-text visual inspection; otherwise omit the image field.

- [ ] **Step 2: Add a Vercel build path**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm exec next build"
}
```

- [ ] **Step 3: Document deployment and mobile checks**

Explain Sites HTTPS behavior, Vercel import/deploy steps, the `RECIPIENT_NAME` customization point, and tests on iPhone Safari/Android Chrome covering the July calendar, scrolling, state retention, final card, P.S. timing, and PNG download.

### Task 5: Validation and Release

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Validate content and feature limits**

Assert the exact subtitle, loading component, `Save this moment`, personal note, four questions, three dinner-plan steps, no audio element, and no prohibited relationship copy.

- [ ] **Step 2: Run both deployment builds**

Run: `pnpm run test && pnpm run lint`

Expected: vinext build plus all Node tests pass.

Run: `pnpm exec next build`

Expected: standard Next.js production build completes for Vercel.

- [ ] **Step 3: Publish the validated source**

Commit the exact tested source, save a new private Sites version, deploy it, and update the downloadable source archive.
