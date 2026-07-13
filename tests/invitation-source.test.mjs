import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("keeps the complete invitation choice contract", async () => {
  const source = await readFile(new URL("data/invitation.ts", root), "utf8");

  for (const prompt of [
    "如果生日当天可以暂停烦恼一天",
    "如果这顿生日晚餐有一个关键词",
    "如果未来回想今年某个瞬间",
    "生日当天",
  ]) {
    assert.match(source, new RegExp(prompt));
  }

  assert.match(
    source,
    /TIME_OPTIONS = \["17:30", "18:00", "18:30", "19:00"\]/,
  );
  assert.equal((source.match(/id: "(?:elegant|cozy|surprise)"/g) ?? []).length, 3);

  for (const meetingWay of [
    "我们约地方见面",
    "如果方便，我可以去接你",
    "各自过去，到地方集合",
    "保留一点神秘感",
  ]) {
    assert.match(source, new RegExp(meetingWay));
  }
});

test("keeps export dynamic, browser-only, and PNG based", async () => {
  const [exportSource, finalSource, stateSource] = await Promise.all([
    readFile(new URL("components/invitation/exportCard.ts", root), "utf8"),
    readFile(new URL("components/invitation/FinalScreen.tsx", root), "utf8"),
    readFile(new URL("components/invitation/useInvitation.ts", root), "utf8"),
  ]);

  assert.match(exportSource, /await import\("html2canvas"\)/);
  assert.match(exportSource, /toBlob/);
  assert.match(exportSource, /birthday-evening-invitation\.png/);
  assert.match(finalSource, /3000/);
  assert.match(finalSource, /重新编辑/);
  assert.match(stateSource, /useState<InvitationAnswers>/);
  assert.match(stateSource, /setAnswers\(\(current\) =>/);
});

test("uses an inline July calendar instead of the native date picker", async () => {
  const source = await readFile(
    new URL("components/invitation/PlanScreen.tsx", root),
    "utf8",
  );

  assert.match(source, /2026 年 7 月/);
  assert.match(source, /length: 31/);
  assert.match(source, /calendar-day/);
  assert.match(source, /type="radio"/);
  assert.doesNotMatch(source, /type="date"/);
  assert.match(source, /onChange\(\"date\", dateValue\)/);
  assert.match(source, /isJulyDate\(answers\.date\)/);
});
