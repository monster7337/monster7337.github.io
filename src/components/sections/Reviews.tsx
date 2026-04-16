"use client";

import { motion } from "framer-motion";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const reviews = [
  { source: "Яндекс", name: "Анна", text: "Очень уютно, животные спокойные, персонал внимательный.", mobileText: "Очень уютно и спокойно.", rate: "5.0" },
  { source: "2ГИС", name: "Кирилл", text: "Приезжали с детьми, всё объяснили, море положительных эмоций.", mobileText: "С детьми было очень комфортно.", rate: "5.0" },
  { source: "VK", name: "Мария", text: "Отличное место для свидания и камерных фото.", mobileText: "Идеально для свидания и фото.", rate: "4.9" },
];

const mentions = ["Instagram отметка @v_elkah", "Telegram stories", "VK фотоотчеты гостей"];

export default function Reviews() {
  const reveal = useScrollRevealMotion({ amount: 0.22, desktopDelayStep: 0.06, desktopDistance: 10 });

  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Отзывы</h2>
        <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
          <span className="sm:hidden">Несколько живых впечатлений гостей о визите.</span>
          <span className="hidden sm:inline">Реальные отзывы и блок “нас отмечают” усиливают доверие перед записью.</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-3 md:gap-4">
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              {...reveal(i)}
              whileHover={{ y: -3 }}
              className={`forest-card min-h-[146px] p-3.5 sm:min-h-0 sm:p-5 ${i === 2 ? "col-span-2 mx-auto w-full max-w-[210px] md:col-span-1 md:max-w-none" : ""}`}
            >
              <div className="flex items-center justify-between text-[0.72rem] text-[#e9dab5] sm:text-sm">
                <span>{r.source}</span>
                <span>★ {r.rate}</span>
              </div>
              <p className="mt-2 text-[0.76rem] leading-[1.38] text-[#f2e8cf]/88 sm:mt-3 sm:text-sm sm:leading-relaxed">
                <span className="sm:hidden">{r.mobileText}</span>
                <span className="hidden sm:inline">{r.text}</span>
              </p>
              <div className="mt-3 text-[0.8rem] font-semibold text-[#f7efdc] sm:mt-4 sm:text-sm">{r.name}</div>
            </motion.article>
          ))}
        </div>

        <div className="mt-4 glass-leaf-card p-4 sm:mt-5 sm:p-5">
          <h3 className="text-[1rem] font-bold text-[#f8f0de] sm:text-lg">Нас отмечают</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {mentions.map((m) => (
              <span key={m} className="chip px-2.5 py-1 text-[0.72rem] sm:px-3 sm:py-1.5 sm:text-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
