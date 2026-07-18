"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CALENDAR_WEEKDAYS,
  DINNER_STYLES,
  MEETING_OPTIONS,
  TIME_OPTIONS,
} from "@/data/invitation";
import { ChoiceCard } from "./ChoiceCard";
import {
  buildAvailableMonths,
  isSelectableInvitationDate,
  ROLLING_MONTH_COUNT,
} from "./dateRange";
import { PageFrame } from "./PageFrame";
import { ProgressRail } from "./ProgressRail";
import type {
  DinnerStyleId,
  InvitationAnswers,
  PlanPhase,
} from "./types";

interface DinnerPlanPageProps {
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
function getDateValue(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatChineseDate(value: string) {
  if (!value) return "选一个合适的日子";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const weekday = weekdays[new Date(year, month - 1, day).getDay()];
  return `${year} 年 ${month} 月 ${day} 日 · ${weekday}`;
}

export function DinnerPlanPage({
  phase,
  answers,
  onChange,
  onBack,
  onContinue,
}: DinnerPlanPageProps) {
  const [availableMonths] = useState(() => buildAvailableMonths());
  const selectedMonthValue = answers.date.slice(0, 7);
  const initialCalendarMonth = Math.max(
    0,
    availableMonths.findIndex((month) => month.value === selectedMonthValue),
  );
  const [calendarMonthIndex, setCalendarMonthIndex] =
    useState(initialCalendarMonth);
  const calendarCursor = availableMonths[calendarMonthIndex];
  const calendarYear = calendarCursor.year;
  const calendarMonth = calendarCursor.month;
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOffset =
    (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7;
  const calendarDays = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1,
  );
  const chapter = phase === "schedule" ? 5 : phase === "style" ? 6 : 7;
  const titleId = `plan-${phase}-title`;
  const hintId = `plan-${phase}-hint`;

  const canContinue =
    phase === "schedule"
      ? Boolean(isSelectableInvitationDate(answers.date) && answers.time)
      : phase === "style"
        ? Boolean(answers.dinnerStyle)
        : Boolean(answers.meetingWay);

  return (
    <PageFrame className={`plan-page plan-page-${phase}`} labelledBy={titleId}>
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
              <fieldset className="calendar-card">
                <legend className="sr-only">选择未来十八个月内的日期</legend>
                <div className="calendar-heading">
                  <div>
                    <span className="field-kicker">DATE · ROLLING CALENDAR</span>
                    <strong>未来 {ROLLING_MONTH_COUNT} 个月可选</strong>
                  </div>
                  <span className="calendar-note">选一个晚上</span>
                </div>

                <div className="calendar-month-controls">
                  <button
                    className="calendar-month-button"
                    type="button"
                    onClick={() =>
                      setCalendarMonthIndex((current) =>
                        Math.max(0, current - 1),
                      )
                    }
                    disabled={calendarMonthIndex === 0}
                    aria-label="上一个月"
                  >
                    ←
                  </button>
                  <label className="calendar-month-select-wrap">
                    <span className="sr-only">选择月份</span>
                    <select
                      className="calendar-month-select"
                      value={calendarCursor.value}
                      onChange={(event) => {
                        const nextIndex = availableMonths.findIndex(
                          (month) => month.value === event.currentTarget.value,
                        );
                        if (nextIndex >= 0) setCalendarMonthIndex(nextIndex);
                      }}
                    >
                      {availableMonths.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="calendar-month-button"
                    type="button"
                    onClick={() =>
                      setCalendarMonthIndex((current) =>
                        Math.min(availableMonths.length - 1, current + 1),
                      )
                    }
                    disabled={calendarMonthIndex === availableMonths.length - 1}
                    aria-label="下一个月"
                  >
                    →
                  </button>
                </div>

                <div className="calendar-weekdays" aria-hidden="true">
                  {CALENDAR_WEEKDAYS.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>

                <div className="calendar-grid">
                  {Array.from({ length: firstDayOffset }, (_, index) => (
                    <span
                      className="calendar-empty"
                      key={`empty-${index}`}
                      aria-hidden="true"
                    />
                  ))}
                  {calendarDays.map((day) => {
                    const dateValue = getDateValue(
                      calendarYear,
                      calendarMonth,
                      day,
                    );
                    const selected = answers.date === dateValue;
                    const selectable = isSelectableInvitationDate(dateValue);
                    return (
                      <label
                        key={dateValue}
                        className={`calendar-day ${selected ? "is-selected" : ""} ${!selectable ? "is-disabled" : ""}`}
                      >
                        <input
                          className="sr-only"
                          type="radio"
                          name="date"
                          value={dateValue}
                          checked={selected}
                          disabled={!selectable}
                          onChange={() => onChange("date", dateValue)}
                          aria-label={`${calendarYear} 年 ${calendarMonth + 1} 月 ${day} 日，${weekdays[new Date(calendarYear, calendarMonth, day).getDay()]}`}
                        />
                        <span>{day}</span>
                        <i aria-hidden="true" />
                      </label>
                    );
                  })}
                </div>

                <div className="calendar-picked" aria-live="polite">
                  <span>
                    {answers.date ? "小小计划定在" : "挑一个合适的晚上"}
                  </span>
                  <strong>
                    {answers.date ? formatChineseDate(answers.date) : "—"}
                  </strong>
                </div>
              </fieldset>

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
            aria-describedby={hintId}
          >
            <span>{phase === "meeting" ? "生成邀请卡" : "继续"}</span>
            <span aria-hidden="true">{phase === "meeting" ? "✦" : "→"}</span>
          </button>
          {!canContinue ? (
            <p className="completion-hint" id={hintId}>
              {phase === "schedule"
                ? "选好日期和时间，就可以继续。"
                : "选一个最舒服的答案就好。"}
            </p>
          ) : (
            <p className="completion-hint is-ready" id={hintId}>
              已经记下来了。
            </p>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
