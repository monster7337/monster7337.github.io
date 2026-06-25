"use client";

import { Clock3, HeartHandshake, Sparkles, Stars, PartyPopper, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const differences = [
  {
    icon: HeartHandshake,
    title: "Профессиональный уход за животными",
    description:
      "Для нас важны не только впечатления гостей, но и спокойствие животных. Мы внимательно следим за режимом, условиями содержания, питанием и форматом общения в зале.",
    mobileDescription: "Следим за уходом, режимом и комфортом животных каждый день.",
  },
  {
    icon: Clock3,
    title: "Перерывы на отдых между визитами",
    description:
      "После каждого слота у животных есть обязательный перерыв на отдых и восстановление. Это помогает сохранять комфортную атмосферу и бережный ритм посещений.",
    mobileDescription: "После каждого слота у животных есть обязательный отдых.",
  },
  {
    icon: Sparkles,
    title: "Уборка и контроль пространства",
    description:
      "Перед следующими гостями мы приводим зал в порядок, следим за чистотой поверхностей и поддерживаем аккуратную, безопасную среду для людей и животных.",
    mobileDescription: "Поддерживаем чистоту, порядок и спокойную среду в зале.",
  },
];

const occasions = [
  {
    icon: PartyPopper,
    title: "Дни рождения и праздники",
    description: "«В Ёлках» подходит для дней рождения, семейных встреч и уютных праздников без суеты.",
    mobileDescription: "Подходит для дня рождения и семейного праздника.",
  },
  {
    icon: Stars,
    title: "Девичники и пижамные вечеринки",
    description: "Можно собраться с подругами и провести вечер в уютной, легкой атмосфере.",
    mobileDescription: "Уютный и легкий вечер с подругами.",
  },
  {
    icon: Heart,
    title: "Корпоративы и романтические вечера",
    description: "Пространство подходит и для пары, и для небольшой компании, которая хочет провести время необычно.",
    mobileDescription: "Необычный формат для пары или небольшой компании.",
  },
];

export default function Differences() {
  const reveal = useScrollRevealMotion({ amount: 0.16, desktopDelayStep: 0.07, desktopDistance: 12 });

  return (
    <section
      id="differences"
      className="forest-section border-b-0 py-12 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass2.webp')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <motion.div {...reveal(0)} className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
            О нас
          </div>
          <h2 className="mt-4 text-[1.95rem] font-black leading-[1.06] text-[#f6efde] sm:text-[2.75rem]">
            Наши принципиальные отличия от других подобных пространств
          </h2>
          <p className="mt-3 text-[0.92rem] leading-[1.6] text-[#efe4c8]/84 sm:text-[1rem]">
            Для нас важны не только впечатления гостей, но и профессиональный уход, режим отдыха животных и спокойная среда
            внутри пространства.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
          {differences.map((item, index) => (
            <motion.article key={item.title} {...reveal(index + 1)} className="glass-leaf-card rounded-[26px] p-4 sm:p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                <item.icon size={26} />
              </div>
              <h3 className="mt-4 text-[1.02rem] font-black leading-[1.22] text-[#f4ead3] sm:text-[1.32rem]">{item.title}</h3>
              <p className="mt-3 text-[0.86rem] leading-[1.62] text-[#efe4c8]/82 sm:text-[0.98rem]">
                <span className="sm:hidden">{item.mobileDescription}</span>
                <span className="hidden sm:inline">{item.description}</span>
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div {...reveal(4)} className="mx-auto mt-10 max-w-[760px] text-center sm:mt-12">
          <div className="inline-flex rounded-full border border-[#d6c388]/22 bg-[rgba(255,255,255,.05)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
            Форматы визита
          </div>
          <h3 className="mt-4 text-[1.5rem] font-black leading-[1.12] text-[#f6efde] sm:text-[2rem]">«В Ёлках» подходит не только для обычного визита</h3>
          <p className="mt-3 text-[0.9rem] leading-[1.6] text-[#efe4c8]/82 sm:text-[0.98rem]">
            К нам приходят не только ради знакомства с животными, но и ради встреч, необычных вечеров и спокойных праздников.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
          {occasions.map((item, index) => (
            <motion.article key={item.title} {...reveal(index + 5)} className="glass-leaf-card rounded-[26px] p-4 sm:p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                <item.icon size={26} />
              </div>
              <h3 className="mt-4 text-[1.02rem] font-black leading-[1.22] text-[#f4ead3] sm:text-[1.32rem]">{item.title}</h3>
              <p className="mt-3 text-[0.86rem] leading-[1.62] text-[#efe4c8]/82 sm:text-[0.98rem]">
                <span className="sm:hidden">{item.mobileDescription}</span>
                <span className="hidden sm:inline">{item.description}</span>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
