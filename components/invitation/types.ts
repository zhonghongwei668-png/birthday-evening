export type QuestionKey =
  | "pauseDay"
  | "dinnerKeyword"
  | "memory"
  | "birthdayPriority";

export type DinnerStyleId = "elegant" | "cozy" | "surprise";
export type RecipientGender = "female" | "male" | "neutral" | "";

export interface InvitationAnswers {
  recipientName: string;
  recipientGender: RecipientGender;
  pauseDay: string;
  dinnerKeyword: string;
  memory: string;
  birthdayPriority: string;
  date: string;
  time: string;
  dinnerStyle: DinnerStyleId | "";
  meetingWay: string;
}

export interface QuestionOption {
  icon: string;
  value: string;
  label: string;
}

export interface InvitationQuestion {
  id: QuestionKey;
  marker: string;
  prompt: string;
  options: readonly QuestionOption[];
}

export interface DinnerStyle {
  id: DinnerStyleId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
}

export type PlanPhase = "schedule" | "style" | "meeting";
