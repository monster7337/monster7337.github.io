"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🐿️",
    title: "Белки и минипиги",
    text: "Ручные животные разных пород, контакт под присмотром и безопасные правила общения.",
  },
  {
    icon: "☕",
    title: "Чай/кофе и десерты",
    text: "Чай, кофе, вода, соки и сладости в уютной домашней атмосфере.",
  },
  {
    icon: "🌿",
    title: "Уют и комфорт",
    text: "Идеально для семьи и друзей: отдых, фото и теплые воспоминания.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="forest-section border-b-0 py-10 sm:py-12"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.55)]" />

      <div className="container-x section-content">
        <h2 className="section-title">О нас</h2>
        <div className="mt-2 h-px bg-[#e8d8b0]/25" />

        <p className="mt-5 max-w-[980px] text-[1rem] leading-relaxed text-[#efe4c8]/92">
          Погрузитесь в мир уюта и радости в нашем уникальном антикафе с ручными минипигами и
          белками разных пород! Эти милые создания ждут вас, чтобы подарить незабываемые моменты и
          зарядить позитивом. Уютная атмосфера, чай, кофе, вода, соки, сладости и возможность
          пообщаться с пушистыми друзьями и крохотными пятачками — идеальное сочетание для вашего
          отдыха.
        </p>
        <p className="mt-3 max-w-[980px] text-[1rem] leading-relaxed text-[#efe4c8]/88">
          Запланируйте визит уже сегодня и откройте для себя новый уровень удовольствия! ✨ Мы
          ждем вас, чтобы вместе создать волшебные воспоминания. Не забудьте пригласить друзей —
          веселье в компании гарантировано!
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {features.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="glass-leaf-card"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(242,226,191,.4)] bg-[rgba(255,255,255,.1)] text-[1.25rem]">
                {item.icon}
              </div>
              <h3 className="mt-3 text-[1.35rem] font-black">{item.title}</h3>
              <p className="mt-2 text-[0.93rem] leading-relaxed text-[#f0e4c9]/84">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
