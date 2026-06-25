"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, CircleAlert, Gift, Mail, MessageCircle, Minus, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as adminData from "@/components/admin/admin-data";

const GIFT_GUEST_MIN = 1;
const GIFT_GUEST_MAX = 12;
const GIFT_SINGLE_PRICE = 1500;
const GIFT_GROUP_PRICE = 1200;
const GIFT_DRAFT_STORAGE_KEY = "velkah-gift-draft";
const { formatCurrency, giftDeliveryOptions, saveGiftCertificatePurchase } = adminData as unknown as {
  formatCurrency: (value: number) => string;
  giftDeliveryOptions: string[];
  saveGiftCertificatePurchase: (values: Record<string, unknown>) => {
    id: string;
    amount: number;
    purchaserPhone: string;
    recipientName: string;
    certificateTitle: string;
    purchaseDate: string;
    purchaseTime: string;
  };
};

const giftSteps = ["Количество", "Контакты"] as const;
const giftStepNotes = [
  "Выберите, на сколько гостей оформить сертификат",
  "Заполните данные покупателя, получателя и способ отправки",
] as const;

type GiftFormValues = {
  purchaserName: string;
  purchaserPhone: string;
  purchaserEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryMethod: string;
  deliveryContact: string;
  message: string;
  comment: string;
};

type GiftFormErrors = Partial<Record<keyof GiftFormValues, string>>;
type ConsentValues = {
  terms: boolean;
  personalData: boolean;
};

const deliveryMeta: Record<string, { description: string; tone: string }> = {
  Email: { description: "Отправим сертификат на почту получателя.", tone: "email" },
  Telegram: { description: "Можно отправить по нику или ссылке на аккаунт.", tone: "telegram" },
  VK: { description: "Подойдет ссылка на профиль или сообщество.", tone: "vk" },
  Instagram: { description: "Укажите аккаунт или ссылку на профиль.", tone: "instagram" },
  WhatsApp: { description: "Отправим по номеру телефона получателя.", tone: "whatsapp" },
};

const socialDeliveryMethods = new Set(["Telegram", "VK", "Instagram"]);

function getGuestWord(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) return "человек";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "человека";
  return "человек";
}

function getGiftPricePerGuest(guestCount: number) {
  return guestCount >= 3 ? GIFT_GROUP_PRICE : GIFT_SINGLE_PRICE;
}

function getGiftCertificateTitle(guestCount: number) {
  return `Подарочный сертификат на посещение · ${guestCount} ${getGuestWord(guestCount)}`;
}

function DeliveryIcon({ method }: { method: string }) {
  if (method === "Email") return <Mail size={18} />;
  if (method === "Telegram") return <Send size={18} />;
  if (method === "Instagram") return <Camera size={18} />;
  if (method === "WhatsApp") return <MessageCircle size={18} />;
  return <span className="text-[0.8rem] font-black">VK</span>;
}

export default function GiftCertificateOrderForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [guestCount, setGuestCount] = useState(1);
  const [stepError, setStepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentValues, setConsentValues] = useState<ConsentValues>({ terms: false, personalData: false });
  const [consentErrors, setConsentErrors] = useState<Partial<Record<keyof ConsentValues, string>>>({});
  const [values, setValues] = useState<GiftFormValues>({
    purchaserName: "",
    purchaserPhone: "",
    purchaserEmail: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    deliveryMethod: giftDeliveryOptions[0],
    deliveryContact: "",
    message: "",
    comment: "",
  });
  const [errors, setErrors] = useState<GiftFormErrors>({});

  const deliveryMethod = values.deliveryMethod;
  const pricePerGuest = useMemo(() => getGiftPricePerGuest(guestCount), [guestCount]);
  const total = useMemo(() => guestCount * pricePerGuest, [guestCount, pricePerGuest]);
  const certificateTitle = useMemo(() => getGiftCertificateTitle(guestCount), [guestCount]);
  const selectedDeliveryMeta = deliveryMeta[deliveryMethod] ?? deliveryMeta.Email;
  const mobileSelectionNote = `${guestCount} ${getGuestWord(guestCount)} · ${formatCurrency(pricePerGuest)} / чел.`;
  const needsDeliveryContact = socialDeliveryMethods.has(deliveryMethod);

  const deliveryContactLabel =
    deliveryMethod === "Telegram"
      ? "Ник или ссылка в Telegram"
      : deliveryMethod === "VK"
        ? "Ссылка на профиль VK"
        : "Аккаунт или ссылка в Instagram";

  const deliveryContactPlaceholder =
    deliveryMethod === "Telegram" ? "@nickname или t.me/..." : deliveryMethod === "VK" ? "vk.com/..." : "@instagram или instagram.com/...";

  useEffect(() => {
    const raw = window.sessionStorage.getItem(GIFT_DRAFT_STORAGE_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as {
        step?: number;
        guestCount?: number;
        values?: GiftFormValues;
        consentValues?: ConsentValues;
      };

      if (typeof draft.step === "number") {
        setStep(Math.max(0, Math.min(giftSteps.length - 1, draft.step)));
      }
      if (typeof draft.guestCount === "number") {
        setGuestCount(Math.max(GIFT_GUEST_MIN, Math.min(GIFT_GUEST_MAX, draft.guestCount)));
      }
      if (draft.values) {
        setValues(draft.values);
      }
      if (draft.consentValues) {
        setConsentValues(draft.consentValues);
      }
    } catch {
      window.sessionStorage.removeItem(GIFT_DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      GIFT_DRAFT_STORAGE_KEY,
      JSON.stringify({
        step,
        guestCount,
        values,
        consentValues,
      })
    );
  }, [consentValues, guestCount, step, values]);

  function updateGuestCount(nextValue: number) {
    setGuestCount(Math.max(GIFT_GUEST_MIN, Math.min(GIFT_GUEST_MAX, nextValue)));
    setStepError("");
  }

  function updateField(field: keyof GiftFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStepError("");
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function updateConsentField(field: keyof ConsentValues, value: boolean) {
    setConsentValues((current) => ({ ...current, [field]: value }));
    setStepError("");
    if (consentErrors[field]) {
      setConsentErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateForm() {
    const nextErrors: GiftFormErrors = {};
    const nextConsentErrors: Partial<Record<keyof ConsentValues, string>> = {};
    const phonePattern = /^\+?[0-9()\-\s]{10,18}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (values.purchaserName.trim().length < 2) nextErrors.purchaserName = "Введите имя покупателя";
    if (!phonePattern.test(values.purchaserPhone.trim())) nextErrors.purchaserPhone = "Укажите телефон покупателя корректно";
    if (!emailPattern.test(values.purchaserEmail.trim())) nextErrors.purchaserEmail = "Укажите email покупателя корректно";
    if (values.recipientName.trim().length < 2) nextErrors.recipientName = "Введите имя получателя";
    if (!phonePattern.test(values.recipientPhone.trim())) nextErrors.recipientPhone = "Укажите телефон получателя корректно";
    if (!emailPattern.test(values.recipientEmail.trim())) nextErrors.recipientEmail = "Укажите email получателя корректно";
    if (!values.deliveryMethod.trim()) nextErrors.deliveryMethod = "Выберите способ отправки";
    if (needsDeliveryContact && !values.deliveryContact.trim()) nextErrors.deliveryContact = "Укажите контакт для отправки";
    if (values.deliveryContact.trim().length > 120) nextErrors.deliveryContact = "Контакт для отправки должен быть короче 120 символов";
    if (values.message.trim().length > 320) nextErrors.message = "Текст получателю должен быть короче 320 символов";
    if (values.comment.trim().length > 320) nextErrors.comment = "Комментарий должен быть короче 320 символов";
    if (!consentValues.terms) nextConsentErrors.terms = "Подтвердите условия использования, политику конфиденциальности и публичную оферту";
    if (!consentValues.personalData) nextConsentErrors.personalData = "Подтвердите согласие на обработку персональных данных";

    setErrors(nextErrors);
    setConsentErrors(nextConsentErrors);
    return Object.keys(nextErrors).length === 0 && Object.keys(nextConsentErrors).length === 0;
  }

  async function submitGiftOrder() {
    setStepError("");

    if (!validateForm()) {
      setStep(1);
      setStepError("Проверьте контакты получателя, покупателя и способ отправки перед оплатой.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = saveGiftCertificatePurchase({
        ...values,
        certificateId: "gift-visit",
        certificateTitle,
        guestCount,
        pricePerGuest,
        amount: total,
      });

      const params = new URLSearchParams({
        type: "gift",
        bookingId: order.id,
        items: order.certificateTitle,
        date: order.purchaseDate,
        time: order.purchaseTime,
        total: formatCurrency(order.amount),
        prepayment: formatCurrency(order.amount),
        remaining: formatCurrency(0),
        phone: order.purchaserPhone,
        recipient: order.recipientName,
      });

      window.sessionStorage.removeItem(GIFT_DRAFT_STORAGE_KEY);
      router.push(`/booking/success?${params.toString()}`);
    } catch (error) {
      setStepError(error instanceof Error ? error.message : "Не удалось оформить сертификат.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToStep(nextStep: number) {
    setStepError("");

    if (nextStep <= step) {
      setStep(nextStep);
      return;
    }

    if (step === 1 && !validateForm()) {
      setStepError("Проверьте контакты получателя, покупателя и способ отправки перед продолжением.");
      return;
    }

    setStep(nextStep);
  }

  const ofertaHref = `/oferta?returnTo=${encodeURIComponent("/gift-certificates")}`;
  const privacyHref = `/privacy?returnTo=${encodeURIComponent("/gift-certificates")}`;

  return (
    <section
      id="gift-order"
      className="forest-section py-10 pb-32 sm:py-12 sm:pb-36 lg:py-14 lg:pb-14"
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
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Сертификат</div>
                    <div className="mt-1 text-[1.08rem] font-black text-[#f6efdb]">{giftSteps[step]}</div>
                    <p className="mt-1 text-[0.82rem] leading-[1.42] text-[#efe4c8]/82">{giftStepNotes[step]}</p>
                  </div>
                  <div className="rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.72rem] font-bold text-[#f6efdb]">
                    {step + 1} / {giftSteps.length}
                  </div>
                </div>
              </div>

              <div className="mt-4 hidden grid-cols-2 gap-3 lg:grid">
                {giftSteps.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToStep(index)}
                    className={clsx(
                      "rounded-[22px] border px-4 py-3 text-left transition",
                      index === step
                        ? "border-[#a7c873]/45 bg-[rgba(122,166,74,.12)]"
                        : "border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] hover:border-[#d6c388]/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[0.82rem] font-black",
                          index <= step
                            ? "border-[#a7c873]/45 bg-[rgba(122,166,74,.18)] text-[#f7efdc]"
                            : "border-[#d6c388]/28 bg-[rgba(255,255,255,.04)] text-[#efe4c8]"
                        )}
                      >
                        {index < step ? <Check size={15} /> : index + 1}
                      </div>
                      <div>
                        <div className="text-[0.9rem] font-black text-[#f6efdb]">{item}</div>
                        <div className="mt-1 text-[0.78rem] leading-[1.4] text-[#efe4c8]/78">{giftStepNotes[index]}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.24 }}
                  className="forest-card mt-4 p-4 sm:p-5"
                >
                  {step === 0 ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Шаг 1</div>
                        <h2 className="mt-2 text-[1.45rem] font-black text-[#f6efdb] sm:text-[1.8rem]">Соберите сертификат по количеству гостей</h2>
                      </div>

                      <div className="rounded-[28px] border border-[#d6c388]/24 bg-[linear-gradient(180deg,rgba(24,50,16,.76)_0%,rgba(12,26,15,.9)_100%)] p-4 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full border border-[#d6c388]/26 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#e8d9b4]">
                            Сертификат на посещение
                          </span>
                          <span className="rounded-full border border-[#d0a165]/24 bg-[rgba(255,214,164,.08)] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#f2d28c]">
                            До 12 человек
                          </span>
                        </div>

                        <div className="mt-6 text-center">
                          <div className="text-[4.2rem] font-black leading-none text-[#f6efdb] sm:text-[5.4rem]">{guestCount}</div>
                          <div className="mt-2 text-[0.96rem] font-semibold text-[#efe4c8]/86">
                            {guestCount} {getGuestWord(guestCount)} в сертификате
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
                          <button
                            type="button"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] text-[#f6efdb] disabled:opacity-50"
                            onClick={() => updateGuestCount(guestCount - 1)}
                            disabled={guestCount <= GIFT_GUEST_MIN}
                            aria-label="Уменьшить количество гостей"
                          >
                            <Minus size={18} />
                          </button>

                          <input
                            type="range"
                            min={GIFT_GUEST_MIN}
                            max={GIFT_GUEST_MAX}
                            step={1}
                            value={guestCount}
                            onChange={(event) => updateGuestCount(Number(event.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(90deg,rgba(238,199,112,.92),rgba(140,184,91,.92))]"
                            aria-label="Количество гостей в сертификате"
                          />

                          <button
                            type="button"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.05)] text-[#f6efdb] disabled:opacity-50"
                            onClick={() => updateGuestCount(guestCount + 1)}
                            disabled={guestCount >= GIFT_GUEST_MAX}
                            aria-label="Увеличить количество гостей"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[0.78rem] font-semibold text-[#efe4c8]/68">
                          <span>{GIFT_GUEST_MIN}</span>
                          <span>{GIFT_GUEST_MAX}</span>
                        </div>

                        <div className="mt-5 rounded-[22px] border border-[#d6c388]/20 bg-[rgba(255,255,255,.06)] px-4 py-4">
                          <div className="text-[0.8rem] text-[#efe4c8]/74">Сейчас действует</div>
                          <div className="mt-1 text-[1.08rem] font-black text-[#f2d28c]">{formatCurrency(pricePerGuest)} за одного гостя</div>
                          <div className="mt-2 text-[0.82rem] text-[#efe4c8]/78">Полная стоимость сертификата сразу: {formatCurrency(total)}</div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <article className="glass-leaf-card rounded-[24px] p-4">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                            <Gift size={18} />
                          </div>
                          <div className="mt-3 text-[0.96rem] font-black text-[#f6efdb]">Только на посещение</div>
                          <p className="mt-2 text-[0.84rem] leading-[1.55] text-[#efe4c8]/82">Подарочные сертификаты оформляются только на визит в антикафе.</p>
                        </article>

                        <article className="glass-leaf-card rounded-[24px] p-4">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                            <span className="text-[0.86rem] font-black">1-12</span>
                          </div>
                          <div className="mt-3 text-[0.96rem] font-black text-[#f6efdb]">Гибкое количество гостей</div>
                          <p className="mt-2 text-[0.84rem] leading-[1.55] text-[#efe4c8]/82">Количество гостей в сертификате можно выбрать от 1 до 12 человек.</p>
                        </article>

                        <article className="glass-leaf-card rounded-[24px] border-[#e2c55f]/28 p-4">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                            <span className="text-[1rem] font-black">₽</span>
                          </div>
                          <div className="mt-3 text-[0.96rem] font-black text-[#f6efdb]">Простая цена</div>
                          <p className="mt-2 text-[0.84rem] leading-[1.55] text-[#efe4c8]/82">
                            Стоимость сертификата 1 500 ₽ на человека, а для группы от 3 до 12 человек цена снижается до 1 200 ₽ за гостя.
                          </p>
                        </article>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Шаг 2</div>
                        <h2 className="mt-2 text-[1.45rem] font-black text-[#f6efdb] sm:text-[1.8rem]">Укажите, кому и как отправить сертификат</h2>
                      </div>

                      <div className="space-y-4">
                        <section className="rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] p-4">
                          <div className="mb-4">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Покупатель</div>
                            <h3 className="mt-1 text-[1rem] font-black text-[#f6efdb]">Кто оплачивает сертификат</h3>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Имя покупателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="Ваше имя" value={values.purchaserName} onChange={(e) => updateField("purchaserName", e.target.value)} />
                              {errors.purchaserName ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.purchaserName}</span> : null}
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Телефон покупателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="+7 (___) ___-__-__" value={values.purchaserPhone} onChange={(e) => updateField("purchaserPhone", e.target.value)} />
                              {errors.purchaserPhone ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.purchaserPhone}</span> : null}
                            </label>
                            <label className="block sm:col-span-2">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Email покупателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="mail@example.com" value={values.purchaserEmail} onChange={(e) => updateField("purchaserEmail", e.target.value)} />
                              {errors.purchaserEmail ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.purchaserEmail}</span> : null}
                            </label>
                          </div>
                        </section>

                        <section className="rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] p-4">
                          <div className="mb-4">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Получатель</div>
                            <h3 className="mt-1 text-[1rem] font-black text-[#f6efdb]">Для кого готовим подарок</h3>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Имя получателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="Имя получателя" value={values.recipientName} onChange={(e) => updateField("recipientName", e.target.value)} />
                              {errors.recipientName ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.recipientName}</span> : null}
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Телефон получателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="+7 (___) ___-__-__" value={values.recipientPhone} onChange={(e) => updateField("recipientPhone", e.target.value)} />
                              {errors.recipientPhone ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.recipientPhone}</span> : null}
                            </label>
                            <label className="block sm:col-span-2">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Email получателя</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder="mail@example.com" value={values.recipientEmail} onChange={(e) => updateField("recipientEmail", e.target.value)} />
                              {errors.recipientEmail ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.recipientEmail}</span> : null}
                            </label>
                          </div>
                        </section>

                        <section className="rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] p-4">
                          <div className="mb-4">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Отправка</div>
                            <h3 className="mt-1 text-[1rem] font-black text-[#f6efdb]">Выберите удобный способ передачи</h3>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {giftDeliveryOptions.map((option: string) => (
                              <label
                                key={option}
                                className={clsx(
                                  "relative flex min-h-[134px] cursor-pointer flex-col gap-3 rounded-[22px] border p-4 transition",
                                  values.deliveryMethod === option
                                    ? "border-[#a7c873]/42 bg-[rgba(122,166,74,.12)]"
                                    : "border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] hover:border-[#d6c388]/28"
                                )}
                              >
                                <input type="radio" name="gift-delivery-method" className="sr-only" checked={values.deliveryMethod === option} onChange={() => updateField("deliveryMethod", option)} />
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                                  <DeliveryIcon method={option} />
                                </span>
                                <span className="text-[0.96rem] font-black text-[#f6efdb]">{option}</span>
                                <span className="text-[0.82rem] leading-[1.45] text-[#efe4c8]/78">{(deliveryMeta[option] ?? deliveryMeta.Email).description}</span>
                              </label>
                            ))}
                          </div>
                          {errors.deliveryMethod ? <span className="mt-2 block text-[0.76rem] text-[#ffb3b3]">{errors.deliveryMethod}</span> : null}

                          {needsDeliveryContact ? (
                            <label className="mt-3 block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">{deliveryContactLabel}</span>
                              <input className="field-paper rounded-2xl px-4 py-3" placeholder={deliveryContactPlaceholder} value={values.deliveryContact} onChange={(e) => updateField("deliveryContact", e.target.value)} />
                              {errors.deliveryContact ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.deliveryContact}</span> : null}
                            </label>
                          ) : null}
                        </section>

                        <section className="rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] p-4">
                          <div className="mb-4">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Тексты</div>
                            <h3 className="mt-1 text-[1rem] font-black text-[#f6efdb]">Добавьте сообщение и заметку</h3>
                          </div>

                          <div className="grid gap-3">
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Текст получателю</span>
                              <textarea className="field-paper min-h-[110px] rounded-2xl px-4 py-3" placeholder="Напишите поздравление или короткое сообщение" value={values.message} onChange={(e) => updateField("message", e.target.value)} />
                              {errors.message ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.message}</span> : null}
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-[0.82rem] font-semibold text-[#efe4c8]/86">Комментарий</span>
                              <textarea className="field-paper min-h-[96px] rounded-2xl px-4 py-3" placeholder="Детали оформления или пожелания по отправке" value={values.comment} onChange={(e) => updateField("comment", e.target.value)} />
                              {errors.comment ? <span className="mt-1.5 block text-[0.76rem] text-[#ffb3b3]">{errors.comment}</span> : null}
                            </label>
                          </div>
                        </section>

                        <div className="space-y-3">
                          <div
                            className={clsx(
                              "rounded-[22px] border bg-[rgba(255,255,255,.05)] p-4 transition",
                              consentErrors.terms ? "border-[#c97f7f]/55 bg-[rgba(120,38,38,.18)]" : "border-[#d6c388]/18"
                            )}
                          >
                            <input
                              id="gift-terms-consent"
                              type="checkbox"
                              className="sr-only"
                              checked={consentValues.terms}
                              onChange={(event) => updateConsentField("terms", event.target.checked)}
                            />
                            <label htmlFor="gift-terms-consent" className="flex cursor-pointer items-start gap-3">
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
                                <a className="font-bold text-[#f2d28c] underline underline-offset-4 hover:text-white" href={ofertaHref}>
                                  условия использования, политику конфиденциальности и публичную оферту
                                </a>
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
                              id="gift-personal-data-consent"
                              type="checkbox"
                              className="sr-only"
                              checked={consentValues.personalData}
                              onChange={(event) => updateConsentField("personalData", event.target.checked)}
                            />
                            <label htmlFor="gift-personal-data-consent" className="flex cursor-pointer items-start gap-3">
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
                                Я даю согласие на{" "}
                                <a className="font-bold text-[#f2d28c] underline underline-offset-4 hover:text-white" href={privacyHref}>
                                  обработку моих персональных данных
                                </a>
                                .
                              </span>
                            </label>
                            {consentErrors.personalData ? (
                              <span className="mt-2 block pl-9 text-[0.76rem] text-[#ffb3b3]">{consentErrors.personalData}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {stepError ? (
                    <p className="mt-4 flex items-start gap-2 rounded-2xl border border-[#8d5a5a]/55 bg-[rgba(95,23,23,.24)] px-4 py-3 text-[0.84rem] leading-[1.45] text-[#ffd6d6]">
                      <CircleAlert size={18} className="mt-0.5 shrink-0" />
                      <span>{stepError}</span>
                    </p>
                  ) : null}

                  <div className="mt-5 hidden items-center justify-between gap-3 border-t border-[#d6c388]/16 pt-4 lg:flex">
                    <div className="rounded-[20px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-4 py-3">
                      <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Сейчас в сертификате</div>
                      <div className="mt-1 text-[0.86rem] font-bold text-[#f6efdb]">{mobileSelectionNote}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn-cream min-h-[44px] px-4" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                        Назад
                      </button>
                      {step < giftSteps.length - 1 ? (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={() => goToStep(step + 1)}>
                          Продолжить
                        </button>
                      ) : (
                        <button type="button" className="btn-forest min-h-[44px] px-4" onClick={submitGiftOrder} disabled={isSubmitting}>
                          Оплатить сертификат
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] lg:hidden">
                <div className="mx-auto max-w-[780px] rounded-[26px] border border-[#d6c388]/28 bg-[rgba(12,25,15,.96)] p-3 shadow-[0_18px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-[18px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                    <div>
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">Сейчас</div>
                      <div className="mt-1 text-[0.82rem] leading-[1.3] text-[#f6efdb]">{mobileSelectionNote}</div>
                    </div>
                    <strong className="shrink-0 text-[1rem] text-[#f7efdc]">{formatCurrency(total)}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn-cream min-h-[44px] px-3 text-[0.82rem]" disabled={step === 0 || isSubmitting} onClick={() => goToStep(Math.max(0, step - 1))}>
                      Назад
                    </button>
                    {step < giftSteps.length - 1 ? (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={() => goToStep(step + 1)}>
                        Продолжить
                      </button>
                    ) : (
                      <button type="button" className="btn-forest min-h-[44px] px-3 text-[0.82rem]" onClick={submitGiftOrder} disabled={isSubmitting}>
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
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Сводка по сертификату</div>
                  <h3 className="mt-2 text-[1.55rem] font-black text-[#f6efdb]">Что оплатится сейчас</h3>
                  <p className="mt-2 text-[0.86rem] leading-[1.45] text-[#efe4c8]/82">Сертификат оплачивается полностью сразу и после оплаты сразу сохраняется в CRM.</p>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="summary-group">
                    <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
                      <Gift size={15} />
                      Сертификат
                    </span>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Формат</span>
                        <strong className="text-[0.84rem] text-[#f7efdc]">На посещение</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Гостей</span>
                        <strong className="text-[0.84rem] text-[#f7efdc]">
                          {guestCount} {getGuestWord(guestCount)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Цена за гостя</span>
                        <strong className="text-[0.84rem] text-[#f7efdc]">{formatCurrency(pricePerGuest)}</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Отправка</span>
                        <strong className="text-[0.84rem] text-[#f7efdc]">{deliveryMethod}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="summary-group">
                    <span className="flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#e5d5ad]">
                      <Mail size={15} />
                      Контакты
                    </span>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Покупатель</span>
                        <strong className="text-right text-[0.84rem] text-[#f7efdc]">{values.purchaserName || "Укажите на шаге 2"}</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                        <span className="text-[0.84rem] text-[#efe4c8]/72">Получатель</span>
                        <strong className="text-right text-[0.84rem] text-[#f7efdc]">{values.recipientName || "Укажите на шаге 2"}</strong>
                      </div>
                      {values.deliveryContact ? (
                        <div className="flex items-center justify-between rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5">
                          <span className="text-[0.84rem] text-[#efe4c8]/72">Контакт для отправки</span>
                          <strong className="text-right text-[0.84rem] text-[#f7efdc]">{values.deliveryContact}</strong>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] border border-[#8fad5e]/34 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.18)_100%)] px-4 py-4">
                  <div className="text-[0.72rem] uppercase tracking-[0.16em] text-[#dbe8be]">Полная стоимость</div>
                  <div className="mt-2 text-[1.2rem] font-black text-[#f6efdb]">{formatCurrency(total)}</div>
                </div>

                <div className="mt-4 rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-4 py-4 text-[0.84rem] leading-[1.45] text-[#edf6df]">
                  <strong className="block text-[#f6efdb]">{certificateTitle}</strong>
                  <span className="mt-2 block text-[#efe4c8]/82">{selectedDeliveryMeta.description}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
