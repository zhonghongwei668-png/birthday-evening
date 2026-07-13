"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { exportInvitationCard } from "./exportCard";
import { InvitationCard } from "./InvitationCard";
import { PageFrame } from "./PageFrame";
import type { InvitationAnswers } from "./types";

interface FinalScreenProps {
  answers: InvitationAnswers;
  onEdit: () => void;
}

type ExportState = "idle" | "working" | "saved" | "error";

export function FinalScreen({ answers, onEdit }: FinalScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [showCard, setShowCard] = useState(Boolean(reduceMotion));
  const [showPostscript, setShowPostscript] = useState(false);
  const [exportState, setExportState] = useState<ExportState>("idle");

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowCard(true),
      reduceMotion ? 0 : 900,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!showCard) return;
    const timer = window.setTimeout(
      () => setShowPostscript(true),
      reduceMotion ? 120 : 3000,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion, showCard]);

  async function handleExport() {
    if (!cardRef.current || exportState === "working") return;
    setExportState("working");
    try {
      await exportInvitationCard(cardRef.current);
      setExportState("saved");
    } catch {
      setExportState("error");
    }
  }

  const exportLabel =
    exportState === "working"
      ? "正在生成…"
      : exportState === "saved"
        ? "图片已保存"
        : "生成邀请卡图片";

  return (
    <PageFrame className="final-page" labelledBy="final-title">
      <header className="final-header">
        <p className="eyebrow">YOUR EVENING, ON PAPER · 08 / 08</p>
        <h1 id="final-title" className="sr-only">
          已生成生日晚餐邀请卡
        </h1>
      </header>

      <AnimatePresence mode="wait">
        {!showCard ? (
          <motion.div
            key="generating"
            className="generating-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="generating-mark" aria-hidden="true">✦</span>
            <p>正在把今晚写成一张邀请…</p>
            <span className="generating-line" aria-hidden="true" />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="card-stage"
            initial={{ opacity: 0, y: 22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <InvitationCard ref={cardRef} answers={answers} />

            <motion.div
              className="final-actions"
              data-html2canvas-ignore="true"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
            >
              <button
                className="primary-button export-button"
                type="button"
                onClick={handleExport}
                disabled={exportState === "working"}
              >
                <span>{exportLabel}</span>
                <span aria-hidden="true">↓</span>
              </button>
              <button className="text-button" type="button" onClick={onEdit}>
                重新编辑
              </button>
              <p className="export-status" role="status" aria-live="polite">
                {exportState === "error"
                  ? "刚刚没有生成成功，再试一次就好。"
                  : exportState === "saved"
                    ? "邀请卡已经保存为 PNG。"
                    : ""}
              </p>
            </motion.div>

            <AnimatePresence>
              {showPostscript ? (
                <motion.aside
                  className="postscript"
                  data-html2canvas-ignore="true"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="postscript-line" aria-hidden="true" />
                  <p className="postscript-label">P.S.</p>
                  <p>
                    成年之后，
                    <br />
                    生日好像越来越简单了。
                  </p>
                  <p>所以想偷偷增加一点仪式感。</p>
                  <p>
                    希望这个提前准备的小晚上，
                    <br />
                    能成为最近生活里一个轻松的小片段。
                  </p>
                </motion.aside>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </PageFrame>
  );
}
