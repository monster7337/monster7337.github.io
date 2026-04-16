"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Copy,
  Info,
  Minus,
  Phone,
  Plus,
  Send,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BOOKING_CONTACTS, BOOKING_EXTRAS, BOOKING_TICKETS, BookingTicketId, formatCurrency } from "@/lib/bookingCatalog";
import { BOOKING_TIMES, DEFAULT_BOOKING_TIME, getBookingDateOptions } from "@/lib/bookingOptions";

const bookingSteps = ["Билеты", "Дата", "Время", "Услуги", "Контакты", "Подтверждение"];
const bookingStepNotes = [
  "Соберите состав визита",
  "Выберите день посещения",
  "Только нечетные слоты по 1 часу",
  "Добавьте кормление и угощения",
  "Оставьте имя и телефон",
  "Проверьте детали перед отправкой",
];

type BookingPlannerProps = {
  initialTicketId?: BookingTicketId;
  initialDateId?: string;
  initialTime?: string;
};

type ContactValues = {
  name: string;
  phone: string;
  comment: string;
};

function getTicketWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "билет";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return "билета";
  return "билетов";
}

export default function BookingPlanner({ initialTicketId, initialDateId, initialTime }: BookingPlannerProps) {
  const dateOptions = useMemo(() => getBookingDateOptions(), []);
  const initialResolvedDateId = dateOptions.some((item) => item.id === initialDateId) ? initialDateId : dateOptions[0]?.id ?? "";
  const initialResolvedTime =
    initialTime && BOOKING_TIMES.includes(initialTime as (typeof BOOKING_TIMES)[number]) ? initialTime : DEFAULT_BOOKING_TIME;

  const [step, setStep] = useState(0);
  const [selectedDateId, setSelectedDateId] = useState(initialResolvedDateId);
  const [selectedTime, setSelectedTime] = useState(initialResolvedTime);
  const [selectedRateQuantities, setSelectedRateQuantities] = useState<Partial<Record<BookingTicketId, number>>>(() => {
    if (!initialTicketId) return {};
    return { [initialTicketId]: initialTicketId === "family" ? 3 : 1 };
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [activeInfoRateId, setActiveInfoRateId] = useState<BookingTicketId | null>(initialTicketId ?? null);
  const [contactValues, setContactValues] = useState<ContactValues>({ name: "", phone: "", comment: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [stepError, setStepError] = useState("");
  const [submitTone, setSubmitTone] = useState<"idle" | "success" | "warning">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedDate = dateOptions.find((item) => item.id === selectedDateId) ?? null;
  const happyHourSelected = (selectedRateQuantities["happy-hour"] ?? 0) > 0;
  const familyCount = selectedRateQuantities.family ?? 0;

  const timeSlots = BOOKING_TIMES.map((time) => {
    const disabled = happyHourSelected && (time !== "11:00" || selectedDate?.isWeekend);

    return {
      time,
      disabled,
      status: disabled ? (selectedDate?.isWeekend ? "Только будни" : "Недоступно") : "Свободно",
    };
  });

  const selectedTickets = BOOKING_TICKETS.map((ticket) => ({
    ...ticket,
    quantity: selectedRateQuantities[ticket.id] ?? 0,
  })).filter((ticket) => ticket.quantity > 0);

  const selectedServices = BOOKING_EXTRAS.filter((service) => selectedServiceIds.includes(service.id));

  const ticketsTotal = selectedTickets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const servicesTotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  const totalTicketsCount = selectedTickets.reduce((sum, item) => sum + item.quantity, 0);
  const total = ticketsTotal + servicesTotal;
  const selectedDateLabel = selectedDate ? selectedDate.label : "Выберите дату";
  const selectedTimeLabel = selectedTime || "Выберите время";
  const mobileSelectionNote =
    totalTicketsCount > 0
      ? `${totalTicketsCount} ${getTicketWord(totalTicketsCount)} · ${selectedDate ? selectedDate.dayLabel : "без даты"}`
      : "Соберите визит по шагам";

  const bookingText = [
    "Заявка в антикафе В Ёлках",
    `Билеты: ${selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ") || "не выбраны"}`,
    `Дата: ${selectedDate ? selectedDate.label : "не выбрана"}`,
    `Время: ${selectedTime || "не выбрано"}`,
    "Длительность: 1 час",
    `Услуги: ${selectedServices.length ? selectedServices.map((item) => item.title).join(", ") : "без доп. услуг"}`,
    `Итог: ${formatCurrency(total)}`,
    `Имя: ${contactValues.name || "не указано"}`,
    `Телефон: ${contactValues.phone || "не указан"}`,
    contactValues.comment ? `Комментарий: ${contactValues.comment}` : "Комментарий: без комментария",
  ].join("\n");

  function resetStatuses() {
    setStepError("");
    setSubmitTone("idle");
    setSubmitMessage("");
  }

  function updateTicketQuantity(id: BookingTicketId, delta: number) {
    resetStatuses();
    setSelectedRateQuantities((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current };

      if (nextQuantity === 0) {
        delete next[id];
      } else {
        next[id] = nextQuantity;
      }

      return next;
    });
  }

  function toggleServiceSelection(id: string) {
    resetStatuses();
    setSelectedServiceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function updateContactField(field: keyof ContactValues, value: string) {
    resetStatuses();
    setContactValues((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateContacts() {
    const nextErrors: Partial<Record<keyof ContactValues, string>> = {};

    if (contactValues.name.trim().length < 2) nextErrors.name = "Введите имя";
    if (!/^\+?[0-9()\-\s]{10,18}$/.test(contactValues.phone.trim())) nextErrors.phone = "Укажите телефон корректно";
    if (contactValues.comment.trim().length > 280) nextErrors.comment = "Комментарий должен быть короче 280 символов";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function copyBookingText() {
    try {
      await navigator.clipboard.writeText(bookingText);
      return true;
    } catch {
      return false;
    }
  }

  async function handleCopyBookingText() {
    const copied = await copyBookingText();
    setSubmitTone(copied ? "success" : "warning");
    setSubmitMessage(
      copied
        ? "Детали визита скопированы. Их можно сразу отправить администратору."
        : "Автокопирование не сработало. При необходимости скопируйте детали вручную из блока подтверждения."
    );
  }

  async function finalizeBooking() {
    resetStatuses();

    if (!selectedTickets.length) {
      setStep(0);
      setStepError("Добавьте хотя бы один билет перед отправкой.");
      return;
    }

    if (!selectedDate) {
      setStep(1);
      setStepError("Выберите дату визита.");
      return;
    }

    if (happyHourSelected && selectedDate.isWeekend) {
      setStep(1);
      setStepError('Тариф "Счастливый час" доступен только по будням. Выберите будний день или снимите этот тариф.');
      return;
    }

    if (!selectedTime || timeSlots.find((slot) => slot.time === selectedTime)?.disabled) {
      setStep(2);
      setStepError("Выберите доступное время.");
      return;
    }

    if (familyCount > 0 && familyCount < 3) {
      setStep(0);
      setStepError('Для тарифа "Семейный" нужно выбрать минимум 3 билета.');
      return;
    }

    if (!validateContacts()) {
      setStep(4);
      setStepError("Проверьте имя и телефон перед отправкой заявки.");
      return;
    }

    const copied = await copyBookingText();
    window.open(BOOKING_CONTACTS.telegramHref, "_blank", "noopener,noreferrer");
    setSubmitTone(copied ? "success" : "warning");
    setSubmitMessage(
      copied
        ? "Telegram открыт, а детали визита уже в буфере обмена. Просто вставьте их в сообщение и отправьте."
        : "Telegram открыт. Если детали не скопировались автоматически, перенесите их из блока подтверждения вручную."
    );
  }

  function goToStep(nextStep: number) {
    resetStatuses();

    if (nextStep <= step) {
      setStep(nextStep);
      return;
    }

    if (step === 0) {
      if (!selectedTickets.length) {
        setStepError("Добавьте хотя бы один билет.");
        return;
      }

      if (familyCount > 0 && familyCount < 3) {
        setStepError('Для тарифа "Семейный" нужно выбрать минимум 3 билета.');
        return;
      }
    }

    if (step === 1) {
      if (!selectedDate) {
        setStepError("Выберите дату визита.");
        return;
      }

      if (happyHourSelected && selectedDate.isWeekend) {
        setStepError('Тариф "Счастливый час" доступен только по будням.');
        return;
      }
    }

    if (step === 2 && (!selectedTime || timeSlots.find((slot) => slot.time === selectedTime)?.disabled)) {
      setStepError("Выберите доступное время.");
      return;
    }

    if (step === 4 && !validateContacts()) {
      setStepError("Проверьте контактные данные перед продолжением.");
      return;
    }

    setStep(nextStep);
  }

  return (
    <section
      id="booking"
      className="forest-section scroll-mt-24 py-14 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.66)]" />

      <div className="container-x section-content">
        <div className="max-w-3xl">
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Онлайн-запись</h2>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-[#efe4c8]/86 sm:text-base">
            <span className="sm:hidden">Соберите визит по шагам: билет, дата, слот, услуги и контакты. Все сеансы идут 1 час.</span>
            <span className="hidden sm:inline">Конфигуратор визита: сначала билет, потом дата, слот и допуслуги. Все сеансы идут ровно 1 час, а запись доступна только на 11:00, 13:00, 15:00, 17:00 и 19:00.</span>
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="min-w-0">
            <div className="forest-card mb-4 p-3.5 xl:hidden sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Бронирование</div>
                  <div className="mt-1 text-[1.12rem] font-black text-[#f6efdb]">{bookingSteps[step]}</div>
                  <p className="mt-1 text-[0.82rem] leading-[1.4] text-[#efe4c8]/82">{bookingStepNotes[step]}</p>
                </div>
                <div className="rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.72rem] font-bold text-[#f6efdb]">
                  {step + 1} / {bookingSteps.length}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-[20px] border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Билеты</div>
                  <div className="mt-1 text-[0.95rem] font-bold text-[#f6efdb]">{totalTicketsCount || 0}</div>
                </div>
                <div className="rounded-[20px] border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Итог</div>
                  <div className="mt-1 text-[0.95rem] font-bold text-[#f6efdb]">{formatCurrency(total)}</div>
                </div>
                <div className="rounded-[20px] border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Дата</div>
                  <div className="mt-1 text-[0.9rem] font-bold leading-[1.2] text-[#f6efdb]">{selectedDate?.dayLabel ?? "Выберите"}</div>
                </div>
                <div className="rounded-[20px] border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Время</div>
                  <div className="mt-1 text-[0.95rem] font-bold text-[#f6efdb]">{selectedTimeLabel}</div>
                </div>
              </div>
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {bookingSteps.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={clsx(
                    "min-w-max rounded-full border px-3 py-2 text-left text-[0.78rem] font-semibold transition sm:text-sm",
                    index === step
                      ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                      : index < step
                        ? "border-[#d9c891]/55 bg-[rgba(255,255,255,.08)] text-[#f6efdb]"
                        : "border-[#ccb886]/50 bg-[rgba(16,34,20,.56)] text-[#efe3c8]"
                  )}
                  onClick={() => goToStep(index)}
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current/35 text-[0.72rem]">
                    {index < step ? <Check size={13} /> : index + 1}
                  </span>
                  {item}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="forest-card overflow-hidden p-3.5 sm:p-5"
              >
                <div className="flex flex-col gap-2 border-b border-[#d6c388]/16 pb-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Шаг {step + 1}</div>
                  <h3 className="text-[1.28rem] font-black text-[#f6efdb] sm:text-[1.75rem]">{bookingSteps[step]}</h3>
                  <p className="max-w-2xl text-[0.82rem] leading-[1.45] text-[#efe4c8]/82 sm:text-[0.95rem]">{bookingStepNotes[step]}</p>
                </div>

                {step === 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2">
                    {BOOKING_TICKETS.map((ticket) => {
                      const quantity = selectedRateQuantities[ticket.id] ?? 0;
                      const infoOpen = activeInfoRateId === ticket.id;

                      return (
                        <article
                          key={ticket.id}
                          className={clsx(
                            "flex h-full flex-col rounded-[22px] border p-3 shadow-[0_12px_28px_rgba(0,0,0,.22)] transition sm:rounded-[24px] sm:p-5",
                            quantity > 0
                              ? "border-[#d9c891]/75 bg-[rgba(24,47,29,.9)]"
                              : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)]"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <strong className="text-[0.98rem] text-[#f6efdb] sm:text-[1.45rem]">
                                  {formatCurrency(ticket.price)}
                                  <span className="text-[0.74em]"> / ч</span>
                                </strong>
                                {ticket.oldPrice ? (
                                  <span className="text-[0.68rem] text-[#d9ccb0]/65 line-through sm:text-sm">{formatCurrency(ticket.oldPrice)}</span>
                                ) : null}
                                {ticket.discount ? (
                                  <span className="rounded-full bg-[#ff5d5d] px-2 py-0.5 text-[0.58rem] font-bold text-white sm:text-[0.72rem]">
                                    {ticket.discount}
                                  </span>
                                ) : null}
                              </div>
                              {ticket.note ? (
                                <div className="mt-2 inline-flex rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-2 py-1 text-[0.58rem] font-semibold tracking-[0.04em] text-[#f1e7cd] sm:px-2.5 sm:text-[0.72rem]">
                                  {ticket.note}
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              className={clsx(
                                "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[#f5edd9] transition sm:h-9 sm:w-9",
                                infoOpen ? "border-[#d9c891]/70 bg-[rgba(255,255,255,.12)]" : "border-[#d6c388]/24 bg-[rgba(255,255,255,.04)]"
                              )}
                              aria-label={`Подробнее о тарифе ${ticket.name}`}
                              onClick={() => setActiveInfoRateId(infoOpen ? null : ticket.id)}
                            >
                              <Info size={16} />
                            </button>
                          </div>

                          <h4 className="mt-3 text-[0.96rem] font-black leading-[1.12] text-[#f7f0df] sm:text-[1.18rem]">
                            <span className="sm:hidden">{ticket.mobileName}</span>
                            <span className="hidden sm:inline">{ticket.name}</span>
                          </h4>

                          <p className="mt-1.5 text-[0.74rem] leading-[1.35] text-[#efe4c8]/86 sm:mt-2 sm:text-[0.92rem] sm:leading-[1.45]">
                            <span className="sm:hidden">{ticket.mobileDescription}</span>
                            <span className="hidden sm:inline">{ticket.description}</span>
                          </p>

                          {infoOpen ? (
                            <div className="mt-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(8,18,11,.34)] px-3 py-3 text-[0.72rem] leading-[1.35] text-[#efe4c8]/82 sm:px-3.5 sm:text-[0.88rem] sm:leading-[1.45]">
                              {ticket.details}
                            </div>
                          ) : null}

                          <div className="mt-auto pt-3 sm:pt-4">
                            <div className="hidden text-[0.82rem] text-[#e7dbc0]/78 sm:block">{ticket.location}</div>

                            {quantity === 0 ? (
                              <button type="button" className="btn-forest mt-0 min-h-[40px] w-full text-[0.78rem] sm:mt-3 sm:min-h-[42px] sm:w-auto sm:text-base" onClick={() => updateTicketQuantity(ticket.id, 1)}>
                                Выбрать
                              </button>
                            ) : (
                              <div className="mt-0 flex items-center justify-between gap-2 rounded-[18px] border border-[#d6c388]/35 bg-[rgba(255,255,255,.08)] px-2 py-2 sm:mt-3 sm:gap-3 sm:rounded-full sm:px-3">
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d6c388]/35 text-[#f6efdb] sm:h-8 sm:w-8"
                                  onClick={() => updateTicketQuantity(ticket.id, -1)}
                                >
                                  <Minus size={14} />
                                </button>
                                <div className="text-center">
                                  <div className="text-[0.55rem] uppercase tracking-[0.14em] text-[#e8d9b4] sm:text-[0.66rem]">Выбрано</div>
                                  <strong className="text-[0.88rem] text-[#f6efdb] sm:text-[0.95rem]">{quantity}</strong>
                                </div>
                                <button
                                  type="button"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d6c388]/35 text-[#f6efdb] sm:h-8 sm:w-8"
                                  onClick={() => updateTicketQuantity(ticket.id, 1)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="mt-5">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
                      {dateOptions.map((dateOption) => {
                        const isSelected = dateOption.id === selectedDateId;
                        const isDisabled = happyHourSelected && dateOption.isWeekend;

                        return (
                          <button
                            key={dateOption.id}
                            type="button"
                            className={clsx(
                              "min-h-[112px] rounded-[20px] border px-3 py-3 text-left transition sm:min-h-[132px] sm:rounded-[22px] sm:px-4 sm:py-4",
                              isSelected
                                ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                                : "border-[#ccb886]/50 bg-[rgba(16,34,20,.56)] text-[#efe3c8]",
                              isDisabled && "cursor-not-allowed opacity-60"
                            )}
                            disabled={isDisabled}
                            onClick={() => setSelectedDateId(dateOption.id)}
                          >
                            <div className="text-[0.68rem] uppercase tracking-[0.16em] opacity-80 sm:text-[0.74rem]">{dateOption.weekdayLabel}</div>
                            <strong className="mt-2 block text-[0.92rem] leading-[1.15] sm:text-[1.08rem]">{dateOption.dayLabel}</strong>
                            <span className="mt-2 block text-[0.68rem] leading-[1.3] opacity-78 sm:text-[0.76rem]">{isDisabled ? "Не подходит" : "Свободно"}</span>
                          </button>
                        );
                      })}
                    </div>

                    {happyHourSelected ? (
                      <div className="mt-4 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#efe4c8]/84">
                        Тариф <strong className="text-[#f6efdb]">&quot;Счастливый час&quot;</strong> работает только по будням. Если нужен выходной день, уберите этот тариф на первом шаге.
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-5">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          className={clsx(
                            "min-h-[112px] rounded-[20px] border px-3 py-3 text-left transition sm:min-h-[132px] sm:rounded-[22px] sm:px-4 sm:py-4",
                            selectedTime === slot.time
                              ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                              : "border-[#ccb886]/50 bg-[rgba(16,34,20,.56)] text-[#efe3c8]",
                            slot.disabled && "cursor-not-allowed opacity-60"
                          )}
                          disabled={slot.disabled}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] opacity-80 sm:text-[0.76rem]">
                            <Clock3 size={14} />
                            1 час
                          </div>
                          <strong className="mt-2 block text-[1.02rem] sm:text-[1.35rem]">{slot.time}</strong>
                          <span className="mt-2 block text-[0.68rem] opacity-78 sm:text-[0.76rem]">{slot.status}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#efe4c8]/84">
                      Доступны только нечетные слоты: 11:00, 13:00, 15:00, 17:00 и 19:00. Каждый визит идет ровно 1 час.
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2">
                    {BOOKING_EXTRAS.map((service) => {
                      const isSelected = selectedServiceIds.includes(service.id);

                      return (
                        <article
                          key={service.id}
                          className={clsx(
                            "flex h-full flex-col rounded-[22px] border p-3 shadow-[0_12px_28px_rgba(0,0,0,.22)] transition sm:rounded-[24px] sm:p-5",
                            isSelected
                              ? "border-[#d9c891]/75 bg-[rgba(24,47,29,.9)]"
                              : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)]"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <strong className="text-[0.98rem] text-[#f6efdb] sm:text-[1.3rem]">{formatCurrency(service.price)}</strong>
                            <span className="rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-2 py-1 text-[0.58rem] font-semibold tracking-[0.04em] text-[#f1e7cd] sm:px-2.5 sm:text-[0.72rem]">
                              {service.note}
                            </span>
                          </div>

                          <h4 className="mt-3 text-[0.94rem] font-black leading-[1.12] text-[#f7f0df] sm:text-[1.18rem]">{service.title}</h4>
                          <p className="mt-1.5 text-[0.74rem] leading-[1.35] text-[#efe4c8]/86 sm:mt-2 sm:text-[0.92rem] sm:leading-[1.45]">{service.description}</p>

                          <div className="mt-auto pt-3 sm:pt-4">
                            <button
                              type="button"
                              className={isSelected ? "btn-cream min-h-[40px] w-full text-[0.78rem] sm:min-h-[42px] sm:text-base" : "btn-forest min-h-[40px] w-full text-[0.78rem] sm:min-h-[42px] sm:text-base"}
                              onClick={() => toggleServiceSelection(service.id)}
                            >
                              {isSelected ? "Убрать услугу" : "Добавить"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Имя</span>
                      <input
                        className="field-paper rounded-2xl px-4 py-3"
                        placeholder="Как к вам обращаться"
                        value={contactValues.name}
                        onChange={(event) => updateContactField("name", event.target.value)}
                      />
                      {fieldErrors.name ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.name}</span> : null}
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Телефон</span>
                      <input
                        className="field-paper rounded-2xl px-4 py-3"
                        placeholder="+7 (___) ___-__-__"
                        value={contactValues.phone}
                        onChange={(event) => updateContactField("phone", event.target.value)}
                      />
                      {fieldErrors.phone ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.phone}</span> : null}
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Комментарий</span>
                      <textarea
                        className="field-paper min-h-[96px] rounded-2xl px-4 py-3 sm:min-h-[120px]"
                        placeholder="Например: будем с ребенком, хотим покормить животных, нужен семейный тариф."
                        value={contactValues.comment}
                        onChange={(event) => updateContactField("comment", event.target.value)}
                      />
                      {fieldErrors.comment ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.comment}</span> : null}
                    </label>

                    <div className="sm:col-span-2 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#efe4c8]/84">
                      После подтверждения откроется Telegram, а вся собранная заявка скопируется в буфер обмена. Это самый быстрый способ довести бронь до администратора без отдельной CRM-интеграции.
                    </div>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[24px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] p-4 sm:p-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Билеты</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">
                            {selectedTickets.length
                              ? selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ")
                              : "Не выбраны"}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Дата</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{selectedDateLabel}</strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Время</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{selectedTimeLabel}</strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Длительность</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">1 час</strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Услуги</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">
                            {selectedServices.length ? selectedServices.map((item) => item.title).join(", ") : "Без доп. услуг"}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Контакты</span>
                          <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">
                            {contactValues.name || "Без имени"} · {contactValues.phone || "Без телефона"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] p-4 sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Черновик сообщения</div>
                          <p className="mt-1 text-[0.82rem] leading-[1.45] text-[#efe4c8]/82">Можно скопировать заранее или сразу открыть Telegram с готовыми деталями визита.</p>
                        </div>
                        <button type="button" className="btn-cream min-h-[42px] sm:w-auto" onClick={handleCopyBookingText}>
                          <Copy size={16} />
                          <span className="ml-2">Скопировать</span>
                        </button>
                      </div>

                      <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#d6c388]/16 bg-[rgba(8,18,11,.34)] p-4 text-[0.78rem] leading-[1.55] whitespace-pre-wrap text-[#f2ead7] sm:text-[0.84rem]">
                        {bookingText}
                      </pre>
                    </div>
                  </div>
                ) : null}

                {stepError ? (
                  <p className="mt-4 flex items-start gap-2 rounded-2xl border border-[#8d5a5a]/55 bg-[rgba(95,23,23,.24)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#ffd6d6]">
                    <CircleAlert size={18} className="mt-0.5 shrink-0" />
                    <span>{stepError}</span>
                  </p>
                ) : null}

                {submitTone !== "idle" && submitMessage ? (
                  <p
                    className={clsx(
                      "mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[0.84rem] leading-[1.45]",
                      submitTone === "success"
                        ? "border border-[#7ea85b]/55 bg-[rgba(60,98,42,.24)] text-[#edf8df]"
                        : "border border-[#d6c388]/35 bg-[rgba(255,255,255,.08)] text-[#f6efdb]"
                    )}
                  >
                    {submitTone === "success" ? <Check size={18} className="mt-0.5 shrink-0" /> : <Info size={18} className="mt-0.5 shrink-0" />}
                    <span>{submitMessage}</span>
                  </p>
                ) : null}

                <div className="mt-5 flex flex-col gap-3 border-t border-[#d6c388]/16 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="rounded-[20px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-3.5 py-3 sm:rounded-2xl sm:px-4">
                    <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Сейчас в заказе</div>
                    <div className="mt-1 text-[0.82rem] font-bold leading-[1.3] text-[#f6efdb] sm:text-[0.9rem]">{mobileSelectionNote}</div>
                    <div className="mt-1 text-[1rem] font-black text-[#f6efdb] sm:text-[1.12rem]">{formatCurrency(total)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
                    <button type="button" className="btn-cream min-h-[44px] px-3 text-[0.82rem] sm:text-base" disabled={step === 0} onClick={() => goToStep(Math.max(0, step - 1))}>
                      Назад
                    </button>

                    {step < bookingSteps.length - 1 ? (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem] sm:text-base" onClick={() => goToStep(step + 1)}>
                        Продолжить
                      </button>
                    ) : (
                      <button type="button" className="btn-forest col-span-2 min-h-[44px] px-3 text-[0.82rem] sm:col-auto sm:text-base" onClick={finalizeBooking}>
                        <Send size={16} />
                        <span className="ml-2">Открыть Telegram</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="hidden xl:block xl:sticky xl:top-24">
            <div className="forest-card p-5">
              <div className="border-b border-[#d6c388]/16 pb-4">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Ваш визит</div>
                <h3 className="mt-2 text-[1.55rem] font-black text-[#f6efdb]">Итог заказа</h3>
                <p className="mt-2 text-[0.86rem] leading-[1.45] text-[#efe4c8]/82">
                  Sticky-сводка: билеты, дата, время, услуги и финальная сумма всегда под рукой.
                </p>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4]">
                    <ShoppingBag size={15} /> Билеты
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedTickets.length ? (
                      selectedTickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5">
                          <span className="text-[0.84rem] leading-[1.4] text-[#efe4c8]/84">
                            {ticket.mobileName} x{ticket.quantity}
                          </span>
                          <strong className="shrink-0 text-[0.84rem] text-[#f6efdb]">{formatCurrency(ticket.price * ticket.quantity)}</strong>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5 text-[0.84rem] text-[#efe4c8]/72">
                        Пока ничего не выбрано
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4]">
                    <CalendarDays size={15} /> Детали визита
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5">
                      <span className="text-[0.84rem] text-[#efe4c8]/72">Дата</span>
                      <strong className="text-[0.84rem] text-[#f6efdb]">{selectedDate?.dayLabel ?? "Выберите"}</strong>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5">
                      <span className="text-[0.84rem] text-[#efe4c8]/72">Время</span>
                      <strong className="text-[0.84rem] text-[#f6efdb]">{selectedTimeLabel}</strong>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5">
                      <span className="text-[0.84rem] text-[#efe4c8]/72">Длительность</span>
                      <strong className="text-[0.84rem] text-[#f6efdb]">1 час</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4]">
                    <Clock3 size={15} /> Услуги
                  </div>
                  <div className="mt-3 space-y-2">
                    {selectedServices.length ? (
                      selectedServices.map((service) => (
                        <div key={service.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5">
                          <span className="text-[0.84rem] leading-[1.4] text-[#efe4c8]/84">{service.title}</span>
                          <strong className="shrink-0 text-[0.84rem] text-[#f6efdb]">{formatCurrency(service.price)}</strong>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-3 py-2.5 text-[0.84rem] text-[#efe4c8]/72">
                        Без дополнительных услуг
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#d9c891]/45 bg-[rgba(255,255,255,.06)] px-4 py-4">
                <div className="text-[0.74rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Итоговая сумма</div>
                <div className="mt-2 text-[1.8rem] font-black text-[#f6efdb]">{formatCurrency(total)}</div>
                <p className="mt-2 text-[0.84rem] leading-[1.45] text-[#efe4c8]/78">
                  Подтверждение записи идет через Telegram или по телефону:{" "}
                  <a className="font-semibold text-[#f6efdb]" href={BOOKING_CONTACTS.phoneHref}>
                    {BOOKING_CONTACTS.phone}
                  </a>
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-4 py-3 text-[0.82rem] leading-[1.45] text-[#efe4c8]/78">
                {BOOKING_CONTACTS.note}
              </div>

              <div className="mt-4 grid gap-2">
                <a className="btn-cream min-h-[44px] w-full" href={BOOKING_CONTACTS.phoneHref}>
                  <Phone size={16} />
                  <span className="ml-2">Позвонить</span>
                </a>
                <a className="btn-forest min-h-[44px] w-full" href={BOOKING_CONTACTS.telegramHref} target="_blank" rel="noreferrer">
                  <Send size={16} />
                  <span className="ml-2">Telegram</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
