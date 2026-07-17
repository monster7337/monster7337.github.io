"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Camera, Coffee, Leaf, Squirrel, Users } from "lucide-react";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const badges = [
  { icon: Users, label: "Для детей и взрослых" },
  { icon: Camera, label: "Уютная фотозона" },
  { icon: CalendarDays, label: "По предварительной записи" },
];

const cards = [
  {
    icon: Squirrel,
    title: "Белки, минипиги и другие.",
    text: "Ручные животные разных видов и пород, контакт под присмотром и безопасное общение!",
  },
  {
    icon: Coffee,
    title: "Угощение для гостей!",
    text: "Чай, кофе, вода, соки и сладости в уютной домашней атмосфере.",
  },
  {
    icon: Leaf,
    title: "Уютная атмосфера",
    text: "Лесной уголок в самом центре Санкт-Петербурга!",
  },
];

export default function About() {
  const reveal = useScrollRevealMotion({ amount: 0.2, desktopDelayStep: 0.08, desktopDistance: 12 });

  return (
    <section
      id="about"
      className="forest-section border-b-0 py-12 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass1.webp')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.58)]" />

      <div className="container-x section-content">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:gap-8">
          <motion.div {...reveal(0)} className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9fbc63]/24 bg-[linear-gradient(180deg,rgba(55,86,34,.52)_0%,rgba(24,42,17,.72)_100%)] px-4 py-2 text-[0.78rem] font-semibold text-[#e9d9ae] sm:text-[0.92rem]">
              <Leaf size={15} />
              Антикафе с минипигами и белками
            </div>

            <h2 className="mt-5 text-[3.1rem] font-semibold leading-[0.92] tracking-[-0.04em] text-[#f8f0dd] sm:text-[5.8rem]">
              О нас
            </h2>

            <div className="mt-5 flex items-center gap-3 text-[#d9c378]">
              <div className="h-px w-16 bg-[#d9c378]/75 sm:w-20" />
              <Leaf size={16} />
            </div>

            <div className="mt-5 max-w-[680px] space-y-4 text-[0.96rem] leading-[1.62] text-[#efe4c8]/88 sm:text-[1.08rem]">
              <p>
                Погрузитесь в атмосферу уюта и радости в нашем антикафе с ручными минипигами и белками. Здесь вас ждут живое
                общение с животными, красивые кадры и по-настоящему тёплая обстановка.
              </p>
              <p>
                Мы создали место, куда приятно прийти с друзьями, семьёй или просто за новыми эмоциями. Чай, кофе, соки,
                вода и сладости помогают сделать каждый визит ещё комфортнее и душевнее.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {badges.map((badge, idx) => (
                <motion.div
                  key={badge.label}
                  {...reveal(idx + 1)}
                  className={`flex items-center gap-3 rounded-[18px] border border-[#9fbc63]/24 bg-[linear-gradient(180deg,rgba(55,86,34,.52)_0%,rgba(24,42,17,.72)_100%)] px-3 py-3 backdrop-blur-sm ${
                    idx === 2 ? "col-span-2 mx-auto w-full max-w-[220px] sm:col-span-1 sm:max-w-none" : ""
                  }`}
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c5d882]/32 bg-[rgba(255,255,255,.05)] text-[#d7cf6c]">
                    <badge.icon size={18} />
                  </div>
                  <span className="text-[0.78rem] font-semibold leading-[1.18] text-[#efe4c8] sm:text-[0.92rem]">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(2)} className="relative">
            <div className="relative overflow-hidden rounded-[30px] border border-[#d7c37e]/42 bg-[rgba(16,28,15,.45)] shadow-[0_24px_48px_rgba(0,0,0,.28)]">
              <div className="relative aspect-[1.02/1] sm:aspect-[1.14/1]">
                <Image
                  src="/bg/aboutus.webp"
                  alt="Интерьер антикафе В Ёлках"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
          {cards.map((card, idx) => (
            <motion.article
              key={card.title}
              {...reveal(idx + 3)}
              className={`glass-leaf-card rounded-[26px] p-4 sm:p-6 ${
                idx === 2 ? "col-span-2 mx-auto w-full max-w-[220px] md:col-span-1 md:max-w-none" : ""
              }`}
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                <card.icon size={26} />
              </div>
              <h3 className="mt-4 text-[1.15rem] font-semibold leading-[1.2] text-[#f4ead3] sm:text-[1.42rem]">{card.title}</h3>
              <p className="mt-3 text-[0.88rem] leading-[1.6] text-[#efe4c8]/82 sm:text-[1rem]">{card.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
