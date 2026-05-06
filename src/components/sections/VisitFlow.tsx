"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, BadgeCheck, CalendarDays, HeartHandshake, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const steps = [
  {
    icon: BadgeCheck,
    title: "Выберите формат",
    text: "Подберите визит для семьи, пары или компании друзей и проверьте, что входит в стоимость.",
    mobileText: "Подберите визит для семьи, пары или компании.",
  },
  {
    icon: CalendarDays,
    title: "Выберите день и время",
    text: "Мы работаем по предварительной записи, поэтому лучше заранее закрепить удобный час.",
    mobileText: "Закрепите удобные дату и время заранее.",
  },
  {
    icon: Sparkles,
    title: "Подтвердите запись",
    text: "Оставьте контакты, проверьте детали брони и получите подтверждение без лишних звонков.",
    mobileText: "Оставьте контакты и подтвердите визит.",
  },
  {
    icon: HeartHandshake,
    title: "Приезжайте в Ёлки",
    text: "Вас ждут ручные животные, чай, сладости, спокойные фото и уютный лесной уголок в центре города.",
    mobileText: "Приезжайте на час общения, чая и теплых фото.",
  },
];

function getStepStatus(index: number, activeIndex: number) {
  if (index < activeIndex) {
    return "Шаг пройден";
  }

  if (index === activeIndex) {
    return "Сейчас в фокусе";
  }

  return "Следующий шаг";
}

export default function VisitFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);
  const reveal = useScrollRevealMotion({ amount: 0.18, desktopDelayStep: 0.08, desktopDistance: 10 });

  return (
    <section
      id="visit-flow"
      className="forest-section py-12 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div>
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Как проходит визит</h2>
          <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
            <span className="sm:hidden">Четыре коротких шага до теплого часа с животными.</span>
            <span className="hidden sm:inline">Все просто: выберите формат, день и время, а дальше мы будем ждать вас в гости.</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:mt-7">
          <motion.div
            layout
            className="relative grid overflow-hidden rounded-2xl border border-[#d9c891]/45 bg-[linear-gradient(135deg,rgba(17,43,22,.88),rgba(8,22,13,.84))] p-5 shadow-[0_18px_46px_rgba(0,0,0,.34)] backdrop-blur-md md:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] md:gap-6 md:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#a6cf70]/18 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-48 bg-[radial-gradient(circle_at_bottom_right,rgba(232,216,176,.24),transparent_66%)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <span className="w-fit rounded-full border border-[#d9c891]/38 bg-[rgba(255,255,255,.08)] px-3 py-1.5 text-[0.74rem] font-black uppercase text-[#e7d8b1] sm:text-[0.82rem]">
                Плавный путь к визиту
              </span>
              <div className="grid">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className={clsx(
                      "col-start-1 row-start-1 flex flex-col gap-2 transition",
                      index === activeStep ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                    )}
                    animate={{ y: index === activeStep ? 0 : 6 }}
                    aria-hidden={index !== activeStep}
                  >
                    <h3 className="text-[1.75rem] font-black leading-[1.05] text-[#f7efdc] sm:text-[2.35rem]">
                      {step.title}
                    </h3>
                    <p className="max-w-2xl text-[0.9rem] leading-relaxed text-[#efe4c8]/86 sm:text-base">
                      <span className="sm:hidden">{step.mobileText}</span>
                      <span className="hidden sm:inline">{step.text}</span>
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-col justify-center gap-4 md:mt-0">
              <div className="flex items-baseline gap-3">
                <strong className="min-w-[4ch] text-right text-[2.5rem] font-black leading-none text-[#f6efde] sm:text-[3.4rem]">
                  {Math.round(progress)}%
                </strong>
                <span className="text-sm font-bold text-[#e8d9b4]/86">пути открыто</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-[#d9c891]/20 bg-[rgba(239,228,200,.18)] shadow-[inset_0_1px_2px_rgba(0,0,0,.22)]">
                <motion.div
                  className="relative h-full rounded-full bg-[linear-gradient(90deg,#6f9447_0%,#a6cf70_52%,#f1dfaf_100%)] shadow-[0_10px_24px_rgba(95,131,55,.24)] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 170, damping: 22 }}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const progressStep = Math.round(((i + 1) / steps.length) * 100);

              return (
                <motion.button
                  key={step.title}
                  type="button"
                  {...reveal(i)}
                  onClick={() => setActiveStep(i)}
                  onMouseEnter={() => setActiveStep(i)}
                  onFocus={() => setActiveStep(i)}
                  className={clsx(
                    "forest-card relative flex min-h-[228px] flex-col items-start gap-3 overflow-hidden p-4 text-left transition sm:min-h-[266px] sm:p-5",
                    isActive
                      ? "border-[#e1cf9f]/85 bg-[rgba(18,46,24,.72)] shadow-[0_24px_58px_rgba(0,0,0,.42)]"
                      : "hover:-translate-y-1 hover:border-[#e1cf9f]/72"
                  )}
                  aria-pressed={isActive}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="elkah-visit-active-glow"
                      className="pointer-events-none absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#a6cf70]/20 blur-xl"
                    />
                  ) : null}

                  <div className="relative z-10 flex w-full items-center justify-between gap-3">
                    <span className="text-[2rem] font-black leading-none text-[#d8c58f] sm:text-[2.25rem]">0{i + 1}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9c891]/38 bg-[rgba(255,255,255,.08)] text-[#e7d8b1]">
                      <Icon size={20} />
                    </span>
                  </div>

                  <span className="relative z-10 rounded-full border border-[#9ebc6a]/28 bg-[rgba(166,207,112,.1)] px-3 py-1 text-[0.68rem] font-black uppercase text-[#cfe7a3] sm:text-[0.72rem]">
                    {getStepStatus(i, activeStep)}
                  </span>
                  <h3 className="relative z-10 text-[1.05rem] font-black leading-[1.15] text-[#f7efdc] sm:text-[1.18rem]">
                    {step.title}
                  </h3>
                  <p className="relative z-10 text-[0.8rem] leading-relaxed text-[#efe4c8]/82 sm:text-[0.9rem]">
                    <span className="sm:hidden">{step.mobileText}</span>
                    <span className="hidden sm:inline">{step.text}</span>
                  </p>

                  <div className="relative z-10 mt-auto flex w-full items-center justify-between border-t border-[#d9c891]/18 pt-3 text-[0.78rem] font-black text-[#e7d8b1]">
                    <span>{progressStep}% маршрута</span>
                    <ArrowUpRight size={17} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
