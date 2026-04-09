"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { BOOKING_TIMES, FALLBACK_BOOKING_DATES, getBookingDates } from "@/lib/bookingOptions";

type BookingPlannerProps = {
  onOpenBooking: (defaults?: { date?: string; time?: string }) => void;
};

export default function BookingPlanner({ onOpenBooking }: BookingPlannerProps) {
  const [dateOptions, setDateOptions] = useState<string[]>([...FALLBACK_BOOKING_DATES]);
  const [date, setDate] = useState<string>(FALLBACK_BOOKING_DATES[0]);
  const [time, setTime] = useState<string>(BOOKING_TIMES[2]);

  useEffect(() => {
    setDateOptions(getBookingDates());
  }, []);

  return (
    <section
      id="booking"
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.62)]" />

      <div className="container-x section-content">
        <div className="forest-card">
          <h2 className="section-title">Запись на дату и время</h2>
          <p className="mt-2 text-[#efe4c8]/86">
            Выберите удобный слот и подтвердите запись в 1 клик через модальное окно.
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#efe4c8]/85">
                <CalendarDays size={16} /> Дата
              </div>
              <div className="flex flex-wrap gap-2">
                {dateOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip ${date === d ? "chip-active" : ""}`}
                    onClick={() => setDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#efe4c8]/85">
                <Clock3 size={16} /> Время
              </div>
              <div className="flex flex-wrap gap-2">
                {BOOKING_TIMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`chip ${time === t ? "chip-active" : ""}`}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div whileHover={{ y: -1 }} className="mt-6">
            <button className="btn-forest w-full sm:w-auto" onClick={() => onOpenBooking({ date, time })}>
              Открыть форму записи
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
