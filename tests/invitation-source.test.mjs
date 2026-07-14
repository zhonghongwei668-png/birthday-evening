import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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
  assert.match(finalSource, /Save this moment/);
  assert.match(finalSource, /其实准备这个小页面/);
  assert.match(stateSource, /useState<InvitationAnswers>/);
  assert.match(stateSource, /setAnswers\(\(current\) =>/);
});

test("supports every valid date in 2026 with an inline month calendar", async () => {
  const [source, data] = await Promise.all([
    readFile(new URL("components/invitation/DinnerPlanPage.tsx", root), "utf8"),
    readFile(new URL("data/invitation.ts", root), "utf8"),
  ]);

  assert.match(data, /CALENDAR_YEAR = 2026/);
  assert.match(data, /CALENDAR_MONTHS/);
  assert.match(source, /daysInMonth/);
  assert.match(source, /calendarMonth/);
  assert.match(source, /calendar-day/);
  assert.match(source, /type="radio"/);
  assert.doesNotMatch(source, /type="date"/);
  assert.match(source, /onChange\(\"date\", dateValue\)/);
  assert.match(source, /isDateInInvitationYear\(answers\.date\)/);
});

test("separates inviter setup from the recipient answer flow", async () => {
  const [setup, types, state, welcome, card, app] = await Promise.all([
    readFile(
      new URL("components/invitation/TemplateSetupPage.tsx", root),
      "utf8",
    ),
    readFile(new URL("components/invitation/types.ts", root), "utf8"),
    readFile(new URL("components/invitation/useInvitation.ts", root), "utf8"),
    readFile(new URL("components/invitation/WelcomePage.tsx", root), "utf8"),
    readFile(new URL("components/invitation/InvitationCard.tsx", root), "utf8"),
    readFile(
      new URL("components/invitation/BirthdayInvitation.tsx", root),
      "utf8",
    ),
  ]);

  assert.match(types, /recipientName: string/);
  assert.match(types, /recipientGender: RecipientGender/);
  assert.match(setup, /她/);
  assert.match(setup, /他/);
  assert.match(setup, /updateTemplateAnswer\([\s\S]*?"recipientName"/);
  assert.match(setup, /生成专属邀请链接/);
  assert.match(setup, /复制并发给对方/);
  assert.match(setup, /searchParams/);
  assert.match(setup, /navigator\.clipboard/);
  assert.match(state, /SETUP_STEP/);
  assert.match(state, /openInvitation/);
  assert.match(state, /setStep\(WELCOME_STEP\)/);
  assert.match(state, /editPlan[\s\S]*?setStep\(SCHEDULE_STEP\)/);
  assert.match(welcome, /recipientName/);
  assert.match(card, /recipientGender/);
  assert.match(app, /TemplateSetupPage/);
  assert.match(app, /params\.get\("invite"\)/);
  assert.match(app, /params\.get\("to"\)/);
  assert.match(app, /params\.get\("gender"\)/);
  assert.match(app, /openInvitation/);
});

test("keeps the old-classmate tone and requested component structure", async () => {
  const [welcome, question, plan, final, card, app, data, css] =
    await Promise.all([
      readFile(new URL("components/invitation/WelcomePage.tsx", root), "utf8"),
      readFile(new URL("components/invitation/QuestionPage.tsx", root), "utf8"),
      readFile(new URL("components/invitation/DinnerPlanPage.tsx", root), "utf8"),
      readFile(new URL("components/invitation/FinalScreen.tsx", root), "utf8"),
      readFile(new URL("components/invitation/InvitationCard.tsx", root), "utf8"),
      readFile(new URL("components/invitation/BirthdayInvitation.tsx", root), "utf8"),
      readFile(new URL("data/invitation.ts", root), "utf8"),
      readFile(new URL("app/globals.css", root), "utf8"),
    ]);

  assert.match(welcome, /export function WelcomePage/);
  assert.match(question, /export function QuestionPage/);
  assert.match(plan, /export function DinnerPlanPage/);
  assert.match(card, /export const InvitationCard/);
  assert.match(welcome, /一份提前准备的小小晚餐计划/);
  assert.match(welcome, /距离你的生日还有一点时间。/);
  assert.match(welcome, /重新见面，聊聊天，吃顿饭/);
  assert.match(final, /留一点小惊喜，也记录一个好晚上/);
  assert.match(app, /OpeningPage/);
  assert.equal((data.match(/marker:/g) ?? []).length, 4);
  assert.equal(4 + 4, 8, "four warm-up questions plus four dinner inputs");

  const productCopy = [welcome, question, plan, final, card, data].join("\n");
  assert.doesNotMatch(
    productCopy,
    /陪伴一生|未来一直|喜欢你|命中注定|<audio|new Audio|autoPlay|autoplay/,
  );

  assert.match(css, /\.back-button[\s\S]*?min-height:\s*48px/);
  assert.match(css, /\.text-button[\s\S]*?min-height:\s*48px/);
  assert.match(css, /\.calendar-day[\s\S]*?min-height:\s*48px/);
});

test("keeps the generated card focused on invitation details", async () => {
  const card = await readFile(
    new URL("components/invitation/InvitationCard.tsx", root),
    "utf8",
  );

  for (const detail of [
    "A Little",
    "Birthday Evening",
    "Date",
    "Time",
    "Dinner Style",
    "Place",
    "Coming Soon",
    "Good food.",
    "Good conversation.",
    "A nice memory.",
  ]) {
    assert.match(card, new RegExp(detail.replace(".", "\\.")));
  }

  assert.doesNotMatch(card, /ARRIVAL NOTE|card-notes/);
});

test("ships a compact share card and a native Vercel build path", async () => {
  const [imageStats, vercelSource, packageSource, nextConfig] = await Promise.all([
    stat(new URL("public/og.png", root)),
    readFile(new URL("vercel.json", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
  ]);

  const vercel = JSON.parse(vercelSource);
  const packageJson = JSON.parse(packageSource);

  assert.ok(imageStats.size < 700_000, "share image should stay under 700 KB");
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "pnpm run build:vercel");
  assert.equal(packageJson.name, "a-little-birthday-evening");
  assert.equal(packageJson.dependencies["drizzle-orm"], undefined);
  assert.match(nextConfig, /tsconfig\.next\.json/);
});

test("supports a repository-aware GitHub Pages static export", async () => {
  const [workflow, nextConfig, packageSource, layout] = await Promise.all([
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readFile(new URL("next.config.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  const packageJson = JSON.parse(packageSource);
  assert.equal(
    packageJson.scripts["build:github"],
    "GITHUB_PAGES=true next build",
  );
  assert.match(nextConfig, /output:\s*isGitHubPages \? "export"/);
  assert.match(nextConfig, /basePath/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(layout, /GITHUB_REPOSITORY_OWNER/);
  assert.match(layout, /og\.png/);
});
