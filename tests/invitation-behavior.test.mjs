import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("returns the completed plan to the inviter with a mobile share fallback", async () => {
  const [summary, final] = await Promise.all([
    readFile(new URL("components/invitation/resultSummary.ts", root), "utf8"),
    readFile(new URL("components/invitation/FinalScreen.tsx", root), "utf8"),
  ]);

  assert.match(summary, /buildInvitationResultText/);
  assert.match(summary, /navigator\.share/);
  assert.match(summary, /navigator\.clipboard\.writeText/);
  for (const answer of [
    "answers.date",
    "answers.time",
    "answers.dinnerStyle",
    "answers.meetingWay",
    "answers.pauseDay",
    "answers.dinnerKeyword",
    "answers.memory",
    "answers.birthdayPriority",
  ]) {
    assert.match(summary, new RegExp(answer.replace(".", "\\.")));
  }
  assert.match(final, /把我的选择发给邀请人/);
  assert.match(final, /shareInvitationResult/);
});

test("restores a sanitized device-local draft after refresh", async () => {
  const [persistence, app, state] = await Promise.all([
    readFile(new URL("components/invitation/persistence.ts", root), "utf8"),
    readFile(new URL("components/invitation/BirthdayInvitation.tsx", root), "utf8"),
    readFile(new URL("components/invitation/useInvitation.ts", root), "utf8"),
  ]);

  assert.match(persistence, /birthday-evening:draft:v2/);
  assert.match(persistence, /createInvitationStorageKey/);
  assert.match(persistence, /loadInvitationDraft/);
  assert.match(persistence, /saveInvitationDraft/);
  assert.match(persistence, /JSON\.parse/);
  assert.match(persistence, /typeof field === "string"/);
  assert.match(app, /window\.localStorage/);
  assert.match(app, /loadInvitationDraft/);
  assert.match(app, /saveInvitationDraft/);
  assert.match(state, /restoredAnswers/);
});

test("uses every warm-up and planning answer in the generated result", async () => {
  const card = await readFile(
    new URL("components/invitation/InvitationCard.tsx", root),
    "utf8",
  );

  for (const answer of [
    "answers.pauseDay",
    "answers.dinnerKeyword",
    "answers.memory",
    "answers.birthdayPriority",
    "answers.meetingWay",
  ]) {
    assert.match(card, new RegExp(answer.replace(".", "\\.")));
  }
  assert.match(card, /Evening Wish/);
  assert.match(card, /Meeting/);
});

test("offers a rolling 18-month date range and disables past dates", async () => {
  const [range, plan, setup, welcome, card, data] = await Promise.all([
    readFile(new URL("components/invitation/dateRange.ts", root), "utf8"),
    readFile(new URL("components/invitation/DinnerPlanPage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/TemplateSetupPage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/WelcomePage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/InvitationCard.tsx", root), "utf8"),
    readFile(new URL("data/invitation.ts", root), "utf8"),
  ]);

  assert.match(range, /ROLLING_MONTH_COUNT = 18/);
  assert.match(range, /buildAvailableMonths/);
  assert.match(range, /isSelectableInvitationDate/);
  assert.match(range, /startOfToday/);
  assert.match(range, /lastAvailableDay/);
  assert.match(plan, /disabled=\{!selectable\}/);
  assert.match(plan, /availableMonths/);
  assert.doesNotMatch([plan, setup, welcome, card, data].join("\n"), /CALENDAR_YEAR|2026/);
});

test("supports a neutral form of address without breaking existing links", async () => {
  const [types, setup, app, card] = await Promise.all([
    readFile(new URL("components/invitation/types.ts", root), "utf8"),
    readFile(new URL("components/invitation/TemplateSetupPage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/BirthdayInvitation.tsx", root), "utf8"),
    readFile(new URL("components/invitation/InvitationCard.tsx", root), "utf8"),
  ]);

  assert.match(types, /"neutral"/);
  assert.match(setup, /pronoun: "TA"/);
  assert.match(app, /recipientGender === "neutral"/);
  assert.match(card, /FOR A FRIEND/);
  assert.match(card, /给 TA 的一份生日晚餐邀请/);
});
