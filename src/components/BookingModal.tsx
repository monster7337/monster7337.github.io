"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BOOKING_TIMES, FALLBACK_BOOKING_DATES, getBookingDates } from "@/lib/bookingOptions";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

export default function BookingModal({
  open,
  onClose,
  date,
  time,
  onDateChange,
  onTimeChange,
}: BookingModalProps) {
  const [dateOptions, setDateOptions] = useState<string[]>([...FALLBACK_BOOKING_DATES]);
  const compactDateLabel = (value: string) => value.replace(", ", "\n");

  useEffect(() => {
    setDateOptions(getBookingDates());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть окно записи"
            className="absolute inset-0 bg-[rgba(6,16,10,.78)] backdrop-blur-[3px]"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[100svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-[#d0be8e]/70 bg-[rgba(12,30,18,.97)] text-[#f5eddb] shadow-[0_20px_40px_rgba(0,0,0,.45)] sm:max-h-[92svh] sm:rounded-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#d0be8e]/16 bg-[rgba(12,30,18,.97)] px-4 py-4 backdrop-blur-xl sm:px-5 sm:py-5">
              <div className="min-w-0">
                <h3 className="text-[1.6rem] font-black sm:text-3xl">Онлайн-запись</h3>
                <p className="mt-1 max-w-[250px] text-[0.82rem] leading-[1.4] text-[#efe4c8]/82 sm:max-w-none sm:text-sm">
                  Посещение антикафе строго по предварительной записи.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#ccb889]/65 px-3 text-[0.78rem] font-semibold text-[#efe5cb] hover:bg-[#1f3623] sm:text-sm"
              >
                Закрыть
              </button>
            </div>

            <div className="overflow-y-auto px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pb-5 sm:pt-5">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Дата</div>
                  <div className="mt-1 text-[0.88rem] font-bold leading-[1.2] text-[#f6efdb]">{date}</div>
                </div>
                <div className="rounded-2xl border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-3 py-2.5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Время</div>
                  <div className="mt-1 text-[0.88rem] font-bold leading-[1.2] text-[#f6efdb]">{time}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#d6c388]/32 bg-[rgba(255,255,255,.05)] p-3.5 sm:rounded-2xl sm:p-4">
                  <div className="mb-3 text-[0.8rem] font-semibold text-[#efe4c8]/85 sm:mb-2 sm:text-sm">Дата</div>
                  <div className="grid grid-cols-2 gap-2">
                  {dateOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => onDateChange(d)}
                      className={`min-h-[56px] rounded-[18px] border px-3 py-2 text-left text-[0.76rem] font-semibold leading-[1.15] whitespace-pre-line transition ${
                        date === d
                          ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                          : "border-[#ccb886]/60 bg-[rgba(16,34,20,.56)] text-[#efe3c8]"
                      }`}
                    >
                      <span className="sm:hidden">{compactDateLabel(d)}</span>
                      <span className="hidden sm:inline">{d}</span>
                    </button>
                  ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#d6c388]/32 bg-[rgba(255,255,255,.05)] p-3.5 sm:rounded-2xl sm:p-4">
                  <div className="mb-3 text-[0.8rem] font-semibold text-[#efe4c8]/85 sm:mb-2 sm:text-sm">Время</div>
                  <div className="grid grid-cols-3 gap-2">
                  {BOOKING_TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onTimeChange(t)}
                      className={`min-h-[48px] rounded-[18px] border px-2 py-2 text-center text-[0.78rem] font-semibold transition ${
                        time === t
                          ? "border-[#a7c873] bg-[linear-gradient(180deg,#80a754_0%,#587736_100%)] text-[#f7f3e3]"
                          : "border-[#ccb886]/60 bg-[rgba(16,34,20,.56)] text-[#efe3c8]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Заявка отправлена: ${date}, ${time}`);
                  onClose();
                }}
              >
                <input className="field-paper rounded-2xl px-4 py-3" placeholder="Ваше имя" />
                <input className="field-paper rounded-2xl px-4 py-3" placeholder="+7 (___) ___-__-__" />
                <textarea className="field-paper min-h-[110px] rounded-2xl px-4 py-3" placeholder="Комментарий к визиту" />
                <button className="btn-forest min-h-[48px] w-full" type="submit">
                  Подтвердить запись
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
