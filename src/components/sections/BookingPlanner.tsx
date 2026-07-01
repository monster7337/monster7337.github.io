"use client";

import clsx from "clsx";
import { CalendarDays, Check, CircleAlert, Clock3, CreditCard, Info, Minus, Phone, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

const bookingSteps = ["Р‘РёР»РµС‚С‹", "Р”Р°С‚Р°", "Р’СЂРµРјСЏ", "РљРѕРЅС‚Р°РєС‚С‹", "РџРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ"];
const bookingStepNotes = [
  "Р’С‹Р±РµСЂРёС‚Рµ Р±РёР»РµС‚С‹ РЅР° РїРѕСЃРµС‰РµРЅРёРµ",
  "РќР°Р№РґРёС‚Рµ СѓРґРѕР±РЅС‹Р№ РґРµРЅСЊ РІРёР·РёС‚Р°",
  "Р’С‹Р±РµСЂРёС‚Рµ РїРѕРґС…РѕРґСЏС‰РёР№ СЃР»РѕС‚",
  "РћСЃС‚Р°РІСЊС‚Рµ РєРѕРЅС‚Р°РєС‚С‹ РґР»СЏ СЃРІСЏР·Рё",
  "РџСЂРѕРІРµСЂСЊС‚Рµ РїСЂРµРґРѕРїР»Р°С‚Сѓ Рё РґРµС‚Р°Р»Рё",
];

const tariffMap: Record<BookingTicketId, string> = {
  standard: "РћР±С‹С‡РЅС‹Р№ Р±РёР»РµС‚",
  family: "РЎРµРјРµР№РЅС‹Р№ Р±РёР»РµС‚",
  social: "Р›СЊРіРѕС‚РЅС‹Р№ Р±РёР»РµС‚",
  "happy-hour": "РЎС‡Р°СЃС‚Р»РёРІС‹Р№ С‡Р°СЃ",
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
  if (count % 10 === 1 && count % 100 !== 11) return "Р±РёР»РµС‚";
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return "Р±РёР»РµС‚Р°";
  return "Р±РёР»РµС‚РѕРІ";
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
          Р‘РёР»РµС‚С‹
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
                  {ticket.hasHappyHourDiscount ? <div className="mt-1 text-[0.72rem] text-[#dbe8be]">С†РµРЅР° СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР°</div> : null}
                  {ticket.switchMessage ? <div className="mt-1 text-[0.72rem] text-[#dbe8be]">{ticket.switchMessage}</div> : null}
                </div>
                <strong className="shrink-0 text-[0.84rem] text-[#f7efdc]">{formatCurrency(ticket.price * ticket.quantity)}</strong>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5 text-[0.84rem] text-[#efe4c8]/72">
              РџРѕРєР° РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ
            </div>
          )}
        </div>
      </div>

      <div className="summary-group">
        <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
          <CalendarDays size={15} />
          Р”РµС‚Р°Р»Рё РІРёР·РёС‚Р°
        </span>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">Р”Р°С‚Р°</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{selectedDateLabel}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">Р’СЂРµРјСЏ</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{selectedTimeLabel}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
            <span className="text-[0.84rem] text-[#efe4c8]/72">РњРµСЃС‚</span>
            <strong className="text-[0.84rem] text-[#f7efdc]">{totalTicketsCount}</strong>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] p-4">
        <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
          <CreditCard size={15} />
          РћРїР»Р°С‚Р°
        </span>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>РџРѕР»РЅР°СЏ СЃС‚РѕРёРјРѕСЃС‚СЊ</span>
            <strong className="text-[#f7efdc]">{formatCurrency(total)}</strong>
          </div>
          {happyHourDiscountAmount > 0 ? (
            <div className="flex items-center justify-between text-[0.88rem] text-[#dbe8be]">
              <span>РЎРєРёРґРєР° СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР°</span>
              <strong>-{formatCurrency(happyHourDiscountAmount)}</strong>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>РџСЂРµРґРѕРїР»Р°С‚Р° СЃРµР№С‡Р°СЃ</span>
            <strong className="text-[#f7efdc]">{formatCurrency(prepaymentNow)}</strong>
          </div>
          <div className="flex items-center justify-between text-[0.88rem] text-[#efe4c8]/82">
            <span>РћСЃС‚Р°С‚РѕРє РЅР° РјРµСЃС‚Рµ</span>
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
    router.prefetch("/oferta");
    router.prefetch("/privacy");
  }, [router]);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
    if (!raw) return;

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
    }
  }, [dateOptions]);

  useEffect(() => {
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
        ? "Р”Р»СЏ СЌС‚РѕРіРѕ РІСЂРµРјРµРЅРё РґРµР№СЃС‚РІСѓРµС‚ С†РµРЅР° СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР°."
        : switchedToStandard
          ? "Р”Р»СЏ СЌС‚РѕРіРѕ РІСЂРµРјРµРЅРё РґРµР№СЃС‚РІСѓРµС‚ РѕР±С‹С‡РЅР°СЏ С†РµРЅР°."
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
      return `Р’С‹ РІС‹Р±СЂР°Р»Рё СЃС‡Р°СЃС‚Р»РёРІС‹Р№ СЃР»РѕС‚, РїРѕСЌС‚РѕРјСѓ ${switchedToHappyHourCount} ${getTicketWord(switchedToHappyHourCount)} ${switchedToHappyHourCount === 1 ? "РїРµСЂРµС€РµР»" : "РїРµСЂРµС€Р»Рё"} РЅР° С†РµРЅСѓ СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР°.`;
    }

    if (switchedToStandardCount > 0) {
      return `Р”Р»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РІСЂРµРјРµРЅРё СЃС‡Р°СЃС‚Р»РёРІС‹Р№ С‡Р°СЃ РЅРµ РґРµР№СЃС‚РІСѓРµС‚, РїРѕСЌС‚РѕРјСѓ ${switchedToStandardCount} ${getTicketWord(switchedToStandardCount)} ${switchedToStandardCount === 1 ? "РїРµСЂРµС€РµР»" : "РїРµСЂРµС€Р»Рё"} РЅР° РѕР±С‹С‡РЅСѓСЋ С†РµРЅСѓ.`;
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
  const selectedDateLabel = selectedDate ? selectedDate.label : "Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ";
  const selectedTimeLabel = selectedTime || "Р’С‹Р±РµСЂРёС‚Рµ РІСЂРµРјСЏ";
  const mobileSelectionNote =
    totalTicketsCount > 0 ? `${totalTicketsCount} ${getTicketWord(totalTicketsCount)} В· РїСЂРµРґРѕРїР»Р°С‚Р° ${formatCurrency(prepaymentNow)}` : "РЎРѕР±РµСЂРёС‚Рµ РІРёР·РёС‚ РїРѕ С€Р°РіР°Рј";

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
    if (contactValues.name.trim().length < 2) nextErrors.name = "РЈРєР°Р¶РёС‚Рµ РёРјСЏ";
    if (!/^\+?[0-9()\-\s]{10,18}$/.test(contactValues.phone.trim())) nextErrors.phone = "РЈРєР°Р¶РёС‚Рµ С‚РµР»РµС„РѕРЅ РєРѕСЂСЂРµРєС‚РЅРѕ";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValues.email.trim())) nextErrors.email = "РЈРєР°Р¶РёС‚Рµ email РєРѕСЂСЂРµРєС‚РЅРѕ";
    if (contactValues.comment.trim().length > 280) nextErrors.comment = "РљРѕРјРјРµРЅС‚Р°СЂРёР№ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РєРѕСЂРѕС‡Рµ 280 СЃРёРјРІРѕР»РѕРІ";
    if (!consentValues.terms) nextConsentErrors.terms = "РџРѕРґС‚РІРµСЂРґРёС‚Рµ СѓСЃР»РѕРІРёСЏ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ, РїРѕР»РёС‚РёРєСѓ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё Рё РїСѓР±Р»РёС‡РЅСѓСЋ РѕС„РµСЂС‚Сѓ";
    if (!consentValues.personalData) nextConsentErrors.personalData = "РџРѕРґС‚РІРµСЂРґРёС‚Рµ СЃРѕРіР»Р°СЃРёРµ РЅР° РѕР±СЂР°Р±РѕС‚РєСѓ РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…";
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
      setStepError("Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРёРЅ Р±РёР»РµС‚ РїРµСЂРµРґ РѕС‚РїСЂР°РІРєРѕР№.");
      return;
    }

    if (!selectedDate) {
      setStep(1);
      setStepError("Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ РІРёР·РёС‚Р°.");
      return;
    }

    if (!selectedTime || timeSlots.find((slot) => slot.time === selectedTime)?.disabled) {
      setStep(2);
      setStepError("Р’С‹Р±РµСЂРёС‚Рµ РґРѕСЃС‚СѓРїРЅРѕРµ РІСЂРµРјСЏ.");
      return;
    }

    if (familyCount > 0 && familyCount < 3) {
      setStep(0);
      setStepError('Р”Р»СЏ С‚Р°СЂРёС„Р° "РЎРµРјРµР№РЅС‹Р№" РЅСѓР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РјРёРЅРёРјСѓРј 3 Р±РёР»РµС‚Р°.');
      return;
    }

    if (!validateContacts()) {
      setStep(3);
      setStepError("РџСЂРѕРІРµСЂСЊС‚Рµ С‚РµР»РµС„РѕРЅ РїРµСЂРµРґ РѕС‚РїСЂР°РІРєРѕР№ Р·Р°СЏРІРєРё.");
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
        serviceName: `Р’ РЃР»РєР°С…: Р±СЂРѕРЅСЊ ${selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ")}`,
        successPath: `/booking/success?${params.toString()}`,
      });

      window.sessionStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
      window.location.assign(invoice.paymentUrl);
    } catch (error) {
      setStep(2);
      setStepError(error instanceof Error ? error.message : "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ Р·Р°РїРёСЃСЊ.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const ofertaHref = `/oferta?returnTo=${encodeURIComponent("/booking")}`;
  const privacyHref = `/privacy?returnTo=${encodeURIComponent("/booking")}`;
  const siteTermsHref = `${ofertaHref}#section-1`;
  const publicOfferHref = `${ofertaHref}#section-3`;

  function goToStep(nextStep: number) {
    resetStatuses();

    if (nextStep <= step) {
      setStep(nextStep);
      return;
    }

    if (step === 0) {
      if (!selectedTickets.length) {
        setStepError("Р”РѕР±Р°РІСЊС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРёРЅ Р±РёР»РµС‚.");
        return;
      }
      if (familyCount > 0 && familyCount < 3) {
        setStepError('Р”Р»СЏ С‚Р°СЂРёС„Р° "РЎРµРјРµР№РЅС‹Р№" РЅСѓР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РјРёРЅРёРјСѓРј 3 Р±РёР»РµС‚Р°.');
        return;
      }
    }

    if (step === 1 && !selectedDate) {
      setStepError("Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ РІРёР·РёС‚Р°.");
      return;
    }

    if (step === 2 && (!selectedTime || timeSlots.find((slot) => slot.time === selectedTime)?.disabled)) {
      setStepError("Р’С‹Р±РµСЂРёС‚Рµ РґРѕСЃС‚СѓРїРЅРѕРµ РІСЂРµРјСЏ.");
      return;
    }

    if (step === 3 && !validateContacts()) {
      setStepError("РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅС‚Р°РєС‚РЅС‹Рµ РґР°РЅРЅС‹Рµ РїРµСЂРµРґ РїСЂРѕРґРѕР»Р¶РµРЅРёРµРј.");
      return;
    }

    setStep(nextStep);
  }

  return (
    <section
      id="booking"
      className="forest-section scroll-mt-24 py-10 pb-32 sm:py-12 sm:pb-36 lg:py-14 lg:pb-14"
      style={{ backgroundImage: "url('/bg/grass2.webp')" }}
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.72)]" />

      <div className="container-x section-content">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <div className="mx-auto w-full max-w-[780px] lg:max-w-none">
              <div className="forest-card p-4 lg:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Р‘СЂРѕРЅРёСЂРѕРІР°РЅРёРµ</div>
                    <div className="mt-1 text-[1.08rem] font-black text-[#f6efdb]">{bookingSteps[step]}</div>
                    <p className="mt-1 text-[0.82rem] leading-[1.42] text-[#efe4c8]/82">{bookingStepNotes[step]}</p>
                  </div>
                  <div className="rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.72rem] font-bold text-[#f6efdb]">
                    {step + 1} / {bookingSteps.length}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Р‘РёР»РµС‚С‹</div>
                    <div className="mt-1 text-[0.95rem] font-bold text-[#f6efdb]">{totalTicketsCount || 0}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Р”Р°С‚Р°</div>
                    <div className="mt-1 text-[0.9rem] font-bold leading-[1.2] text-[#f6efdb]">{selectedDate?.dayLabel ?? "Р’С‹Р±РµСЂРёС‚Рµ"}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Р’СЂРµРјСЏ</div>
                    <div className="mt-1 text-[0.9rem] font-bold text-[#f6efdb]">{selectedTimeLabel}</div>
                  </div>
                  <div className="rounded-[18px] border border-[#a7c873]/45 bg-[linear-gradient(180deg,rgba(122,166,74,.22)_0%,rgba(78,113,45,.18)_100%)] px-3 py-3">
                    <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#dbe8be]">РЎРµР№С‡Р°СЃ</div>
                    <div className="mt-1 text-[0.95rem] font-black text-[#f6efdb]">{formatCurrency(prepaymentNow)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:mt-0">
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

              <div className="forest-card mt-4 overflow-hidden p-4 sm:p-5 lg:p-6">
                  <div className="border-b border-[#d6c388]/16 pb-4">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">РЁР°Рі {step + 1}</div>
                    <h3 className="mt-2 text-[1.28rem] font-black text-[#f6efdb] sm:text-[1.75rem]">{bookingSteps[step]}</h3>
                    <p className="mt-2 max-w-2xl text-[0.84rem] leading-[1.45] text-[#efe4c8]/82 sm:text-[0.95rem]">{bookingStepNotes[step]}</p>
                  </div>

                  {step === 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
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
                                aria-label={`РџРѕРґСЂРѕР±РЅРµРµ Рѕ С‚Р°СЂРёС„Рµ ${ticket.name}`}
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
                                  Р’С‹Р±СЂР°С‚СЊ Р±РёР»РµС‚
                                </button>
                              ) : (
                                <div className="rounded-[18px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.06)] p-2.5 sm:rounded-[20px] sm:p-3">
                                  <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#e8d9b4] sm:text-[0.72rem]">Р’С‹Р±СЂР°РЅРѕ</div>
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
                    <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
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
                            <div className="mt-2 text-[0.58rem] font-semibold leading-[1.2] text-[#dbe8be]">РЎРІРѕР±РѕРґРЅРѕ</div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="mt-5">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
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
                              {slot.disabled ? "РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РјРµСЃС‚" : `РЎРІРѕР±РѕРґРЅРѕ ${slot.remainingGuests}`}
                            </div>
                            {slot.isHappyHour ? (
                              <div className="mt-2 inline-flex rounded-full border border-[#a7c873]/35 bg-[rgba(122,166,74,.16)] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.06em] text-[#dbe8be]">
                                РЎС‡Р°СЃС‚Р»РёРІС‹Р№ С‡Р°СЃ
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
                        Р’СЃРµ РІРёР·РёС‚С‹ РїСЂРѕС…РѕРґСЏС‚ РїРѕ С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Рј СЃР»РѕС‚Р°Рј: 11:00, 13:00, 15:00, 17:00 Рё 19:00. Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ РєР°Р¶РґРѕРіРѕ РІРёР·РёС‚Р° 1 С‡Р°СЃ.
                        РњРµС‚РєР° СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР° РїРѕСЏРІР»СЏРµС‚СЃСЏ С‚РѕР»СЊРєРѕ РЅР° С‚РµС… СЃР»РѕС‚Р°С…, РєРѕС‚РѕСЂС‹Рµ СЃРµР№С‡Р°СЃ РІРєР»СЋС‡РµРЅС‹ РІ Р°РґРјРёРЅРєРµ РЅР° РІС‹Р±СЂР°РЅРЅСѓСЋ РґР°С‚Сѓ.
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="mt-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">РРјСЏ</span>
                          <input
                            className="field-paper rounded-2xl px-4 py-3"
                            placeholder="РљР°Рє Рє РІР°Рј РѕР±СЂР°С‰Р°С‚СЊСЃСЏ"
                            value={contactValues.name}
                            onChange={(event) => updateContactField("name", event.target.value)}
                          />
                          {fieldErrors.name ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.name}</span> : null}
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">РўРµР»РµС„РѕРЅ</span>
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
                          <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">РљРѕРјРјРµРЅС‚Р°СЂРёР№</span>
                          <textarea
                            className="field-paper min-h-[108px] rounded-2xl px-4 py-3"
                            placeholder="РџРѕР¶РµР»Р°РЅРёСЏ Рє РІРёР·РёС‚Сѓ"
                            value={contactValues.comment}
                            onChange={(event) => updateContactField("comment", event.target.value)}
                          />
                          {fieldErrors.comment ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{fieldErrors.comment}</span> : null}
                        </label>
                      </div>

                      <div className="mt-3 rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#efe4c8]/84">
                        РџСЂРѕРІРµСЂСЊС‚Рµ РґР°РЅРЅС‹Рµ РїРµСЂРµРґ РѕС‚РїСЂР°РІРєРѕР№ Р·Р°СЏРІРєРё: РґР°С‚Р°, РІСЂРµРјСЏ Рё РІС‹Р±СЂР°РЅРЅС‹Рµ Р±РёР»РµС‚С‹ Р±СѓРґСѓС‚ СѓРєР°Р·Р°РЅС‹ РІ Р±СЂРѕРЅРёСЂРѕРІР°РЅРёРё.
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
                              Я принимаю{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={siteTermsHref}
                                onClick={(event) => event.stopPropagation()}
                              >
                                условия использования
                              </Link>
                              {", "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={privacyHref}
                                onClick={(event) => event.stopPropagation()}
                              >
                                политику конфиденциальности
                              </Link>
                              {" "}и{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={publicOfferHref}
                                onClick={(event) => event.stopPropagation()}
                              >
                                публичную оферту
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
                                onClick={(event) => event.stopPropagation()}
                              >
                                условия использования
                              </Link>
                              {", "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={privacyHref}
                                onClick={(event) => event.stopPropagation()}
                              >
                                политику конфиденциальности
                              </Link>
                              {" "}и{" "}
                              <Link
                                prefetch
                                className="font-bold text-[#f2d28c] no-underline underline-offset-4 hover:text-white hover:underline"
                                href={publicOfferHref}
                                onClick={(event) => event.stopPropagation()}
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
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Р‘РёР»РµС‚С‹</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">
                              {selectedTickets.length ? selectedTickets.map((item) => `${item.mobileName} x${item.quantity}`).join(", ") : "РќРµ РІС‹Р±СЂР°РЅС‹"}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Р”Р°С‚Р°</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{selectedDateLabel}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Р’СЂРµРјСЏ</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{selectedTimeLabel}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">РРјСЏ</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.name || "РќРµ СѓРєР°Р·Р°РЅРѕ"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">РўРµР»РµС„РѕРЅ</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.phone || "РќРµ СѓРєР°Р·Р°РЅ"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Email</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">{contactValues.email || "РќРµ СѓРєР°Р·Р°РЅ"}</strong>
                          </div>
                          <div>
                            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ</span>
                            <strong className="mt-1 block text-[0.92rem] leading-[1.45] text-[#f6efdb]">1 С‡Р°СЃ</strong>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#8fad5e]/38 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.2)_100%)] p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cfe6a0]/35 bg-[rgba(255,255,255,.08)] text-[#f7efdc]">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#dbe8be]">РћРїР»Р°С‚Р°</div>
                            <h4 className="mt-2 text-[1.1rem] font-black text-[#f7efdc]">РџСЂРµРґРѕРїР»Р°С‚Р° 500 в‚Ѕ Р·Р° РєР°Р¶РґРѕРµ РјРµСЃС‚Рѕ</h4>
                            <p className="mt-2 text-[0.88rem] leading-[1.5] text-[#edf6df]">
                              РќР° СЃР°Р№С‚Рµ РѕРїР»Р°С‡РёРІР°РµС‚СЃСЏ С‚РѕР»СЊРєРѕ РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅР°СЏ РѕРїР»Р°С‚Р°: {formatCurrency(BOOKING_PREPAYMENT_PER_GUEST)} Р·Р° РєР°Р¶РґРѕРµ РјРµСЃС‚Рѕ.
                              РЎРµР№С‡Р°СЃ РІС‹ РІРЅРѕСЃРёС‚Рµ {formatCurrency(prepaymentNow)}, РѕСЃС‚Р°С‚РѕРє {formatCurrency(remainingOnSite)} РѕРїР»Р°С‡РёРІР°РµС‚СЃСЏ РЅР° РјРµСЃС‚Рµ.
                            </p>
                            {happyHourDiscountAmount > 0 ? (
                              <p className="mt-2 text-[0.82rem] font-semibold leading-[1.45] text-[#dbe8be]">
                                РЎРєРёРґРєР° СЃС‡Р°СЃС‚Р»РёРІРѕРіРѕ С‡Р°СЃР° СѓР¶Рµ СѓС‡С‚РµРЅР°: -{formatCurrency(happyHourDiscountAmount)}.
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
                      <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">РЎРµР№С‡Р°СЃ РІ Р·Р°РєР°Р·Рµ</div>
                      <div className="mt-1 text-[0.86rem] font-bold text-[#f6efdb]">{mobileSelectionNote}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn-cream min-h-[44px] px-4" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                        РќР°Р·Р°Рґ
                      </button>
                      {step < bookingSteps.length - 1 ? (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={() => goToStep(step + 1)}>
                          РџСЂРѕРґРѕР»Р¶РёС‚СЊ
                        </button>
                      ) : (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={finalizeBooking} disabled={isSubmitting}>
                          РћРїР»Р°С‚РёС‚СЊ
                        </button>
                      )}
                    </div>
                  </div>
              </div>

              <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden">
                <div className="mx-auto max-w-[780px] rounded-[26px] border border-[#d6c388]/28 bg-[rgba(12,25,15,.96)] p-3 shadow-[0_18px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-[18px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                    <div>
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">РЎРµР№С‡Р°СЃ</div>
                      <div className="mt-1 text-[0.82rem] leading-[1.3] text-[#f6efdb]">{mobileSelectionNote}</div>
                    </div>
                    <strong className="shrink-0 text-[1rem] text-[#f7efdc]">{formatCurrency(prepaymentNow)}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn-cream min-h-[44px] px-3 text-[0.82rem]" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                      РќР°Р·Р°Рґ
                    </button>
                    {step < bookingSteps.length - 1 ? (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={() => goToStep(step + 1)}>
                        РџСЂРѕРґРѕР»Р¶РёС‚СЊ
                      </button>
                    ) : (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={finalizeBooking} disabled={isSubmitting}>
                        РћРїР»Р°С‚РёС‚СЊ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="forest-card p-5">
                <div className="border-b border-[#d6c388]/16 pb-4">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Р’Р°С€ РІРёР·РёС‚</div>
                  <h3 className="mt-2 text-[1.55rem] font-black text-[#f6efdb]">РЎРІРѕРґРєР° Р·Р°РєР°Р·Р°</h3>
                  <p className="mt-2 text-[0.86rem] leading-[1.45] text-[#efe4c8]/82">
                    РџСЂРµРґРѕРїР»Р°С‚Р° РЅР° СЃР°Р№С‚Рµ СЃРѕСЃС‚Р°РІР»СЏРµС‚ 500 в‚Ѕ Р·Р° РєР°Р¶РґРѕРµ РјРµСЃС‚Рѕ. РћСЃС‚Р°С‚РѕРє РѕРїР»Р°С‡РёРІР°РµС‚СЃСЏ СѓР¶Рµ РІ Р°РЅС‚РёРєР°С„Рµ.
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  <SummaryRows
                    selectedTickets={selectedTickets}
                    selectedDateLabel={selectedDate?.dayLabel ?? "Р’С‹Р±РµСЂРёС‚Рµ"}
                    selectedTimeLabel={selectedTimeLabel}
                    totalTicketsCount={totalTicketsCount}
                    total={total}
                    prepaymentNow={prepaymentNow}
                    remainingOnSite={remainingOnSite}
                    happyHourDiscountAmount={happyHourDiscountAmount}
                  />
                </div>

                <div className="mt-5 rounded-[22px] border border-[#8fad5e]/34 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.18)_100%)] px-4 py-4 text-[0.84rem] leading-[1.45] text-[#edf6df]">
                  Р’РёР·РёС‚ РїСЂРѕС…РѕРґРёС‚ РїРѕ С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Рј СЃР»РѕС‚Р°Рј Рё РґР»РёС‚СЃСЏ 1 С‡Р°СЃ. РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РїСЂРѕРІРµСЂСЊС‚Рµ РґР°С‚Сѓ, РІСЂРµРјСЏ Рё СЃРѕСЃС‚Р°РІ Р±РёР»РµС‚РѕРІ РїРµСЂРµРґ РѕРїР»Р°С‚РѕР№.
                </div>

                <div className="mt-4 grid gap-2">
                  <a className="btn-cream min-h-[44px] w-full" href={BOOKING_CONTACTS.phoneHref}>
                    <Phone size={16} />
                    <span className="ml-2">РџРѕР·РІРѕРЅРёС‚СЊ</span>
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

