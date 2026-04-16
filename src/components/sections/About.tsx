"use client";

import { motion } from "framer-motion";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const features = [
  {
    icon: "🐿️",
    title: "Белки и минипиги",
    text: "Ручные животные разных пород, контакт под присмотром и безопасные правила общения.",
    mobileText: "Ручные животные и мягкое знакомство под присмотром.",
  },
  {
    icon: "☕",
    title: "Чай/кофе и десерты",
    text: "Чай, кофе, вода, соки и сладости в уютной домашней атмосфере.",
    mobileText: "Чай, кофе и сладости в уютной домашней атмосфере.",
  },
  {
    icon: "🌿",
    title: "Уют и комфорт",
    text: "Идеально для семьи и друзей: отдых, фото и теплые воспоминания.",
    mobileText: "Спокойный отдых, фото и теплые воспоминания.",
  },
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

        <p className="mt-4 max-w-[620px] text-[0.92rem] leading-relaxed text-[#efe4c8]/92 sm:hidden">
          Теплое место, где можно познакомиться с белками и минипигами, спокойно отдохнуть и провести красивый час с близкими.
        </p>
        <p className="mt-5 hidden max-w-[980px] text-[1rem] leading-relaxed text-[#efe4c8]/92 sm:block">
          Погрузитесь в мир уюта и радости в нашем уникальном антикафе с ручными минипигами и
          белками разных пород! Эти милые создания ждут вас, чтобы подарить незабываемые моменты и
          зарядить позитивом. Уютная атмосфера, чай, кофе, вода, соки, сладости и возможность
          пообщаться с пушистыми друзьями и крохотными пятачками — идеальное сочетание для вашего
          отдыха.
        </p>
        <p className="mt-3 hidden max-w-[980px] text-[1rem] leading-relaxed text-[#efe4c8]/88 sm:block">
          Запланируйте визит уже сегодня и откройте для себя новый уровень удовольствия! ✨ Мы
          ждем вас, чтобы вместе создать волшебные воспоминания. Не забудьте пригласить друзей —
          веселье в компании гарантировано!
        </p>

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
              <p className="mt-1.5 text-[0.78rem] leading-[1.38] text-[#f0e4c9]/84 sm:mt-2 sm:text-[0.93rem] sm:leading-relaxed">
                <span className="sm:hidden">{item.mobileText}</span>
                <span className="hidden sm:inline">{item.text}</span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
