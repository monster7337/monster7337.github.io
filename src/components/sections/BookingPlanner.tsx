"use client";

import clsx from "clsx";
import { CalendarDays, Check, CircleAlert, Clock3, CreditCard, Info, Minus, Phone, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultSettings,
  FIXED_SLOT_TIMES,
  getSlotCapacityState,
  isHappyHourEnabled,
  readStoredAppointments,
  readStoredSettings,
  savePublicBooking,
} from "@/components/admin/admin-data";
import { BOOKING_CONTACTS, BOOKING_TICKETS, BookingTicketId, formatCurrency } from "@/lib/bookingCatalog";
import { DEFAULT_BOOKING_TIME, getBookingDateOptions } from "@/lib/bookingOptions";
import { createPaykeeperInvoice } from "@/lib/paykeeperClient";

const BOOKING_PREPAYMENT_PER_GUEST = 500;
const BOOKING_DRAFT_STORAGE_KEY = "velkah-booking-draft";

const bookingSteps = ["Билеты", "Дата", "Время", "Контакты", "Подтверждение"];
const bookingStepNotes = [
  "Выберите билеты на посещение",
  "Найдите удобный день визита",
  "Выберите подходящий слот",
  "Оставьте контакты для связи",
  "Проверьте предоплату и детали",
];

const tariffMap: Record<BookingTicketId, string> = {
  standard: "Обычный билет",
  family: "Семейный билет",
  social: "Льготный билет",
  "happy-hour": "Счастливый час",
};

type BookingPlannerProps = {
  initialTicketId?: BookingTicketId;
  initialDateId?: string;
  initialTime?: string;
};

type ContactValues = {
  name: string;
  phone: string;
  email: string;
  comment: string;
};

type ConsentValues = {
  terms: boolean;
  personalData: boolean;
};

type SelectedTicket = (typeof BOOKING_TICKETS)[number] & {
  quantity: number;
  originalPrice: number;
  effectiveTariffId: BookingTicketId;
  hasHappyHourDiscount: boolean;
  switchMessage?: string;
};

function getTicketWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "билет";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return "билета";
  return "билетов";
}

function getStorageSnapshot() {
  return {
    appointments: readStoredAppointments(),
    settings: readStoredSettings() ?? defaultSettings,
  };
}

function SummaryRows({
  selectedTickets,
  selectedDateLabel,
  selectedTimeLabel,
  totalTicketsCount,
  total,
  prepaymentNow,
  remainingOnSite,
  happyHourDiscountAmount,
}: {
  selectedTickets: SelectedTicket[];
  selectedDateLabel: string;
  selectedTimeLabel: string;
  totalTicketsCount: number;
  total: number;
  prepaymentNow: number;
  remainingOnSite: number;
  happyHourDiscountAmount: number;
}) {
  return (
    <>
      <div className="summary-group">
        <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
          <ShoppingBag size={15} />
          Билеты
        </span>
        <div className="mt-3 space-y-2">
          {selectedTickets.length ? (
            selectedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-start justify-between gap-3 rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5"
              >
                <div className="text-[0.84rem] leading-[1.35] text-[#efe4c8]/86">
                  <div>
                    {ticket.mobileName} x{ticket.quantity}
                  </div>
                  {ticket.hasHappyHourDiscount ? <div className="mt-1 text-[0.72rem] text-[#dbe8be]">цена счастливого часа</div> : null}
                  {ticket.switchMessage ? <div className="mt-1 text-[0.72rem] text-[#dbe8be]">{ticket.switchMessage}</div> : null}
                </div>
                <strong className="shrink-0 text-[0.84rem] text-[#f7efdc]">{formatCurrency(ticket.price * ticket.quantity)}</strong>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5 text-[0.84rem] text-[#efe4c8]/72">
              Пока ничего не выбрано
            </div>
          )}
        </div>
      </div>

      <div className="summary-group">
        <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
          <CalendarDays size={15} />
          Детали визита
        </span>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">Дата</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{selectedDateLabel}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">Время</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{selectedTimeLabel}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">Мест</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{totalTicketsCount}</strong>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] p-4">
        <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
          <CreditCard size={15} />
          Оплата
        </span>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>Полная стоимость</span>
            <strong className="text-[#f7efdc]">{formatCurrency(total)}</strong>
          </div>
          {happyHourDiscountAmount > 0 ? (
            <div className="flex items-center justify-between text-[0.88rem] text-[#dbe8be]">
              <span>Скидка счастливого часа</span>
              <strong>-{formatCurrency(happyHourDiscountAmount)}</strong>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>Предоплата сейчас</span>
            <strong className="text-[#f7efdc]">{formatCurrency(prepaymentNow)}</strong>
          </div>
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>Остаток на месте</span>
            <strong className="text-[#f7efdc]">{formatCurrency(remainingOnSite)}</strong>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookingPlanner({ initialTicketId, initialDateId, initialTime }: BookingPlannerProps) {
  const router = useRouter();
  const dateOptions = useMemo(() => getBookingDateOptions(), []);
  const initialResolvedDateId = dateOptions.some((item) => item.id === initialDateId) ? initialDateId : dateOptions[0]?.id ?? "";
  const initialResolvedTime = initialTime && FIXED_SLOT_TIMES.includes(initialTime) ? initialTime : DEFAULT_BOOKING_TIME;

  const [step, setStep] = useState(0);
  const [selectedDateId, setSelectedDateId] = useState(initialResolvedDateId);
  const [selectedTime, setSelectedTime] = useState(initialResolvedTime);
  const [selectedRateQuantities, setSelectedRateQuantities] = useState<Partial<Record<BookingTicketId, number>>>(() => {
    if (!initialTicketId) return {};
    return { [initialTicketId]: initialTicketId === "family" ? 3 : 1 };
  });
  const [activeInfoRateId, setActiveInfoRateId] = useState<BookingTicketId | null>(initialTicketId ?? null);
  const [contactValues, setContactValues] = useState<ContactValues>({ name: "", phone: "", email: "", comment: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [consentValues, setConsentValues] = useState<ConsentValues>({ terms: false, personalData: false });
  const [consentErrors, setConsentErrors] = useState<Partial<Record<keyof ConsentValues, string>>>({});
  const [stepError, setStepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [storageSnapshot, setStorageSnapshot] = useState(getStorageSnapshot);

  const selectedDate = dateOptions.find((item) => item.id === selectedDateId) ?? null;
  const selectedDateKey = selectedDate?.id ?? "";
  const familyCount = selectedRateQuantities.family ?? 0;
  const happyHourRate = BOOKING_TICKETS.find((ticket) => ticket.id === "happy-hour");
  const standardRate = BOOKING_TICKETS.find((ticket) => ticket.id === "standard");
  const happyHourDiscountActive = isHappyHourEnabled(storageSnapshot.settings, selectedDateKey, selectedTime);

  useEffect(() => {
    const syncStorage = () => setStorageSnapshot(getStorageSnapshot());
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  useEffect(() => {
    router.prefetch("/terms-of-use");
    router.prefetch("/privacy-policy");
    router.prefetch("/public-offer");
    router.prefetch("/personal-data-consent");
  }, [router]);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
    if (!raw) {
      setIsDraftRestored(true);
      return;
    }

    try {
      const draft = JSON.parse(raw) as {
        step?: number;
        selectedDateId?: string;
        selectedTime?: string;
        selectedRateQuantities?: Partial<Record<BookingTicketId, number>>;
        contactValues?: ContactValues;
        consentValues?: ConsentValues;
      };

      if (draft.selectedDateId && dateOptions.some((item) => item.id === draft.selectedDateId)) {
        setSelectedDateId(draft.selectedDateId);
      }
      if (draft.selectedTime && FIXED_SLOT_TIMES.includes(draft.selectedTime)) {
        setSelectedTime(draft.selectedTime);
      }
      if (draft.selectedRateQuantities) {
        setSelectedRateQuantities(draft.selectedRateQuantities);
      }
      if (draft.contactValues) {
        setContactValues(draft.contactValues);
      }
      if (draft.consentValues) {
        setConsentValues(draft.consentValues);
      }
      if (typeof draft.step === "number") {
        setStep(Math.max(0, Math.min(bookingSteps.length - 1, draft.step)));
      }
    } catch {
      window.sessionStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
    } finally {
      setIsDraftRestored(true);
    }
  }, [dateOptions]);

  const saveDraft = useCallback(() => {
    window.sessionStorage.setItem(
      BOOKING_DRAFT_STORAGE_KEY,
      JSON.stringify({
        step,
        selectedDateId,
        selectedTime,
        selectedRateQuantities,
        contactValues,
        consentValues,
      })
    );
  }, [consentValues, contactValues, selectedDateId, selectedRateQuantities, selectedTime, step]);

  const handleLegalLinkIntent = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  useEffect(() => {
    if (!isDraftRestored) {
      return;
    }

    saveDraft();
  }, [isDraftRestored, saveDraft]);

  useEffect(() => {
    if (!isDraftRestored) {
      return undefined;
    }

    const persistDraft = () => saveDraft();
    const persistWhenHidden = () => {
      if (document.visibilityState === "hidden") {
        saveDraft();
      }
    };

    window.addEventListener("pagehide", persistDraft);
    window.addEventListener("beforeunload", persistDraft);
    window.addEventListener("popstate", persistDraft);
    document.addEventListener("visibilitychange", persistWhenHidden);

    return () => {
      window.removeEventListener("pagehide", persistDraft);
      window.removeEventListener("beforeunload", persistDraft);
      window.removeEventListener("popstate", persistDraft);
      document.removeEventListener("visibilitychange", persistWhenHidden);
    };
  }, [isDraftRestored, saveDraft]);

  const selectedTickets = useMemo<SelectedTicket[]>(() => {
    return BOOKING_TICKETS.map((ticket) => {
      const quantity = selectedRateQuantities[ticket.id] ?? 0;
      const standardPrice = standardRate?.price ?? ticket.price;
      const isHappyTicket = ticket.id === "happy-hour";
      const isStandardTicket = ticket.id === "standard";

      const switchedToHappyHour = Boolean(happyHourDiscountActive && isStandardTicket && happyHourRate);
      const switchedToStandard = Boolean(!happyHourDiscountActive && isHappyTicket);
      const staysHappyHour = Boolean(happyHourDiscountActive && isHappyTicket);

      const effectiveTariffId: BookingTicketId = switchedToHappyHour || staysHappyHour ? "happy-hour" : switchedToStandard ? "standard" : ticket.id;
      const effectivePrice = effectiveTariffId === "happy-hour" && happyHourRate ? happyHourRate.price : effectiveTariffId === "standard" ? standardPrice : ticket.price;
      const switchMessage = switchedToHappyHour
        ? "Для этого времени действует цена счастливого часа."
        : switchedToStandard
          ? "Для этого времени действует обычная цена."
          : undefined;

      return {
        ...ticket,
        quantity,
        price: effectivePrice,
        originalPrice: ticket.price,
        effectiveTariffId,
        hasHappyHourDiscount: effectiveTariffId === "happy-hour" && effectivePrice < standardPrice,
        switchMessage,
      };
    }).filter((ticket) => ticket.quantity > 0);
  }, [happyHourDiscountActive, happyHourRate, selectedRateQuantities, standardRate]);

  const totalTicketsCount = selectedTickets.reduce((sum, item) => sum + item.quantity, 0);
  const ticketsTotal = selectedTickets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const happyHourDiscountAmount = selectedTickets.reduce(
    (sum, item) => sum + (item.hasHappyHourDiscount ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );

  const bookingSwitchNotice = useMemo(() => {
    const switchedToHappyHourCount = selectedTickets
      .filter((ticket) => ticket.id === "standard" && ticket.effectiveTariffId === "happy-hour")
      .reduce((sum, ticket) => sum + ticket.quantity, 0);
    const switchedToStandardCount = selectedTickets
      .filter((ticket) => ticket.id === "happy-hour" && ticket.effectiveTariffId === "standard")
      .reduce((sum, ticket) => sum + ticket.quantity, 0);

    if (switchedToHappyHourCount > 0) {
      return `Вы выбрали счастливый слот, поэтому ${switchedToHappyHourCount} ${getTicketWord(switchedToHappyHourCount)} ${switchedToHappyHourCount === 1 ? "перешел" : "перешли"} на цену счастливого часа.`;
    }

    if (switchedToStandardCount > 0) {
      return `Для выбранного времени счастливый час не действует, поэтому ${switchedToStandardCount} ${getTicketWord(switchedToStandardCount)} ${switchedToStandardCount === 1 ? "перешел" : "перешли"} на обычную цену.`;
    }

    return "";
  }, [selectedTickets]);

  const timeSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    return FIXED_SLOT_TIMES.map((time) => {
      const state = getSlotCapacityState(storageSnapshot.appointments, storageSnapshot.settings, selectedDate.id, time);
      return {
        time,
        disabled: state.remainingGuests < Math.max(1, totalTicketsCount),
        remainingGuests: state.remainingGuests,
        totalCapacity: state.totalCapacity,
        isHappyHour: isHappyHourEnabled(storageSnapshot.settings, selectedDate.id, time),
      };
    });
  }, [selectedDate, storageSnapshot.appointments, storageSnapshot.settings, totalTicketsCount]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const state = getSlotCapacityState(storageSnapshot.appointments, storageSnapshot.settings, selectedDate.id, selectedTime);
    if (state.remainingGuests < Math.max(1, totalTicketsCount)) {
      setSelectedTime("");
    }
  }, [selectedDate, selectedTime, storageSnapshot.appointments, storageSnapshot.settings, totalTicketsCount]);

  const total = ticketsTotal;
  const prepaymentNow = totalTicketsCount * BOOKING_PREPAYMENT_PER_GUEST;
  const remainingOnSite = Math.max(total - prepaymentNow, 0);
  const selectedDateLabel = selectedDate ? selectedDate.label : "Выберите дату";
  const selectedTimeLabel = selectedTime || "Выберите время";
  const mobileSelectionNote =
    totalTicketsCount > 0 ? `${totalTicketsCount} ${getTicketWord(totalTicketsCount)} · предоплата ${formatCurrency(prepaymentNow)}` : "Соберите визит по шагам";

  function resetStatuses() {
    setStepError("");
  }

  function updateTicketQuantity(id: BookingTicketId, delta: number) {
    resetStatuses();
    setSelectedRateQuantities((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current };
      if (nextQuantity === 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
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

  function updateConsentField(field: keyof ConsentValues, value: boolean) {
    resetStatuses();
    setConsentValues((current) => ({ ...current, [field]: value }));
    if (consentErrors[field]) {
      setConsentErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateContacts() {
    const nextErrors: Partial<Record<keyof ContactValues, string>> = {};
    const nextConsentErrors: Partial<Record<keyof ConsentValues, string>> = {};
    if (contactValues.name.trim().length < 2) nextErrors.name = "Укажите имя";
    if (!/^\+?[0-9()\-\s]{10,18}$/.test(contactValues.phone.trim())) nextErrors.phone = "Укажите телефон корректно";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValues.email.trim())) nextErrors.email = "Укажите email корректно";
    if (contactValues.comment.trim().length > 280) nextErrors.comment = "Комментарий должен быть короче 280 символов";
    if (!consentValues.terms) nextConsentErrors.terms = "Подтвердите условия использования, политику конфиденциальности и публичную оферту";
    if (!consentValues.personalData) nextConsentErrors.personalData = "Подтвердите согласие на обработку персональных данных";
    setFieldErrors(nextErrors);
    setConsentErrors(nextConsentErrors);
    return Object.keys(nextErrors).length === 0 && Object.keys(nextConsentErrors).length === 0;
  }

  async function finalizeBooking() {
    resetStatuses();

    if (isSubmitting) {
      return;
    }

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
      setStep(3);
      setStepError("Проверьте телефон перед отправкой заявки.");
      return;
    }

    const guestTickets = selectedTickets.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({
        tariff: tariffMap[item.effectiveTariffId],
      }))
    );

    try {
      setIsSubmitting(true);
      const appointment = savePublicBooking({
        clientName: contactValues.name,
        phone: contactValues.phone,
        email: contactValues.email,
        date: selectedDate.id,
        time: selectedTime,
        guestTickets,
        selectedExtras: [],
        comment: contactValues.comment,
      });

      const params = new URLSearchParams({
        bookingId: appointment.id,
        items: selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", "),
        date: selectedDateLabel,
        time: selectedTimeLabel,
        tickets: String(totalTicketsCount),
        total: formatCurrency(total),
        prepayment: formatCurrency(prepaymentNow),
        remaining: formatCurrency(remainingOnSite),
        phone: contactValues.phone,
      });
      const invoice = await createPaykeeperInvoice({
        amount: prepaymentNow,
        orderId: appointment.id,
        clientName: contactValues.name,
        clientEmail: contactValues.email,
        clientPhone: contactValues.phone,
        serviceName: `В Ёлках: бронь ${selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ")}`,
        successPath: `/booking/success?${params.toString()}`,
      });

      window.sessionStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
      window.location.assign(invoice.paymentUrl);
    } catch (error) {
      setStep(2);
      setStepError(error instanceof Error ? error.message : "Не удалось сохранить запись.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const siteTermsHref = "/terms-of-use";
  const privacyHref = "/privacy-policy";
  const publicOfferHref = "/public-offer";
  const personalDataHref = "/personal-data-consent";

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

    if (step === 1 && !selectedDate) {
      setStepError("Выберите дату визита.");
      return;
    }

    if (step === 2 && (!selectedTime || timeSlots.find((slot) => slot.time === selectedTime)?.disabled)) {
      setStepError("Выберите доступное время.");
      return;
    }

    if (step === 3 && !validateContacts()) {
      setStepError("Проверьте контактные данные перед продолжением.");
      return;
    }

    setStep(nextStep);
  }

  return (
    <section
      id="booking"
      className="booking-mobile-stage forest-section scroll-mt-24 py-10 pb-32 sm:py-12 sm:pb-36 lg:py-14 lg:pb-14"
      style={{ backgroundImage: "url('/bg/grass2.webp')" }}
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.72)]" />

      <div className="container-x section-content">
        <div className="mx-auto max-w-[1160px]">
          <div className="booking-app-layout grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="mx-auto w-full max-w-[780px] lg:max-w-none">
              <div className="booking-app-overview forest-card p-4 lg:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Бронирование</div>
                    <div className="mt-1 text-[1.08rem] font-black text-[#f6efdb]">{bookingSteps[step]}</div>
                    <p className="mt-1 text-[0.82rem] leading-[1.42] text-[#efe4c8]/82">{bookingStepNotes[step]}</p>
                  </div>
                  <div className="rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.72rem] font-bold text-[#f6efdb]">
                    {step + 1} / {bookingSteps.length}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Билеты</div>
                    <div className="mt-1 text-[0.95rem] font-bold text-[#f6efdb]">{totalTicketsCount || 0}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Дата</div>
                    <div className="mt-1 text-[0.9rem] font-bold leading-[1.2] text-[#f6efdb]">{selectedDate?.dayLabel ?? "Выберите"}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Время</div>
                    <div className="mt-1 text-[0.9rem] font-bold text-[#f6efdb]">{selectedTimeLabel}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#a7c873]/45 bg-[linear-gradient(180deg,rgba(122,166,74,.22)_0%,rgba(78,113,45,.18)_100%)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#dbe8be]">Сейчас</div>
                    <div className="mt-1 text-[0.95rem] font-black text-[#f6efdb]">{formatCurrency(prepaymentNow)}</div>
                  </div>
                </div>
              </div>

              <div className="booking-app-step-tabs mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:mt-0">
                {bookingSteps.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={clsx(
                      "rounded-[18px] border px-2.5 py-2.5 text-left text-[0.72rem] font-semibold transition sm:min-w-[110px] sm:px-3 sm:text-sm",
                      index === step
                        ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                        : index < step
                          ? "border-[#d9c891]/55 bg-[rgba(255,255,255,.08)] text-[#f6efdb]"
                          : "border-[#ccb886]/50 bg-[rgba(16,34,20,.56)] text-[#efe3c8]"
                    )}
                    onClick={() => goToStep(index)}
                  >
                    <span className="mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current/35 text-[0.68rem]">
                      {index < step ? <Check size={12} /> : index + 1}
                    </span>
                    <div className="leading-[1.15]">{item}</div>
                  </button>
                ))}
              </div>

              <div className="booking-app-panel forest-card mt-4 overflow-hidden p-4 sm:p-5 lg:p-6" data-step={step}>
                  <div className="border-b border-[#d6c388]/16 pb-4">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Шаг {step + 1}</div>
                    <h3 className="mt-2 text-[1.28rem] font-black text-[#f6efdb] sm:text-[1.75rem]">{bookingSteps[step]}</h3>
                    <p className="mt-2 max-w-2xl text-[0.84rem] leading-[1.45] text-[#efe4c8]/82 sm:text-[0.95rem]">{bookingStepNotes[step]}</p>
                  </div>

                  {step === 0 ? (
                    <div className="booking-mobile-ticket-grid mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                      {BOOKING_TICKETS.map((ticket) => {
                        const quantity = selectedRateQuantities[ticket.id] ?? 0;
                        const infoOpen = activeInfoRateId === ticket.id;
                        const selectedTicketState = selectedTickets.find((item) => item.id === ticket.id);

                        return (
                          <article
                            key={ticket.id}
                            className={clsx(
                              "flex h-full flex-col rounded-[22px] border p-3 shadow-[0_14px_30px_rgba(0,0,0,.2)] transition sm:rounded-[24px] sm:p-5",
                              quantity > 0 ? "border-[#d9c891]/72 bg-[rgba(24,47,29,.92)]" : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)]"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[0.94rem] font-black text-[#f7efdc] sm:text-[1.2rem]">{formatCurrency(ticket.price)}</div>
                                {ticket.oldPrice ? (
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[0.68rem] text-[#efe4c8]/55 line-through sm:text-[0.76rem]">{formatCurrency(ticket.oldPrice)}</span>
                                    {ticket.discount ? (
                                      <span className="rounded-full border border-[#d9c891]/35 bg-[rgba(255,255,255,.08)] px-1.5 py-0.5 text-[0.58rem] font-bold text-[#f0e4c5] sm:px-2 sm:text-[0.65rem]">
                                        {ticket.discount}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                className={clsx(
                                  "inline-flex h-8 w-8 items-center justify-center rounded-full border transition sm:h-9 sm:w-9",
                                  infoOpen ? "border-[#d9c891]/55 bg-[rgba(255,255,255,.1)] text-[#f6efdb]" : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#efe4c8]/82"
                                )}
                                onClick={() => setActiveInfoRateId(infoOpen ? null : ticket.id)}
                                aria-label={`Подробнее о тарифе ${ticket.name}`}
                              >
                                <Info size={16} />
                              </button>
                            </div>

                            {ticket.note ? (
                              <span className="mt-2 inline-flex w-fit rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-[#e8d9b4] sm:mt-3 sm:px-2.5 sm:text-[0.66rem]">
                                {ticket.note}
                              </span>
                            ) : null}

                            <h4 className="mt-2 text-[0.82rem] font-black leading-[1.15] text-[#f7efdc] sm:mt-3 sm:text-[1.18rem]">
                              <span className="sm:hidden">{ticket.mobileName}</span>
                              <span className="hidden sm:inline">{ticket.name}</span>
                            </h4>
                            <p className="mt-1.5 text-[0.68rem] leading-[1.35] text-[#efe4c8]/86 sm:mt-2 sm:text-[0.92rem]">
                              <span className="sm:hidden">{ticket.mobileDescription}</span>
                              <span className="hidden sm:inline">{ticket.description}</span>
                            </p>

                            {infoOpen ? (
                              <div className="mt-3 rounded-[18px] border border-[#d6c388]/18 bg-[rgba(8,18,11,.3)] px-3 py-2.5 text-[0.7rem] leading-[1.35] text-[#efe4c8]/82 sm:px-3.5 sm:py-3 sm:text-[0.78rem] sm:leading-[1.45]">
                                {ticket.details}
                              </div>
                            ) : null}

                            {quantity > 0 && selectedTicketState?.switchMessage ? (
                              <div className="mt-3 rounded-[16px] border border-[#8fad5e]/28 bg-[rgba(122,166,74,.12)] px-3 py-2 text-[0.68rem] leading-[1.35] text-[#dbe8be] sm:text-[0.74rem]">
                                {selectedTicketState.switchMessage}
                              </div>
                            ) : null}

                            <div className="mt-auto pt-3 sm:pt-4">
                              {quantity === 0 ? (
                                <button
                                  type="button"
                                  className={
                                    ticket.button === "cream"
                                      ? "btn-cream min-h-[40px] w-full text-[0.74rem] sm:min-h-[44px] sm:text-base"
                                      : "btn-forest min-h-[40px] w-full text-[0.74rem] sm:min-h-[44px] sm:text-base"
                                  }
                                  onClick={() => updateTicketQuantity(ticket.id, 1)}
                                >
                                  Выбрать билет
                                </button>
                              ) : (
                                <div className="rounded-[18px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.06)] p-2.5 sm:rounded-[20px] sm:p-3">
                                  <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4] sm:text-[0.72rem]">Выбрано</div>
                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f7efdc] sm:h-10 sm:w-10"
                                      onClick={() => updateTicketQuantity(ticket.id, -1)}
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <strong className="text-[0.84rem] text-[#f7efdc] sm:text-[0.92rem]">{quantity}</strong>
                                    <button
                                      type="button"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f7efdc] sm:h-10 sm:w-10"
                                      onClick={() => updateTicketQuantity(ticket.id, 1)}
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="booking-mobile-date-grid mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                      {dateOptions.map((date) => {
                        const isSelected = selectedDateId === date.id;
                        return (
                          <button
                            key={date.id}
                            type="button"
                            className={clsx(
                              "aspect-square rounded-[18px] border p-2.5 text-left transition sm:rounded-[20px] sm:p-3.5",
                              isSelected ? "border-[#a7c873] bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(69,101,41,.22)_100%)]" : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)]"
                            )}
                            onClick={() => setSelectedDateId(date.id)}
                          >
                            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#e8d9b4] sm:text-[0.7rem]">{date.weekdayLabel}</div>
                            <div className="mt-2 text-[0.92rem] font-black leading-[1.1] text-[#f7efdc] sm:text-[1.02rem]">{date.dayLabel}</div>
                            <p className="mt-1.5 text-[0.62rem] leading-[1.2] text-[#efe4c8]/74 sm:text-[0.7rem]">{date.compactLabel.replace("\n", " ")}</p>
                            <div className="mt-2 text-[0.58rem] font-semibold leading-[1.2] text-[#dbe8be]">Свободно</div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="mt-5">
                      <div className="booking-mobile-time-grid grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            className={clsx(
                              "rounded-[22px] border p-4 text-left transition",
                              selectedTime === slot.time
                                ? "border-[#a7c873] bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(69,101,41,.22)_100%)]"
                                : "border-[#d6c388]/24 bg-[rgba(255,255,255,.05)]",
                              slot.disabled && "cursor-not-allowed opacity-45"
                            )}
                            disabled={slot.disabled}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            <div className="flex items-center gap-2 text-[#f7efdc]">
                              <Clock3 size={16} />
                              <strong className="text-[0.96rem]">{slot.time}</strong>
                            </div>
                            <div className="mt-2 text-[0.76rem] leading-[1.35] text-[#efe4c8]/78">
                              {slot.disabled ? "Недостаточно мест" : `Свободно ${slot.remainingGuests}`}
                            </div>
                            {slot.isHappyHour ? (
                              <div className="mt-2 inline-flex rounded-full border border-[#a7c873]/35 bg-[rgba(122,166,74,.16)] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-[#dbe8be]">
                                Счастливый час
                              </div>
                            ) : null}
                          </button>
                        ))}
                      </div>

                      {bookingSwitchNotice ? (
                        <div className="mt-4 rounded-[22px] border border-[#8fad5e]/28 bg-[rgba(122,166,74,.12)] px-4 py-3 text-[0.83rem] leading-[1.45] text-[#edf6df]">
                          {bookingSwitchNotice}
                        </div>
                      ) : null}

                      <div className="mt-4 rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.83rem] leading-[1.45] text-[#efe4c8]/82">
                        Все визиты проходят по фиксированным слотам: 11:00, 13:00, 15:00, 17:00 и 19:00. Длительность каждого визита 1 час.
                        Метка счастливого часа появляется только на тех слотах, которые сейчас включены в админке на выбранную дату.
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="mt-5">
                      <div className="grid gap-3 sm:grid-cols-2">
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
                          <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Email</span>
                          <input
                            className="field-paper rounded-2xl px-4 py-3"
                            placeholder="mail@example.com"
                            value={contactValues.email}
                            onChange={(event) => updateContactField("email", event.target.value)}
                          />
                          {fieldErrors.email ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.email}</span> : null}
                        </label>

                        <label className="block sm:col-span-2">
                          <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Комментарий</span>
                          <textarea
                            className="field-paper min-h-[108px] rounded-2xl px-4 py-3"
                            placeholder="Пожелания к визиту"
                            value={contactValues.comment}
                            onChange={(event) => updateContactField("comment", event.target.value)}
                          />
                          {fieldErrors.comment ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.comment}</span> : null}
                        </label>
                      </div>

                      <div className="mt-3 rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#efe4c8]/84">
                        Проверьте данные перед отправкой заявки: дата, время и выбранные билеты будут указаны в бронировании.
                      </div>

                      <div className="mt-4 space-y-3">
                        <div
                          className={clsx(
                            "rounded-[22px] border bg-[rgba(255,255,255,.05)] p-4 transition",
                            consentErrors.terms ? "border-[#c97f7f]/55 bg-[rgba(120,38,38,.18)]" : "border-[#d6c388]/18"
                          )}
                        >
                          <input
                            id="booking-terms-consent"
                            type="checkbox"
                            className="peer sr-only"
                            checked={consentValues.terms}
                            onChange={(event) => updateConsentField("terms", event.target.checked)}
                          />
                          <label htmlFor="booking-terms-consent" className="flex cursor-pointer items-start gap-3">
                            <span
                              className={clsx(
                                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border transition",
                                consentValues.terms
                                  ? "border-[#a7c873] bg-[linear-gradient(180deg,#8cb85b_0%,#5f8337_100%)] text-[#f7efdc]"
                                  : "border-[#d6c388]/55 bg-[rgba(255,255,255,.04)] text-transparent"
                              )}
                            >
                              <Check size={14} />
                            </span>
                            <span className="text-[0.92rem] leading-[1.55] text-[#f6efdb]">
                              Я даю согласие на{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={personalDataHref}
                                onMouseDown={handleLegalLinkIntent}
                                onTouchStart={handleLegalLinkIntent}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLegalLinkIntent();
                                }}
                              >
                                обработку моих персональных данных
                              </Link>
                              .
                            </span>
                          </label>
                          {consentErrors.terms ? <span className="mt-2 block pl-9 text-[0.76rem] text-[#ffb3b3]">{consentErrors.terms}</span> : null}
                        </div>

                        <div
                          className={clsx(
                            "rounded-[22px] border bg-[rgba(255,255,255,.05)] p-4 transition",
                            consentErrors.personalData ? "border-[#c97f7f]/55 bg-[rgba(120,38,38,.18)]" : "border-[#d6c388]/18"
                          )}
                        >
                          <input
                            id="booking-personal-data-consent"
                            type="checkbox"
                            className="peer sr-only"
                            checked={consentValues.personalData}
                            onChange={(event) => updateConsentField("personalData", event.target.checked)}
                          />
                          <label htmlFor="booking-personal-data-consent" className="flex cursor-pointer items-start gap-3">
                            <span
                              className={clsx(
                                "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border transition",
                                consentValues.personalData
                                  ? "border-[#a7c873] bg-[linear-gradient(180deg,#8cb85b_0%,#5f8337_100%)] text-[#f7efdc]"
                                  : "border-[#d6c388]/55 bg-[rgba(255,255,255,.04)] text-transparent"
                              )}
                            >
                              <Check size={14} />
                            </span>
                            <span className="text-[0.92rem] leading-[1.55] text-[#f6efdb]">
                              Я принимаю{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={siteTermsHref}
                                onMouseDown={handleLegalLinkIntent}
                                onTouchStart={handleLegalLinkIntent}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLegalLinkIntent();
                                }}
                              >
                                условия использования
                              </Link>
                              {", "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={privacyHref}
                                onMouseDown={handleLegalLinkIntent}
                                onTouchStart={handleLegalLinkIntent}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLegalLinkIntent();
                                }}
                              >
                                политику конфиденциальности
                              </Link>
                              {" "}и{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={publicOfferHref}
                                onMouseDown={handleLegalLinkIntent}
                                onTouchStart={handleLegalLinkIntent}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLegalLinkIntent();
                                }}
                              >
                                публичную оферту
                              </Link>
                              .
                            </span>
                          </label>
                          {consentErrors.personalData ? (
                            <span className="mt-2 block pl-9 text-[0.76rem] text-[#ffb3b3]">{consentErrors.personalData}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-[24px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] p-4 sm:p-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Билеты</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">
                              {selectedTickets.length ? selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ") : "Не выбраны"}
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
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Имя</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.name || "Не указано"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Телефон</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.phone || "Не указан"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Email</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.email || "Не указан"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Длительность</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">1 час</strong>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#8fad5e]/38 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.2)_100%)] p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cfe6a0]/35 bg-[rgba(255,255,255,.08)] text-[#f7efdc]">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#dbe8be]">Оплата</div>
                            <h4 className="mt-2 text-[1.1rem] font-black text-[#f7efdc]">Предоплата 500 ₽ за каждое место</h4>
                            <p className="mt-2 text-[0.88rem] leading-[1.5] text-[#edf6df]">
                              На сайте оплачивается только предварительная оплата: {formatCurrency(BOOKING_PREPAYMENT_PER_GUEST)} за каждое место.
                              Сейчас вы вносите {formatCurrency(prepaymentNow)}, остаток {formatCurrency(remainingOnSite)} оплачивается на месте.
                            </p>
                            {happyHourDiscountAmount > 0 ? (
                              <p className="mt-2 text-[0.82rem] font-semibold leading-[1.45] text-[#dbe8be]">
                                Скидка счастливого часа уже учтена: -{formatCurrency(happyHourDiscountAmount)}.
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {stepError ? (
                    <p className="mt-4 flex items-start gap-2 rounded-2xl border border-[#8d5a5a]/55 bg-[rgba(95,23,23,.24)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#ffd6d6]">
                      <CircleAlert size={18} className="mt-0.5 shrink-0" />
                      <span>{stepError}</span>
                    </p>
                  ) : null}

                  <div className="mt-5 hidden items-center justify-between gap-3 border-t border-[#d6c388]/16 pt-4 lg:flex">
                    <div className="rounded-[20px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-4 py-3">
                      <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Сейчас в заказе</div>
                      <div className="mt-1 text-[0.86rem] font-bold text-[#f6efdb]">{mobileSelectionNote}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn-cream min-h-[44px] px-4" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                        Назад
                      </button>
                      {step < bookingSteps.length - 1 ? (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={() => goToStep(step + 1)}>
                          Продолжить
                        </button>
                      ) : (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={finalizeBooking} disabled={isSubmitting}>
                          Оплатить
                        </button>
                      )}
                    </div>
                  </div>
              </div>

              <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden">
                <div className="mx-auto max-w-[780px] rounded-[26px] border border-[#d6c388]/28 bg-[rgba(12,25,15,.96)] p-3 shadow-[0_18px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
                  <div className="booking-mobile-payment-summary mb-3 flex items-center justify-between gap-3 rounded-[18px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                    <div>
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Ваш визит</div>
                      <div className="mt-1 text-[0.82rem] leading-[1.3] text-[#f6efdb]">
                        {selectedDate?.dayLabel ?? "Дата не выбрана"} · {selectedTimeLabel} · {totalTicketsCount || 0} бил.
                      </div>
                      <div className="mt-1 text-[0.7rem] leading-[1.25] text-[#efe4c8]/72">
                        Всего {formatCurrency(total)} · на месте {formatCurrency(remainingOnSite)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#e8d9b4]">Предоплата</div>
                      <strong className="mt-1 block text-[1rem] text-[#f7efdc]">{formatCurrency(prepaymentNow)}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn-cream min-h-[44px] px-3 text-[0.82rem]" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                      Назад
                    </button>
                    {step < bookingSteps.length - 1 ? (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={() => goToStep(step + 1)}>
                        Продолжить
                      </button>
                    ) : (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={finalizeBooking} disabled={isSubmitting}>
                        Оплатить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="forest-card p-5">
                <div className="border-b border-[#d6c388]/16 pb-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Ваш визит</div>
                  <h3 className="mt-2 text-[1.55rem] font-black text-[#f6efdb]">Сводка заказа</h3>
                  <p className="mt-2 text-[0.86rem] leading-[1.45] text-[#efe4c8]/82">
                    Предоплата на сайте составляет 500 ₽ за каждое место. Остаток оплачивается уже в антикафе.
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  <SummaryRows
                    selectedTickets={selectedTickets}
                    selectedDateLabel={selectedDate?.dayLabel ?? "Выберите"}
                    selectedTimeLabel={selectedTimeLabel}
                    totalTicketsCount={totalTicketsCount}
                    total={total}
                    prepaymentNow={prepaymentNow}
                    remainingOnSite={remainingOnSite}
                    happyHourDiscountAmount={happyHourDiscountAmount}
                  />
                </div>

                <div className="mt-5 rounded-[22px] border border-[#8fad5e]/34 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.18)_100%)] px-4 py-4 text-[0.84rem] leading-[1.45] text-[#edf6df]">
                  Визит проходит по фиксированным слотам и длится 1 час. Пожалуйста, проверьте дату, время и состав билетов перед оплатой.
                </div>

                <div className="mt-4 grid gap-2">
                  <a className="btn-cream min-h-[44px] w-full" href={BOOKING_CONTACTS.phoneHref}>
                    <Phone size={16} />
                    <span className="ml-2">Позвонить</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

