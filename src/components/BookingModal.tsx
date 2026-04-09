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
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть окно записи"
            className="absolute inset-0 bg-[rgba(6,16,10,.72)] backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#d0be8e]/70 bg-[rgba(12,30,18,.95)] p-5 text-[#f5eddb] shadow-[0_20px_40px_rgba(0,0,0,.45)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black">Онлайн-запись</h3>
                <p className="mt-1 text-sm text-[#efe4c8]/82">
                  Посещение антикафе строго по предварительной записи.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#ccb889]/65 px-3 py-1 text-sm text-[#efe5cb] hover:bg-[#1f3623]"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-semibold text-[#efe4c8]/85">Дата</div>
                <div className="flex flex-wrap gap-2">
                  {dateOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => onDateChange(d)}
                      className={`chip ${date === d ? "chip-active" : ""}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-[#efe4c8]/85">Время</div>
                <div className="flex flex-wrap gap-2">
                  {BOOKING_TIMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onTimeChange(t)}
                      className={`chip ${time === t ? "chip-active" : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Заявка отправлена: ${date}, ${time}`);
                onClose();
              }}
            >
              <input className="field-paper" placeholder="Ваше имя" />
              <input className="field-paper" placeholder="+7 (___) ___-__-__" />
              <textarea className="field-paper min-h-[96px]" placeholder="Комментарий к визиту" />
              <button className="btn-forest w-full" type="submit">
                Подтвердить запись
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
