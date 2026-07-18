"use client";

import { useCallback, useState } from "react";
import { INITIAL_ANSWERS } from "@/data/invitation";
import type { InvitationAnswers, RecipientGender } from "./types";

export const SETUP_STEP = 0;
export const WELCOME_STEP = 1;
export const FIRST_QUESTION_STEP = 2;
export const LAST_QUESTION_STEP = 5;
export const SCHEDULE_STEP = 6;
export const STYLE_STEP = 7;
export const MEETING_STEP = 8;
export const FINAL_STEP = 9;

export function useInvitation() {
  const [step, setStep] = useState(SETUP_STEP);
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
    setStep((current) => Math.max(current - 1, SETUP_STEP));
  }, []);

  const openInvitation = useCallback(
    (
      recipientName: string,
      recipientGender: Exclude<RecipientGender, "">,
      restoredAnswers: Partial<InvitationAnswers> = {},
    ) => {
      setAnswers({
        ...INITIAL_ANSWERS,
        ...restoredAnswers,
        recipientName,
        recipientGender,
      });
      setStep(WELCOME_STEP);
    },
    [],
  );

  const editPlan = useCallback(() => setStep(SCHEDULE_STEP), []);

  return {
    step,
    answers,
    updateAnswer,
    next,
    back,
    openInvitation,
    editPlan,
  };
}
