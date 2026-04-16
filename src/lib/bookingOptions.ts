export const FALLBACK_BOOKING_DATES = [
  "Сегодня",
  "Завтра",
  "Через 2 дня",
  "Через 3 дня",
  "Через 4 дня",
] as const;

export const BOOKING_TIMES = ["11:00", "13:00", "15:00", "17:00", "19:00"] as const;

export const DEFAULT_BOOKING_TIME = BOOKING_TIMES[0];

export type BookingDateOption = {
  id: string;
  label: string;
  compactLabel: string;
  weekdayLabel: string;
  dayLabel: string;
  isWeekend: boolean;
};

const weekdayFormatter = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const weekdayLongFormatter = new Intl.DateTimeFormat("ru-RU", { weekday: "long" });
const dayMonthFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const dayMonthShortFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getBookingDateOptions(baseDate = new Date(), count = 10): BookingDateOption[] {
  const normalizedBaseDate = new Date(baseDate);
  normalizedBaseDate.setHours(12, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const currentDate = new Date(normalizedBaseDate);
    currentDate.setDate(normalizedBaseDate.getDate() + index);

    const weekdayLabel = capitalize(weekdayLongFormatter.format(currentDate));
    const shortWeekday = capitalize(weekdayFormatter.format(currentDate).replace(".", ""));
    const dayLabel = dayMonthShortFormatter.format(currentDate).replace(".", "");
    const longDayLabel = dayMonthFormatter.format(currentDate);

    let label = `${shortWeekday}, ${longDayLabel}`;

    if (index === 0) {
      label = `Сегодня, ${longDayLabel}`;
    } else if (index === 1) {
      label = `Завтра, ${longDayLabel}`;
    }

    return {
      id: formatIsoDate(currentDate),
      label,
      compactLabel: `${shortWeekday}\n${dayLabel}`,
      weekdayLabel,
      dayLabel: longDayLabel,
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    };
  });
}

export function getBookingDates(baseDate = new Date(), count = 5) {
  return getBookingDateOptions(baseDate, count).map((item) => item.label);
}
