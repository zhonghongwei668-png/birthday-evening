export const ROLLING_MONTH_COUNT = 18;

export interface AvailableMonth {
  year: number;
  month: number;
  value: string;
  label: string;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function startOfToday(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function lastAvailableDay(now = new Date()) {
  return new Date(
    now.getFullYear(),
    now.getMonth() + ROLLING_MONTH_COUNT,
    0,
    23,
    59,
    59,
    999,
  );
}

export function buildAvailableMonths(now = new Date()): AvailableMonth[] {
  return Array.from({ length: ROLLING_MONTH_COUNT }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      year,
      month,
      value: `${year}-${pad(month + 1)}`,
      label: `${year} 年 ${month + 1} 月`,
    };
  });
}

export function isSelectableInvitationDate(value: string, now = new Date()) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.exec(
    value,
  );
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return (
    isRealDate &&
    date >= startOfToday(now) &&
    date <= lastAvailableDay(now)
  );
}
