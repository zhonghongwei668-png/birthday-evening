"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { InvitationQuestion } from "./types";
import { ChoiceCard } from "./ChoiceCard";
import { PageFrame } from "./PageFrame";
import { ProgressRail } from "./ProgressRail";

interface QuestionPageProps {
  chapter: number;
  question: InvitationQuestion;
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function QuestionPage({
  chapter,
  question,
  value,
  onChange,
  onBack,
  onContinue,
}: QuestionPageProps) {
  const titleId = `question-${question.id}`;

  return (
    <PageFrame className="question-page" labelledBy={titleId}>
      <ProgressRail current={chapter} onBack={onBack} />

      <div className="chapter-content">
        <div className="question-heading">
          <p className="eyebrow">
            {question.marker} · {String(chapter).padStart(2, "0")}
          </p>
          <h2 id={titleId} className="question-title">
            {question.prompt}
          </h2>
          <p className="question-note">凭第一感觉就好。</p>
        </div>

        <fieldset className="choices-fieldset">
          <legend className="sr-only">{question.prompt}</legend>
          <div className="choices-list">
            {question.options.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12 + index * 0.055,
                  duration: 0.36,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ChoiceCard
                  name={question.id}
                  value={option.value}
                  icon={option.icon}
                  label={option.label}
                  selected={value === option.value}
                  onSelect={onChange}
                />
              </motion.div>
            ))}
          </div>
        </fieldset>

        <AnimatePresence initial={false}>
          {value ? (
            <motion.button
              className="primary-button continue-button"
              type="button"
              onClick={onContinue}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.985 }}
            >
              <span>继续</span>
              <span aria-hidden="true">→</span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </PageFrame>
  );
}
