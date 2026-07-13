# Birthday Evening Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, single-page digital birthday invitation that gathers a friend's dinner preferences and generates a downloadable personalized invitation card.

**Architecture:** A client-side React state machine drives five full-screen invitation chapters: welcome, four lightweight questions, dinner planning, style and meeting choices, and the generated card. Static prompt content lives in `data/`, focused UI units live in `components/`, and the final card is exported through a dynamically imported `html2canvas` browser path.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion, html2canvas, vinext/Vite

---

### Task 1: Dependencies and Project Surface

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Delete: `app/_sites-preview/SkeletonPreview.tsx`
- Delete: `app/_sites-preview/preview.css`

- [ ] **Step 1: Add the interaction dependencies**

Add the exact runtime dependencies below and remove `react-loading-skeleton`:

```json
"dependencies": {
  "drizzle-orm": "0.45.2",
  "framer-motion": "^12.23.24",
  "html2canvas": "^1.4.1",
  "next": "16.2.6",
  "react": "19.2.6",
  "react-dom": "19.2.6"
}
```

- [ ] **Step 2: Replace starter metadata and skeleton**

Set the root document to `lang="zh-CN"`, use serif and sans CSS variables, set the title to `A Little Birthday Evening`, and make `app/page.tsx` render `<BirthdayInvitation />`.

- [ ] **Step 3: Refresh the lockfile**

Run: `pnpm install`

Expected: dependencies resolve and the lockfile includes `framer-motion` and `html2canvas`.

### Task 2: Content Model and State Contract

**Files:**
- Create: `data/invitation.ts`
- Create: `components/invitation/types.ts`
- Create: `components/invitation/useInvitation.ts`

- [ ] **Step 1: Define the complete invitation answer model**

```ts
export type DinnerStyleId = "elegant" | "cozy" | "surprise";

export interface InvitationAnswers {
  pauseDay: string;
  dinnerKeyword: string;
  memory: string;
  birthdayPriority: string;
  date: string;
  time: string;
  dinnerStyle: DinnerStyleId | "";
  meetingWay: string;
}
```

- [ ] **Step 2: Centralize all prompts and labels**

Export `questions`, `timeOptions`, `dinnerStyles`, and `meetingOptions` as typed readonly arrays. Each selectable value must include the exact emoji and Chinese wording shown in the product brief.

- [ ] **Step 3: Implement the state helper**

```ts
const [answers, setAnswers] = useState<InvitationAnswers>(initialAnswers);
const updateAnswer = <K extends keyof InvitationAnswers>(key: K, value: InvitationAnswers[K]) =>
  setAnswers((current) => ({ ...current, [key]: value }));
```

Expose `step`, `answers`, `updateAnswer`, `next`, `back`, and `editPlan`; clamp navigation to the valid page range.

### Task 3: Invitation Chapters and Controls

**Files:**
- Create: `components/invitation/BirthdayInvitation.tsx`
- Create: `components/invitation/WelcomeScreen.tsx`
- Create: `components/invitation/QuestionScreen.tsx`
- Create: `components/invitation/PlanScreen.tsx`
- Create: `components/invitation/ChoiceCard.tsx`
- Create: `components/invitation/ProgressRail.tsx`

- [ ] **Step 1: Build the welcome chapter**

Render the supplied English title, Chinese subtitle, `Hi，XXX` body, and a single `开始` action. Add a restrained date-line ornament and page count, avoiding hearts or romantic copy.

- [ ] **Step 2: Build the four-question chapter**

Render one question at a time inside the chapter. Selecting an option writes to the matching answer field, gives tactile pressed feedback, and advances after a short readable pause. Provide a visible back control and progress indicator.

- [ ] **Step 3: Build the dinner-plan chapter**

Use a native accessible date input with a human-readable display layer and a minimum date of today. Render the four required time pills, three dinner-style cards, and four meeting-way choices. Disable `生成邀请卡` until date, time, style, and meeting way are complete, with a plain-language completion hint.

### Task 4: Motion and Editorial Styling

**Files:**
- Modify: `app/globals.css`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Modify: `components/invitation/ChoiceCard.tsx`

- [ ] **Step 1: Define the visual tokens**

```css
:root {
  --paper: #f3efe7;
  --paper-deep: #e8e0d2;
  --ink: #282724;
  --muted: #777168;
  --gold: #a68147;
  --line: rgba(62, 56, 46, 0.14);
}
```

Use a warm paper background, editorial serif titles, compact sans labels, generous vertical whitespace, and one subtle gold accent per viewport.

- [ ] **Step 2: Add page transitions**

Use `AnimatePresence mode="wait"` with opacity and 18px vertical movement. Respect `prefers-reduced-motion` by using `useReducedMotion()` and removing spatial movement when requested.

- [ ] **Step 3: Add tactile selection motion**

Use `whileTap={{ scale: 0.985 }}` and a 160–220ms transition. Keep shadows soft and shallow so the product reads as stationery rather than a survey card stack.

### Task 5: Generated Card and PNG Export

**Files:**
- Create: `components/invitation/InvitationCard.tsx`
- Create: `components/invitation/FinalScreen.tsx`
- Create: `components/invitation/exportCard.ts`

- [ ] **Step 1: Render dynamic invitation fields**

Map `answers.date`, `answers.time`, and `answers.dinnerStyle` to the required Date, Time, Dinner Style, and `Coming Soon` rows. Keep the exportable card self-contained with solid colors and system-safe fonts.

- [ ] **Step 2: Reveal the postscript after three seconds**

```ts
useEffect(() => {
  const timer = window.setTimeout(() => setShowPostscript(true), 3000);
  return () => window.clearTimeout(timer);
}, []);
```

Animate only the on-screen postscript; exclude it from the exported main card so the PNG remains a concise invitation.

- [ ] **Step 3: Export a high-resolution PNG**

```ts
export async function exportInvitationCard(element: HTMLElement) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(element, {
    backgroundColor: "#f7f3eb",
    scale: Math.min(window.devicePixelRatio * 2, 3),
    useCORS: true,
  });
  const link = document.createElement("a");
  link.download = "birthday-evening-invitation.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
```

Add `生成邀请卡图片` and `重新编辑` actions. Show an exporting state and an inline failure message if capture fails.

### Task 6: Automated Checks and Build

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Create: `tests/invitation-data.test.mjs`

- [ ] **Step 1: Assert the finished page content**

Render the production output and assert it contains `A Little Birthday Evening`, `一份关于生日晚餐的小小计划`, and no starter preview marker.

- [ ] **Step 2: Assert the selection data contract**

Verify there are four questions, four times, three styles, and four meeting options, and that style IDs are unique.

- [ ] **Step 3: Run the production build**

Run: `pnpm run build`

Expected: the vinext production bundle completes without TypeScript or client-boundary errors.

- [ ] **Step 4: Run lint and tests**

Run: `pnpm run lint && pnpm run test`

Expected: all checks pass with exit code 0.

- [ ] **Step 5: Manually verify the complete invitation flow**

At a narrow mobile viewport, confirm all four answers persist, the plan button unlocks only when complete, dynamic card values match the choices, the postscript appears after three seconds, editing returns to the plan without clearing answers, and PNG export produces a readable image.

