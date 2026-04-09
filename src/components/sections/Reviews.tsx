"use client";

import { motion } from "framer-motion";

const reviews = [
  { source: "Яндекс", name: "Анна", text: "Очень уютно, животные спокойные, персонал внимательный.", rate: "5.0" },
  { source: "2ГИС", name: "Кирилл", text: "Приезжали с детьми, всё объяснили, море положительных эмоций.", rate: "5.0" },
  { source: "VK", name: "Мария", text: "Отличное место для свидания и камерных фото.", rate: "4.9" },
];

const mentions = ["Instagram отметка @v_elkah", "Telegram stories", "VK фотоотчеты гостей"];

export default function Reviews() {
  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <h2 className="section-title">Отзывы + UGC</h2>
        <p className="mt-2 max-w-3xl text-[#efe4c8]/86">
          Реальные отзывы и блок “нас отмечают” усиливают доверие перед записью.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="forest-card"
            >
              <div className="flex items-center justify-between text-sm text-[#e9dab5]">
                <span>{r.source}</span>
                <span>★ {r.rate}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#f2e8cf]/88">{r.text}</p>
              <div className="mt-4 text-sm font-semibold text-[#f7efdc]">{r.name}</div>
            </motion.article>
          ))}
        </div>

        <div className="mt-5 glass-leaf-card">
          <h3 className="text-lg font-bold text-[#f8f0de]">Нас отмечают</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {mentions.map((m) => (
              <span key={m} className="chip">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
