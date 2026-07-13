"use client";

import { useCallback, useState } from "react";
import { INITIAL_ANSWERS } from "@/data/invitation";
import type { InvitationAnswers } from "./types";

export const WELCOME_STEP = 0;
export const FIRST_QUESTION_STEP = 1;
export const LAST_QUESTION_STEP = 4;
export const SCHEDULE_STEP = 5;
export const STYLE_STEP = 6;
export const MEETING_STEP = 7;
export const FINAL_STEP = 8;

export function useInvitation() {
  const [step, setStep] = useState(WELCOME_STEP);
  const [answers, setAnswers] =
    useState<InvitationAnswers>(INITIAL_ANSWERS);

  const updateAnswer = useCallback(
    <K extends keyof InvitationAnswers>(
      key: K,
      value: InvitationAnswers[K],
    ) => {
      setAnswers((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const next = useCallback(() => {
    setStep((current) => Math.min(current + 1, FINAL_STEP));
  }, []);

  const back = useCallback(() => {
    setStep((current) => Math.max(current - 1, WELCOME_STEP));
  }, []);

  const editPlan = useCallback(() => setStep(SCHEDULE_STEP), []);

  return {
    step,
    answers,
    updateAnswer,
    next,
    back,
    editPlan,
  };
}
