"use client";

import { motion } from "framer-motion";

const animals = [
  {
    name: "Лапка",
    type: "Белка",
    mood: "Активная и любопытная",
    loves: "Обожает веточки и мягкие орехи",
    snack: "Любимый снек: фундук",
  },
  {
    name: "Пломбир",
    type: "Минипиг",
    mood: "Спокойный и контактный",
    loves: "Любит, когда чешут спинку",
    snack: "Любимый снек: яблоко",
  },
  {
    name: "Ириска",
    type: "Минипиг",
    mood: "Игривый и дружелюбный",
    loves: "Быстро идет на контакт",
    snack: "Любимый снек: морковь",
  },
];

export default function Animals() {
  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <h2 className="section-title">Животные</h2>
        <p className="mt-2 max-w-3xl text-[#efe4c8]/86">
          Карточки-паспорта: имена, характер и любимые снеки. Больше эмоций и доверия.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {animals.map((a, i) => (
            <motion.article
              key={a.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="glass-leaf-card"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[#dccb9d]">{a.type}</div>
              <h3 className="mt-1 text-2xl font-black text-[#f8f0dd]">{a.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-[#efe4c8]/86">
                <p>{a.mood}</p>
                <p>{a.loves}</p>
                <p className="font-semibold text-[#f5e7c5]">{a.snack}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
