"use client";

import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/data/invitation";
import { FinalScreen } from "./FinalScreen";
import { OpeningPage } from "./OpeningPage";
import { DinnerPlanPage } from "./DinnerPlanPage";
import { QuestionPage } from "./QuestionPage";
import { TemplateSetupPage } from "./TemplateSetupPage";
import { WelcomePage } from "./WelcomePage";
import {
  createInvitationStorageKey,
  loadInvitationDraft,
  saveInvitationDraft,
} from "./persistence";
import {
  FIRST_QUESTION_STEP,
  LAST_QUESTION_STEP,
  MEETING_STEP,
  SCHEDULE_STEP,
  SETUP_STEP,
  STYLE_STEP,
  useInvitation,
  WELCOME_STEP,
} from "./useInvitation";

export function BirthdayInvitation() {
  const {
    step,
    answers,
    updateAnswer,
    next,
    back,
    openInvitation,
    editPlan,
  } = useInvitation();
  const reduceMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(true);
  const storageKeyRef = useRef<string | null>(null);
  const skipInitialDraftSaveRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipientName = (params.get("to") ?? "").trim().slice(0, 20);
    const recipientGender = params.get("gender");

    if (
      params.get("invite") === "1" &&
      recipientName &&
      (recipientGender === "female" ||
        recipientGender === "male" ||
        recipientGender === "neutral")
    ) {
      const key = createInvitationStorageKey(recipientName, recipientGender);
      let restoredAnswers = {};
      try {
        restoredAnswers = loadInvitationDraft(window.localStorage, key);
      } catch {
        // The invitation remains usable when device storage is unavailable.
      }
      storageKeyRef.current = key;
      skipInitialDraftSaveRef.current = true;
      openInvitation(recipientName, recipientGender, restoredAnswers);
    }
  }, [openInvitation]);

  useEffect(() => {
    const storageKey = storageKeyRef.current;
    if (!storageKey) return;
    if (skipInitialDraftSaveRef.current) {
      skipInitialDraftSaveRef.current = false;
      return;
    }
    try {
      saveInvitationDraft(window.localStorage, storageKey, answers);
    } catch {
      // Keep the live React state when device storage is unavailable.
    }
  }, [answers]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsOpening(false),
      reduceMotion ? 80 : 620,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const questionIndex = step - FIRST_QUESTION_STEP;
  const question =
    step >= FIRST_QUESTION_STEP && step <= LAST_QUESTION_STEP
      ? QUESTIONS[questionIndex]
      : null;

  return (
    <MotionConfig reducedMotion="user">
      <main className="invitation-app">
        <div className="paper-grain" aria-hidden="true" />
        <div className="ambient-light ambient-light-one" aria-hidden="true" />
        <div className="ambient-light ambient-light-two" aria-hidden="true" />

        <AnimatePresence mode="wait" initial={false}>
          {isOpening ? <OpeningPage key="opening" /> : null}

          {!isOpening && step === SETUP_STEP ? (
            <TemplateSetupPage
              key="template-setup"
              answers={answers}
              onChange={updateAnswer}
            />
          ) : null}

          {!isOpening && step === WELCOME_STEP ? (
            <WelcomePage key="welcome" answers={answers} onStart={next} />
          ) : null}

          {!isOpening && question ? (
            <QuestionPage
              key={question.id}
              chapter={questionIndex + 1}
              question={question}
              value={answers[question.id]}
              onChange={(value) => updateAnswer(question.id, value)}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {!isOpening && step === SCHEDULE_STEP ? (
            <DinnerPlanPage
              key="schedule"
              phase="schedule"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {!isOpening && step === STYLE_STEP ? (
            <DinnerPlanPage
              key="style"
              phase="style"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {!isOpening && step === MEETING_STEP ? (
            <DinnerPlanPage
              key="meeting"
              phase="meeting"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {!isOpening && step > MEETING_STEP ? (
            <FinalScreen key="final" answers={answers} onEdit={editPlan} />
          ) : null}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
