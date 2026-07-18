"use client";

import { forwardRef } from "react";
import { DINNER_STYLES } from "@/data/invitation";
import type { InvitationAnswers } from "./types";

const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function formatCardDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "TO BE DECIDED";
  return `${months[month - 1]} ${String(day).padStart(2, "0")}, ${year}`;
}

interface InvitationCardProps {
  answers: InvitationAnswers;
}

export const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(
  function InvitationCard({ answers }, ref) {
    const style = DINNER_STYLES.find(
      (option) => option.id === answers.dinnerStyle,
    );
    const recipientCopy =
      answers.recipientGender === "female"
        ? { label: "FOR HER", note: "给她的一份生日晚餐邀请" }
        : answers.recipientGender === "male"
          ? { label: "FOR HIM", note: "给他的一份生日晚餐邀请" }
          : { label: "FOR A FRIEND", note: "给 TA 的一份生日晚餐邀请" };
    const [selectedYear, selectedMonth] = answers.date.split("-");
    const dateLabel =
      selectedYear && selectedMonth
        ? `${months[Number(selectedMonth) - 1]} · ${selectedYear}`
        : "BIRTHDAY · EVENING";

    return (
      <div className="invite-card" ref={ref} id="invitation-card">
        <div className="invite-card-frame">
          <div className="corner corner-tl" aria-hidden="true" />
          <div className="corner corner-tr" aria-hidden="true" />
          <div className="corner corner-bl" aria-hidden="true" />
          <div className="corner corner-br" aria-hidden="true" />

          <header className="card-header">
            <span>{recipientCopy.label}</span>
            <span>{dateLabel}</span>
          </header>

          <div className="card-title-block">
            <p>A Little</p>
            <h2>Birthday Evening</h2>
            <span className="card-for">
              For {answers.recipientName.trim() || "A Friend"}
            </span>
            <small className="card-pronoun">
              {recipientCopy.note}
            </small>
          </div>

          <div className="card-rule" aria-hidden="true">
            <span>✦</span>
          </div>

          <dl className="card-details">
            <div className="card-detail card-detail-wide">
              <dt>Date</dt>
              <dd>{formatCardDate(answers.date)}</dd>
            </div>
            <div className="card-detail card-detail-wide">
              <dt>Time</dt>
              <dd>{answers.time}</dd>
            </div>
            <div className="card-detail card-detail-wide">
              <dt>Dinner Style</dt>
              <dd>{style?.title ?? "A Good Evening"}</dd>
              <small>{style ? `${style.subtitle} · ${style.description}` : ""}</small>
            </div>
            <div className="card-detail card-detail-wide">
              <dt>Meeting</dt>
              <dd>{answers.meetingWay || "TO BE DECIDED"}</dd>
            </div>
            <div className="card-detail card-detail-wide card-evening-wish">
              <dt>Evening Wish</dt>
              <dd>
                {[answers.dinnerKeyword, answers.birthdayPriority]
                  .filter(Boolean)
                  .join(" · ") || "轻松 · 开心"}
              </dd>
              <small>
                {[answers.pauseDay, answers.memory].filter(Boolean).join(" · ")}
              </small>
            </div>
            <div className="card-detail card-detail-wide">
              <dt>Place</dt>
              <dd>Coming Soon</dd>
            </div>
          </dl>

          <footer className="card-footer">
            <p>
              Good food.
              <br />
              Good conversation.
              <br />
              A nice memory.
            </p>
          </footer>
        </div>
      </div>
    );
  },
);
