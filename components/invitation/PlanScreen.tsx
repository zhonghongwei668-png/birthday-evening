"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  DINNER_STYLES,
  MEETING_OPTIONS,
  TIME_OPTIONS,
} from "@/data/invitation";
import { ChoiceCard } from "./ChoiceCard";
import { PageFrame } from "./PageFrame";
import { ProgressRail } from "./ProgressRail";
import type {
  DinnerStyleId,
  InvitationAnswers,
  PlanPhase,
} from "./types";

interface PlanScreenProps {
  phase: PlanPhase;
  answers: InvitationAnswers;
  onChange: <K extends keyof InvitationAnswers>(
    key: K,
    value: InvitationAnswers[K],
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function getTodayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatChineseDate(value: string) {
  if (!value) return "选一个合适的日子";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const weekday = weekdays[new Date(year, month - 1, day).getDay()];
  return `${year} 年 ${month} 月 ${day} 日 · ${weekday}`;
}

export function PlanScreen({
  phase,
  answers,
  onChange,
  onBack,
  onContinue,
}: PlanScreenProps) {
  const [minDate] = useState(getTodayInputValue);
  const chapter = phase === "schedule" ? 5 : phase === "style" ? 6 : 7;
  const titleId = `plan-${phase}-title`;

  const canContinue =
    phase === "schedule"
      ? Boolean(answers.date && answers.time)
      : phase === "style"
        ? Boolean(answers.dinnerStyle)
        : Boolean(answers.meetingWay);

  return (
    <PageFrame className="plan-page" labelledBy={titleId}>
      <ProgressRail current={chapter} onBack={onBack} />

      <div className="chapter-content plan-content">
        {phase === "schedule" ? (
          <>
            <div className="question-heading plan-heading">
              <p className="eyebrow">THE DETAILS · 05</p>
              <h2 id={titleId} className="plan-title serif-title">
                Let&apos;s make a plan
              </h2>
              <p className="plan-lead">你比较方便的时间：</p>
            </div>

            <div className="schedule-stack">
              <label className="date-card" htmlFor="birthday-date">
                <span className="field-kicker">DATE</span>
                <strong>{formatChineseDate(answers.date)}</strong>
                <span className="date-action">
                  {answers.date ? "更换日期" : "打开日历"} <span aria-hidden="true">↗</span>
                </span>
                <input
                  id="birthday-date"
                  className="date-input"
                  type="date"
                  min={minDate}
                  value={answers.date}
                  onChange={(event) => onChange("date", event.target.value)}
                  suppressHydrationWarning
                />
              </label>

              <fieldset className="time-fieldset">
                <legend className="field-kicker">TIME</legend>
                <div className="time-grid">
                  {TIME_OPTIONS.map((time) => (
                    <motion.label
                      key={time}
                      className={`time-option ${answers.time === time ? "is-selected" : ""}`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="time"
                        value={time}
                        checked={answers.time === time}
                        onChange={() => onChange("time", time)}
                      />
                      <span>{time}</span>
                      <i aria-hidden="true" />
                    </motion.label>
                  ))}
                </div>
              </fieldset>
            </div>
          </>
        ) : null}

        {phase === "style" ? (
          <>
            <div className="question-heading plan-heading">
              <p className="eyebrow">THE TABLE · 06</p>
              <h2 id={titleId} className="plan-title style-page-title serif-title">
                Choose Your
                <br />
                Birthday Dinner Style
              </h2>
              <p className="plan-lead">今晚更接近哪一种感觉？</p>
            </div>

            <fieldset className="style-fieldset">
              <legend className="sr-only">选择生日晚餐风格</legend>
              <div className="style-list">
                {DINNER_STYLES.map((style, index) => {
                  const selected = answers.dinnerStyle === style.id;
                  return (
                    <motion.label
                      key={style.id}
                      className={`style-card ${selected ? "is-selected" : ""}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.07 }}
                      whileTap={{ scale: 0.988 }}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="dinner-style"
                        value={style.id}
                        checked={selected}
                        onChange={() =>
                          onChange("dinnerStyle", style.id as DinnerStyleId)
                        }
                      />
                      <span className="style-index">{style.index}</span>
                      <span className="style-copy">
                        <strong>{style.title}</strong>
                        <span>
                          {style.subtitle} · {style.description}
                        </span>
                      </span>
                      <span className="choice-check" aria-hidden="true">
                        <span />
                      </span>
                    </motion.label>
                  );
                })}
              </div>
            </fieldset>
          </>
        ) : null}

        {phase === "meeting" ? (
          <>
            <div className="question-heading plan-heading">
              <p className="eyebrow">ONE LAST DETAIL · 07</p>
              <h2 id={titleId} className="plan-title serif-title">
                How shall we meet?
              </h2>
              <p className="plan-lead">当天更喜欢：</p>
            </div>

            <fieldset className="choices-fieldset">
              <legend className="sr-only">选择当天见面方式</legend>
              <div className="choices-list meeting-list">
                {MEETING_OPTIONS.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.055 }}
                  >
                    <ChoiceCard
                      name="meeting-way"
                      value={option.value}
                      icon={option.icon}
                      label={option.label}
                      selected={answers.meetingWay === option.value}
                      onSelect={(value) => onChange("meetingWay", value)}
                    />
                  </motion.div>
                ))}
              </div>
            </fieldset>
          </>
        ) : null}

        <div className="plan-action-wrap">
          <button
            className="primary-button continue-button"
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
          >
            <span>{phase === "meeting" ? "生成邀请卡" : "继续"}</span>
            <span aria-hidden="true">{phase === "meeting" ? "✦" : "→"}</span>
          </button>
          {!canContinue ? (
            <p className="completion-hint">
              {phase === "schedule"
                ? "选好日期和时间，就可以继续。"
                : "选一个最舒服的答案就好。"}
            </p>
          ) : (
            <p className="completion-hint is-ready">已经记下来了。</p>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
