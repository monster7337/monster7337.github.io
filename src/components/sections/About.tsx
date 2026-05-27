"use client";

import { motion } from "framer-motion";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const features = [
  {
    icon: "🐿️",
    title: "Белки, минипиги и другие.",
    text: "Ручные животные разных видов и пород, контакт под присмотром и безопасное общение!",
  },
  {
    icon: "☕",
    title: "Угощение для гостей!",
    text: "Чай, кофе, вода, соки и сладости в уютной домашней атмосфере.",
  },
  {
    icon: "🌿",
    title: "Уютная атмосфера",
    text: "Лесной уголок в самом центре Санкт-Петербурга!",
  },
];

const introParagraphs = [
  "Погрузитесь в мир уюта и радости в нашем уникальном антикафе с ручными минипигами и белками разных пород! Эти милые создания ждут вас, чтобы подарить незабываемые моменты и зарядить позитивом.",
  "Уютная атмосфера, чай, кофе, вода, соки, сладости и возможность пообщаться с пушистыми друзьями и крохотными пятачками создают идеальное сочетание для отдыха. Запланируйте визит уже сегодня и откройте для себя новый уровень удовольствия вместе с друзьями и семьей.",
];

export default function About() {
  const reveal = useScrollRevealMotion({ amount: 0.22, desktopDelayStep: 0.08 });

  return (
    <section
      id="about"
      className="forest-section border-b-0 py-10 sm:py-12"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.55)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">О нас</h2>
        <div className="mt-2 h-px bg-[#e8d8b0]/25" />

        {introParagraphs.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`max-w-[980px] leading-relaxed ${index === 0 ? "mt-4" : "mt-3"} text-[0.9rem] text-[#efe4c8]/90 sm:text-[0.98rem] ${index === 0 ? "sm:text-[0.99rem]" : ""}`}
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {features.map((item, idx) => (
            <motion.article
              key={item.title}
              {...reveal(idx)}
              className={`glass-leaf-card p-3.5 sm:p-5 ${idx === 2 ? "col-span-2 mx-auto w-full max-w-[180px] md:col-span-1 md:max-w-none" : ""}`}
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(242,226,191,.4)] bg-[rgba(255,255,255,.1)] text-[1.1rem] sm:h-10 sm:w-10 sm:text-[1.25rem]">
                {item.icon}
              </div>
              <h3 className="mt-2.5 text-[1rem] font-black leading-[1.12] sm:mt-3 sm:text-[1.35rem]">{item.title}</h3>
              <p className="mt-1.5 text-[0.78rem] leading-[1.38] text-[#f0e4c9]/84 sm:mt-2 sm:text-[0.93rem] sm:leading-relaxed">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
