# Close Invitation Planning Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the invitation from a one-way questionnaire into a durable, shareable dinner-planning loop while keeping it private, static, mobile-first, and backend-free.

**Architecture:** Keep the existing React state as the live source of truth, save a sanitized draft in device-local storage under a per-invitation key, and expose pure helpers for storage, rolling date ranges, and result summaries. The final screen will use the Web Share API when available and a clipboard fallback otherwise. The GitHub Pages workflow remains the production delivery path.

**Tech Stack:** React 19, TypeScript, Next.js static export, Framer Motion, browser localStorage/Web Share/Clipboard APIs, Node test runner, GitHub Pages

---

### Task 1: Share completed choices back to the inviter

**Files:**
- Create: `components/invitation/resultSummary.ts`
- Modify: `components/invitation/FinalScreen.tsx`
- Modify: `app/globals.css`
- Test: `tests/invitation-behavior.test.mjs`

- [ ] **Step 1: Add a failing source test requiring `buildInvitationResultText`, `navigator.share`, clipboard fallback, the label “把我的选择发给邀请人”, and date/time/style/meeting fields in the shared text.**
- [ ] **Step 2: Run `node --test tests/invitation-behavior.test.mjs` and verify it fails because the summary module and share action do not exist.**
- [ ] **Step 3: Implement a pure text builder that returns a friendly Chinese message containing the recipient name, date, time, dinner style, meeting way, and four warm-up answers.**
- [ ] **Step 4: Implement `shareInvitationResult` using `navigator.share({ title, text })`, falling back to `navigator.clipboard.writeText(text)` and then a hidden textarea copy. Treat `AbortError` as cancellation rather than a product failure.**
- [ ] **Step 5: Add the final-page primary share button, retain PNG saving as a secondary action, and show accessible states for sharing, copied, cancelled, and failed.**
- [ ] **Step 6: Run the behavior test and verify it passes.**

### Task 2: Preserve recipient answers across refreshes

**Files:**
- Create: `components/invitation/persistence.ts`
- Modify: `components/invitation/useInvitation.ts`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Test: `tests/invitation-behavior.test.mjs`

- [ ] **Step 1: Add failing assertions for a versioned per-invitation storage key, sanitized JSON restore, localStorage read after parsing a valid invite URL, and localStorage write only after hydration.**
- [ ] **Step 2: Run the focused test and verify the persistence assertions fail.**
- [ ] **Step 3: Implement `createInvitationStorageKey`, `loadInvitationDraft`, and `saveInvitationDraft`; accept only known string fields and always let URL identity override stored identity.**
- [ ] **Step 4: Extend `openInvitation` to restore a partial draft over `INITIAL_ANSWERS`, then override recipient name and pronoun from the invitation URL.**
- [ ] **Step 5: In `BirthdayInvitation`, restore after validating the invitation URL, set a storage key, and save later answer changes only when the key exists.**
- [ ] **Step 6: Run the focused test and verify it passes.**

### Task 3: Make warm-up answers change the generated result

**Files:**
- Modify: `components/invitation/resultSummary.ts`
- Modify: `components/invitation/InvitationCard.tsx`
- Modify: `app/globals.css`
- Test: `tests/invitation-behavior.test.mjs`

- [ ] **Step 1: Add failing assertions that the card consumes `pauseDay`, `dinnerKeyword`, `memory`, and `birthdayPriority`, and also renders `meetingWay`.**
- [ ] **Step 2: Run the focused test and verify the card assertions fail.**
- [ ] **Step 3: Add a compact “Evening Wish” block to the invitation card with mood/priority as the main line and pause-day/memory choices as supporting text.**
- [ ] **Step 4: Add the selected meeting way to the card so every planning answer affects the generated result.**
- [ ] **Step 5: Run the focused test and verify it passes.**

### Task 4: Replace the expiring 2026 calendar with a rolling range

**Files:**
- Create: `components/invitation/dateRange.ts`
- Modify: `components/invitation/DinnerPlanPage.tsx`
- Modify: `components/invitation/InvitationCard.tsx`
- Modify: `components/invitation/TemplateSetupPage.tsx`
- Modify: `components/invitation/WelcomePage.tsx`
- Modify: `data/invitation.ts`
- Test: `tests/invitation-behavior.test.mjs`

- [ ] **Step 1: Add failing tests for 18 rolling months, disabling dates before today, accepting the final day in range, rejecting dates beyond the range, and removing fixed “2026” presentation copy.**
- [ ] **Step 2: Run the focused test and verify it fails on the fixed-year implementation.**
- [ ] **Step 3: Implement pure helpers that build 18 `{ year, month, value, label }` entries from the current local month and validate ISO dates between today and the last day of the final available month.**
- [ ] **Step 4: Refactor the calendar cursor to use the combined year-month value, render the rolling month list, disable past days, and keep the selected date when navigating back.**
- [ ] **Step 5: Replace fixed-year labels with durable wording such as “未来 18 个月可选” and derive card year labels from the selected date.**
- [ ] **Step 6: Run the focused test and verify it passes.**

### Task 5: Add a neutral recipient form of address

**Files:**
- Modify: `components/invitation/types.ts`
- Modify: `components/invitation/TemplateSetupPage.tsx`
- Modify: `components/invitation/BirthdayInvitation.tsx`
- Modify: `components/invitation/InvitationCard.tsx`
- Test: `tests/invitation-behavior.test.mjs`

- [ ] **Step 1: Add failing assertions for the `neutral` value, the visible `TA` option, neutral URL parsing, and `FOR A FRIEND` card rendering.**
- [ ] **Step 2: Run the focused test and verify neutral addressing is missing.**
- [ ] **Step 3: Extend the recipient type and setup options with `neutral`, keep old female/male links compatible, and accept neutral links in the recipient route.**
- [ ] **Step 4: Render `FOR A FRIEND` and “给 TA 的一份生日晚餐邀请” without defaulting unknown values to feminine copy.**
- [ ] **Step 5: Run the focused test and verify it passes.**

### Task 6: Validate and publish

**Files:**
- Modify: `README.md`
- Modify: `DEPLOYMENT.md`
- Modify: all implementation files above

- [ ] **Step 1: Update documentation with device-local draft recovery, result sharing, rolling dates, and neutral addressing.**
- [ ] **Step 2: Run `pnpm lint` and expect no errors.**
- [ ] **Step 3: Run `pnpm test` and expect all tests to pass.**
- [ ] **Step 4: Run the GitHub Pages static build with `/birthday-evening` as the base path and verify generated asset URLs.**
- [ ] **Step 5: Commit the exact validated source and push it to `github/source`.**
- [ ] **Step 6: Wait for the GitHub Pages workflow to succeed and verify the live page and representative static assets return HTTP 200.**

### Self-review

- [ ] Every collected answer now affects either the visible card or the result message.
- [ ] Refresh recovery remains device-local and does not introduce server-side storage or identity.
- [ ] Existing female/male links remain valid while neutral links become available.
- [ ] The date picker no longer expires at the end of 2026 and cannot select past dates.
- [ ] The core recipient path ends with an explicit way to return choices to the inviter.
