import { DINNER_STYLES } from "@/data/invitation";
import type { InvitationAnswers } from "./types";

export type InvitationShareOutcome =
  | "shared"
  | "copied"
  | "cancelled";

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "待商量";
  return `${year} 年 ${month} 月 ${day} 日`;
}

export function buildInvitationResultText(answers: InvitationAnswers) {
  const style = DINNER_STYLES.find(
    (option) => option.id === answers.dinnerStyle,
  );
  const name = answers.recipientName.trim() || "我";

  return [
    `关于 ${name} 的生日晚餐，我的选择是：`,
    "",
    `日期：${formatDate(answers.date)}`,
    `时间：${answers.time || "待商量"}`,
    `晚餐风格：${(style?.title ?? answers.dinnerStyle) || "待商量"}`,
    `见面方式：${answers.meetingWay || "待商量"}`,
    "",
    `理想的一天：${answers.pauseDay || "轻松就好"}`,
    `晚餐关键词：${answers.dinnerKeyword || "放松"}`,
    `想记住：${answers.memory || "一个开心的小瞬间"}`,
    `最重要的是：${answers.birthdayPriority || "开心"}`,
    "",
    "到时候见。",
  ].join("\n");
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Older in-app browsers expose Clipboard but reject writes; use the
      // selection-based fallback below while the user gesture is still active.
    }
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Unable to copy invitation result.");
}

export async function shareInvitationResult(
  answers: InvitationAnswers,
): Promise<InvitationShareOutcome> {
  const text = buildInvitationResultText(answers);

  if (navigator.share) {
    try {
      await navigator.share({
        title: "A Little Birthday Evening",
        text,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  await copyText(text);
  return "copied";
}
