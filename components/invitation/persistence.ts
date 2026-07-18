import type { InvitationAnswers, RecipientGender } from "./types";

const DRAFT_PREFIX = "birthday-evening:draft:v2";
const answerKeys: ReadonlyArray<keyof InvitationAnswers> = [
  "recipientName",
  "recipientGender",
  "pauseDay",
  "dinnerKeyword",
  "memory",
  "birthdayPriority",
  "date",
  "time",
  "dinnerStyle",
  "meetingWay",
];

export function createInvitationStorageKey(
  recipientName: string,
  recipientGender: Exclude<RecipientGender, "">,
) {
  const identity = encodeURIComponent(
    `${recipientName.trim().toLocaleLowerCase()}|${recipientGender}`,
  );
  return `${DRAFT_PREFIX}:${identity}`;
}

function sanitizeDraft(value: unknown): Partial<InvitationAnswers> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const draft: Partial<InvitationAnswers> = {};
  for (const key of answerKeys) {
    const field = (value as Record<string, unknown>)[key];
    if (typeof field === "string") {
      Object.assign(draft, { [key]: field });
    }
  }
  return draft;
}

export function loadInvitationDraft(storage: Storage, key: string) {
  try {
    const raw = storage.getItem(key);
    return raw ? sanitizeDraft(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

export function saveInvitationDraft(
  storage: Storage,
  key: string,
  answers: InvitationAnswers,
) {
  try {
    storage.setItem(key, JSON.stringify(sanitizeDraft(answers)));
  } catch {
    // A private browser may block storage; the in-memory flow still works.
  }
}
