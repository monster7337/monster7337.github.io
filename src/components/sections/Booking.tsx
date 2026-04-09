"use client";

import { motion } from "framer-motion";

export default function Booking() {
  return (
    <section id="booking" className="container-x py-14">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="glass p-8">
          <h2 className="section-title">Онлайн-запись</h2>
          <p className="muted mt-3">
            Технически: форма готова под отправку в Telegram/CRM/почту (дальше подключишь API).
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="card">
              <div className="font-bold">Скорость</div>
              <div className="muted mt-1">1–2 клика до заявки</div>
            </div>
            <div className="card">
              <div className="font-bold">Конверсия</div>
              <div className="muted mt-1">цена + CTA сразу</div>
            </div>
          </div>
        </div>

        <motion.form
          whileHover={{ y: -1 }}
          className="glass p-8"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Демо: подключим отправку позже (API route / интеграция).");
          }}
        >
          <label className="text-sm muted">Ваше имя</label>
          <input
            className="mt-2 w-full rounded-xl2 bg-white/5 border border-white/10 px-4 py-3 outline-none"
            placeholder="Ирина"
          />

          <label className="text-sm muted mt-4 block">Телефон</label>
          <input
            className="mt-2 w-full rounded-xl2 bg-white/5 border border-white/10 px-4 py-3 outline-none"
            placeholder="+7..."
          />

          <label className="text-sm muted mt-4 block">Сообщение</label>
          <textarea
            className="mt-2 w-full rounded-xl2 bg-white/5 border border-white/10 px-4 py-3 outline-none min-h-[120px]"
            placeholder="Хочу записаться на..."
          />

          <button className="btn-primary w-full mt-5" type="submit">
            Отправить
          </button>

          <p className="text-xs muted mt-3">
            *В проде: валидация, маска телефона, антиспам, отправка в Telegram/CRM.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
