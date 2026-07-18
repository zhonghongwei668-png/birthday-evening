"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageFrame } from "./PageFrame";
import type {
  InvitationAnswers,
  RecipientGender,
} from "./types";

interface TemplateSetupPageProps {
  answers: InvitationAnswers;
  onChange: <K extends keyof InvitationAnswers>(
    key: K,
    value: InvitationAnswers[K],
  ) => void;
}

const genderOptions: ReadonlyArray<{
  id: Exclude<RecipientGender, "">;
  pronoun: "她" | "他" | "TA";
  label: string;
}> = [
  { id: "female", pronoun: "她", label: "女生 / 女性朋友" },
  { id: "male", pronoun: "他", label: "男生 / 男性朋友" },
  { id: "neutral", pronoun: "TA", label: "朋友 / 不特别标注" },
];

const reveal = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function TemplateSetupPage({
  answers,
  onChange,
}: TemplateSetupPageProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const canContinue = Boolean(
    answers.recipientName.trim() && answers.recipientGender,
  );

  function updateTemplateAnswer<K extends keyof InvitationAnswers>(
    key: K,
    value: InvitationAnswers[K],
  ) {
    setShareUrl("");
    setCopyState("idle");
    onChange(key, value);
  }

  function createInvitationUrl() {
    if (!canContinue) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("invite", "1");
    url.searchParams.set("to", answers.recipientName.trim());
    url.searchParams.set("gender", answers.recipientGender);
    setCopyState("idle");
    setShareUrl(url.toString());
  }

  async function copyInvitationUrl() {
    if (!shareUrl) return;

    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch {
      try {
        const input = document.createElement("textarea");
        input.value = shareUrl;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("copy failed");
        setCopyState("copied");
      } catch {
        setCopyState("error");
      }
    }
  }

  return (
    <PageFrame className="template-page" labelledBy="template-title">
      <motion.div
        className="template-content"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08, delayChildren: 0.08 }}
      >
        <motion.p className="eyebrow" variants={reveal}>
          MAKE IT YOURS · A PRIVATE NOTE
        </motion.p>

        <motion.div className="template-heading" variants={reveal}>
          <h1 id="template-title" className="template-title serif-title">
            为朋友准备一张
            <br />
            生日晚餐邀请
          </h1>
          <p>
            这里是邀请人的制作页面。
            <br />
            填好对方的称呼，再把专属链接发给对方。
          </p>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          {!shareUrl ? (
            <motion.div
              key="template-form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="template-form">
                <label className="template-field" htmlFor="recipient-name">
                  <span className="field-kicker">NAME / 对方称呼</span>
                  <input
                    id="recipient-name"
                    className="template-input"
                    type="text"
                    value={answers.recipientName}
                    onChange={(event) =>
                      updateTemplateAnswer(
                        "recipientName",
                        event.currentTarget.value.slice(0, 20),
                      )
                    }
                    placeholder="例如：小林"
                    maxLength={20}
                    autoComplete="off"
                  />
                </label>

                <fieldset className="template-gender-fieldset">
                  <legend className="field-kicker">PRONOUN / 称呼方式</legend>
                  <div className="gender-grid">
                    {genderOptions.map((option) => {
                      const selected = answers.recipientGender === option.id;
                      return (
                        <motion.label
                          key={option.id}
                          className={`gender-option ${selected ? "is-selected" : ""}`}
                          whileTap={{ scale: 0.985 }}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name="recipient-gender"
                            value={option.id}
                            checked={selected}
                            onChange={() =>
                              updateTemplateAnswer("recipientGender", option.id)
                            }
                          />
                          <strong>{option.pronoun}</strong>
                          <span>{option.label}</span>
                          <i aria-hidden="true" />
                        </motion.label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <motion.button
                className="primary-button template-button"
                type="button"
                onClick={createInvitationUrl}
                disabled={!canContinue}
                whileTap={{ scale: 0.985 }}
              >
                <span>生成专属邀请链接</span>
                <span aria-hidden="true">↗</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="share-panel"
              className="share-link-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span className="field-kicker">READY TO SEND</span>
              <h2 className="serif-title">专属邀请已经准备好</h2>
              <p>
                把下面的链接发给 {answers.recipientName.trim()}。
                <br />
                对方打开后会直接看到邀请，并开始选择晚餐安排。
              </p>

              <input
                className="share-link-input"
                value={shareUrl}
                readOnly
                aria-label="专属生日邀请链接"
                onFocus={(event) => event.currentTarget.select()}
              />

              <button
                className="primary-button share-copy-button"
                type="button"
                onClick={copyInvitationUrl}
              >
                <span>
                  {copyState === "copied" ? "链接已复制" : "复制并发给对方"}
                </span>
                <span aria-hidden="true">{copyState === "copied" ? "✓" : "↗"}</span>
              </button>

              <div className="share-secondary-actions">
                <a
                  className="text-button share-preview-link"
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  预览对方看到的页面
                </a>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setShareUrl("");
                    setCopyState("idle");
                  }}
                >
                  修改称呼
                </button>
              </div>

              <p className="share-copy-status" role="status" aria-live="polite">
                {copyState === "copied"
                  ? "可以粘贴到微信发给对方了。"
                  : copyState === "error"
                    ? "自动复制没有成功，请长按上方链接复制。"
                    : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p className="template-privacy" variants={reveal}>
          对方不会看到这个制作页面；答案只暂存在对方当前设备，主动分享后你才会收到。
        </motion.p>
      </motion.div>
    </PageFrame>
  );
}
