# Editable Birthday Invitation Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing invitation into a reusable in-browser template with editable recipient name, male/female pronoun choice, and a custom inline calendar covering every valid date in 2026.

**Architecture:** Keep the existing client-only React state and add recipient identity to `InvitationAnswers`. Insert an unnumbered template setup screen before the current invitation flow, then make the welcome page and generated card consume that state. Replace the July-only calendar helpers with year-aware month navigation and dynamically generated day grids while preserving the existing static-export and mobile-first architecture.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, html2canvas, Node test runner.

---

### Task 1: Lock the reusable-template contract with tests

**Files:**
- Modify: `tests/invitation-source.test.mjs`

- [ ] **Step 1: Replace the July-only test with a full-2026 calendar test**

```js
test("supports every valid date in 2026 with an inline month calendar", async () => {
  const [source, data] = await Promise.all([
    readFile(new URL("components/invitation/DinnerPlanPage.tsx", root), "utf8"),
    readFile(new URL("data/invitation.ts", root), "utf8"),
  ]);
  assert.match(data, /CALENDAR_YEAR = 2026/);
  assert.match(data, /CALENDAR_MONTHS/);
  assert.match(source, /daysInMonth/);
  assert.match(source, /calendarMonth/);
  assert.match(source, /onChange\("date", dateValue\)/);
  assert.match(source, /isDateInInvitationYear\(answers\.date\)/);
  assert.doesNotMatch(source, /type="date"/);
});
```

- [ ] **Step 2: Add a template-personalization test**

```js
test("lets any visitor personalize the recipient and pronoun", async () => {
  const [setup, types, state, welcome, card, app] = await Promise.all([
    readFile(new URL("components/invitation/TemplateSetupPage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/types.ts", root), "utf8"),
    readFile(new URL("components/invitation/useInvitation.ts", root), "utf8"),
    readFile(new URL("components/invitation/WelcomePage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/InvitationCard.tsx", root), "utf8"),
    readFile(new URL("components/invitation/BirthdayInvitation.tsx", root), "utf8"),
  ]);
  assert.match(types, /recipientName: string/);
  assert.match(types, /recipientGender: RecipientGender/);
  assert.match(setup, /她/);
  assert.match(setup, /他/);
  assert.match(setup, /onChange\("recipientName"/);
  assert.match(state, /SETUP_STEP/);
  assert.match(welcome, /recipientName/);
  assert.match(card, /recipientGender/);
  assert.match(app, /TemplateSetupPage/);
});
```

- [ ] **Step 3: Run the focused tests and confirm they fail**

Run: `node --test tests/invitation-source.test.mjs`

Expected: FAIL because `TemplateSetupPage`, recipient fields, and the year-wide calendar do not exist yet.

### Task 2: Add recipient identity to the invitation state

**Files:**
- Modify: `components/invitation/types.ts`
- Modify: `data/invitation.ts`
- Modify: `components/invitation/useInvitation.ts`

- [ ] **Step 1: Add the reusable recipient fields**

```ts
export type RecipientGender = "female" | "male" | "";

export interface InvitationAnswers {
  recipientName: string;
  recipientGender: RecipientGender;
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

- [ ] **Step 2: Add empty defaults and month labels**

```ts
export const INITIAL_ANSWERS: InvitationAnswers = {
  recipientName: "",
  recipientGender: "",
  pauseDay: "",
  dinnerKeyword: "",
  memory: "",
  birthdayPriority: "",
  date: "",
  time: "",
  dinnerStyle: "",
  meetingWay: "",
};

export const CALENDAR_YEAR = 2026;
export const CALENDAR_MONTHS = Array.from(
  { length: 12 },
  (_, index) => ({ index, label: `${index + 1} 月` }),
);
```

- [ ] **Step 3: Insert an unnumbered setup step and make full editing return to it**

```ts
export const SETUP_STEP = 0;
export const WELCOME_STEP = 1;
export const FIRST_QUESTION_STEP = 2;
export const LAST_QUESTION_STEP = 5;
export const SCHEDULE_STEP = 6;
export const STYLE_STEP = 7;
export const MEETING_STEP = 8;
export const FINAL_STEP = 9;

const editPlan = useCallback(() => setStep(SETUP_STEP), []);
```

### Task 3: Build the template setup screen

**Files:**
- Create: `components/invitation/TemplateSetupPage.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add a focused setup form**

Create a `TemplateSetupPage` that receives `answers`, `onChange`, and `onContinue`. It renders a required recipient-name text field, two 48px gender cards (`female`/`male`), a short privacy note explaining that settings stay in the current browser session, and a disabled-until-valid continue button.

- [ ] **Step 2: Render setup before the existing welcome page**

```tsx
{!isOpening && step === SETUP_STEP ? (
  <TemplateSetupPage
    key="template-setup"
    answers={answers}
    onChange={updateAnswer}
    onContinue={next}
  />
) : null}
```

- [ ] **Step 3: Keep question progress independent of setup**

```ts
const questionIndex = step - FIRST_QUESTION_STEP;
// Pass chapter={questionIndex + 1} to QuestionPage.
```

- [ ] **Step 4: Style the form as an invitation preface**

Add `.template-page`, `.template-content`, `.template-form`, `.template-field`, `.template-input`, `.gender-grid`, and `.gender-option` styles using the existing cream, charcoal, and gold tokens. Inputs and selection cards must be at least 48px tall, fit a 320px viewport, and use visible focus states.

### Task 4: Personalize the welcome page and card

**Files:**
- Modify: `components/invitation/WelcomePage.tsx`
- Modify: `components/invitation/InvitationCard.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`

- [ ] **Step 1: Pass `answers` into both personalized surfaces**

```tsx
<WelcomePage answers={answers} onStart={next} />
<InvitationCard ref={cardRef} answers={answers} />
```

- [ ] **Step 2: Use the visitor-entered name**

```tsx
<p>Hi，{answers.recipientName.trim()}</p>
<span className="card-for">For {answers.recipientName.trim()}</span>
```

- [ ] **Step 3: Reflect the chosen pronoun subtly on the card**

```ts
const recipientLabel = answers.recipientGender === "male" ? "FOR HIM" : "FOR HER";
```

Render `recipientLabel` in the card header and derive the card month/year from the selected date instead of hard-coding July.

### Task 5: Replace the July calendar with a complete 2026 calendar

**Files:**
- Modify: `components/invitation/DinnerPlanPage.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add valid-date helpers**

```ts
function isDateInInvitationYear(value: string) {
  return /^2026-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) &&
    new Date(`${value}T00:00:00`).getFullYear() === CALENDAR_YEAR;
}

function getDateValue(monthIndex: number, day: number) {
  return `${CALENDAR_YEAR}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
```

- [ ] **Step 2: Add local month navigation**

Initialize `calendarMonth` from `answers.date` or July. Render previous/next month buttons and a 12-option month select. Clamp navigation to January–December and generate `daysInMonth` with `new Date(CALENDAR_YEAR, calendarMonth + 1, 0).getDate()`.

- [ ] **Step 3: Generate a correct Monday-first grid**

Compute the first-day offset for the active month and render only the valid number of day options. Changing the month leaves a previously selected date intact until the visitor selects a new date, and the selected-date summary always shows the full Chinese date.

- [ ] **Step 4: Update mobile styles**

Add `.calendar-month-controls`, `.calendar-month-button`, and `.calendar-month-select` styles, each with a 48px touch target and no horizontal overflow.

### Task 6: Validate all builds and exports

**Files:**
- Modify only if validation exposes a real defect.

- [ ] **Step 1: Run source tests**

Run: `node --test tests/invitation-source.test.mjs`

Expected: all source-contract tests pass.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`

Expected: exit code 0.

- [ ] **Step 3: Run the Sites build and rendered tests**

Run: `pnpm test`

Expected: all build and rendered HTML tests pass.

- [ ] **Step 4: Run the GitHub Pages static export**

Run: `GITHUB_REPOSITORY=zhonghongwei668-png/birthday-evening GITHUB_REPOSITORY_OWNER=zhonghongwei668-png NEXT_PUBLIC_SITE_URL=https://zhonghongwei668-png.github.io/birthday-evening pnpm build:github`

Expected: `out/index.html`, `out/_next/`, and `out/.nojekyll` are generated without errors.

### Task 7: Publish the validated update

**Files:**
- No product code changes.

- [ ] **Step 1: Follow the existing Sites hosting handoff for the validated source**

Reuse `.openai/hosting.json`, save the validated version, deploy it, and poll until the deployment succeeds.

- [ ] **Step 2: Prepare the GitHub Pages update package**

Package the exact `out/` contents so the user can replace the existing GitHub Pages files through the same web-upload method. Preserve the empty `.nojekyll` file.
