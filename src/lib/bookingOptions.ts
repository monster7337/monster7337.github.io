export const FALLBACK_BOOKING_DATES = [
  "Сегодня",
  "Завтра",
  "Через 2 дня",
  "Через 3 дня",
  "Через 4 дня",
] as const;

export const BOOKING_TIMES = ["11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"] as const;

export const DEFAULT_BOOKING_DATE = FALLBACK_BOOKING_DATES[0];
export const DEFAULT_BOOKING_TIME = BOOKING_TIMES[2];

const weekdayFormatter = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getBookingDates(baseDate = new Date()) {
  const normalizedBaseDate = new Date(baseDate);
  normalizedBaseDate.setHours(12, 0, 0, 0);

  return FALLBACK_BOOKING_DATES.map((fallbackLabel, index) => {
    if (index < 2) {
      return fallbackLabel;
    }

    const nextDate = new Date(normalizedBaseDate);
    nextDate.setDate(normalizedBaseDate.getDate() + index);

    const weekday = capitalize(weekdayFormatter.format(nextDate).replace(".", ""));
    const dayAndMonth = dateFormatter.format(nextDate);

    return `${weekday}, ${dayAndMonth}`;
  });
}
