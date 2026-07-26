"use client";

import { CircleAlert, Phone, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

type BookingTestingNoticeProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookingTestingNotice({ isOpen, onClose }: BookingTestingNoticeProps) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="presentation">
      <button type="button" className="absolute inset-0 bg-[rgba(4,12,6,.76)] backdrop-blur-sm" aria-label="Закрыть уведомление" onClick={onClose} />
      <section
        className="relative w-full max-w-[590px] overflow-hidden rounded-[32px] border border-[#d6c388]/38 bg-[linear-gradient(145deg,#18381d_0%,#0d1f12_58%,#192719_100%)] p-5 text-[#f7efdc] shadow-[0_28px_90px_rgba(0,0,0,.58)] sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="elki-booking-testing-title"
      >
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#91b95f]/20 blur-3xl" />
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6c388]/25 bg-[rgba(255,255,255,.06)] text-[#f7efdc] transition hover:bg-[rgba(255,255,255,.13)]"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <X size={19} />
        </button>

        <div className="relative pr-12">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#dbe8be]">
            <CircleAlert size={16} />
            Важная информация
          </span>
          <h2 id="elki-booking-testing-title" className="mt-3 max-w-[440px] text-[1.75rem] font-black leading-[1.05] sm:text-[2.15rem]">
            Оплата работает в тестовом режиме
          </h2>
        </div>

        <div className="relative mt-6 space-y-3 text-[0.96rem] leading-[1.58] text-[#efe4c8]/90">
          <p>Можно заполнить форму и перейти на тестовую страницу Альфа-Банка. Реальные деньги списываться не будут.</p>
          <p>Тестовый заказ появится в панели управления, но не займёт место и не попадёт в реальную выручку.</p>
          <a className="btn-cream mt-2 inline-flex min-h-[46px] w-full justify-center" href={BOOKING_CONTACTS.phoneHref}>
            <Phone size={17} />
            <span className="ml-2">Позвонить: {BOOKING_CONTACTS.phone}</span>
          </a>
        </div>

        <button type="button" className="btn-forest relative mt-5 min-h-[46px] w-full" onClick={onClose}>
          Понятно
        </button>
      </section>
    </div>,
    document.body
  );
}
