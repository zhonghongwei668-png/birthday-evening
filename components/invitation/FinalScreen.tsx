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
      ? "Saving this moment…"
      : exportState === "saved"
        ? "Moment saved"
        : "Save this moment";
  const exportStatusText =
    exportState === "error"
      ? "刚刚没有生成成功，再试一次就好。"
      : exportState === "working"
        ? "正在生成邀请卡图片。"
        : exportState === "saved"
          ? "邀请卡已经保存为 PNG。"
          : "";

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
            role="status"
            aria-live="polite"
            aria-busy="true"
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
                aria-label="Save this moment，保存生日晚餐邀请卡图片"
              >
                <span>{exportLabel}</span>
                <span aria-hidden="true">↓</span>
              </button>
              <button className="text-button" type="button" onClick={onEdit}>
                重新编辑
              </button>
              <p className="export-status" role="status" aria-live="polite">
                {exportStatusText}
              </p>
            </motion.div>

            <AnimatePresence>
              {showPostscript ? (
                <motion.div
                  className="hidden-notes"
                  data-html2canvas-ignore="true"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <aside className="postscript">
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
                  </aside>

                  <aside className="personal-note">
                    <p className="personal-note-label">A SMALL NOTE</p>
                    <p>
                      其实准备这个小页面，
                      <br />
                      只是觉得生日一年一次。
                    </p>
                    <p>
                      提前认真安排一点东西，
                      <br />
                      比临时说一句生日快乐更有意思。
                    </p>
                    <small>留一点小惊喜，也记录一个好晚上。</small>
                  </aside>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </PageFrame>
  );
}
