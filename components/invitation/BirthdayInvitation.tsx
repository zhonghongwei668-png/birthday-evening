"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { QUESTIONS } from "@/data/invitation";
import { FinalScreen } from "./FinalScreen";
import { PlanScreen } from "./PlanScreen";
import { QuestionScreen } from "./QuestionScreen";
import { WelcomeScreen } from "./WelcomeScreen";
import {
  FIRST_QUESTION_STEP,
  LAST_QUESTION_STEP,
  MEETING_STEP,
  SCHEDULE_STEP,
  STYLE_STEP,
  useInvitation,
  WELCOME_STEP,
} from "./useInvitation";

export function BirthdayInvitation() {
  const { step, answers, updateAnswer, next, back, editPlan } = useInvitation();

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
          {step === WELCOME_STEP ? (
            <WelcomeScreen key="welcome" onStart={next} />
          ) : null}

          {question ? (
            <QuestionScreen
              key={question.id}
              chapter={step}
              question={question}
              value={answers[question.id]}
              onChange={(value) => updateAnswer(question.id, value)}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {step === SCHEDULE_STEP ? (
            <PlanScreen
              key="schedule"
              phase="schedule"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {step === STYLE_STEP ? (
            <PlanScreen
              key="style"
              phase="style"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {step === MEETING_STEP ? (
            <PlanScreen
              key="meeting"
              phase="meeting"
              answers={answers}
              onChange={updateAnswer}
              onBack={back}
              onContinue={next}
            />
          ) : null}

          {step > MEETING_STEP ? (
            <FinalScreen key="final" answers={answers} onEdit={editPlan} />
          ) : null}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
