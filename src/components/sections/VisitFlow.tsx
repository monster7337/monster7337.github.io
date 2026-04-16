"use client";

import { motion } from "framer-motion";
import { Camera, ClipboardCheck, DoorOpen, MessageSquareHeart } from "lucide-react";
import { useMemo, useState } from "react";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Запись",
    text: "Выбираете дату и время онлайн или по телефону.",
    mobileTitle: "Запись",
    mobileText: "Выберите день и удобное время.",
  },
  {
    icon: MessageSquareHeart,
    title: "2. Инструктаж",
    text: "Коротко объясняем правила и безопасность.",
    mobileTitle: "Инструктаж",
    mobileText: "Коротко объясним, как вести себя с животными.",
  },
  {
    icon: Camera,
    title: "3. Общение + чай/фото",
    text: "Знакомство с животными, чай/кофе и уютные фото.",
    mobileTitle: "Чай и фото",
    mobileText: "Общение, чай и уютные кадры на память.",
  },
  {
    icon: DoorOpen,
    title: "4. Завершение",
    text: "Спокойный выход и план следующего визита.",
    mobileTitle: "До встречи",
    mobileText: "Спокойно завершаем визит и ждём снова.",
  },
];

export default function VisitFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);
  const reveal = useScrollRevealMotion({ amount: 0.18, desktopDelayStep: 0.08, desktopDistance: 10 });

  return (
    <section
      id="visit-flow"
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Как проходит визит</h2>
            <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
              <span className="sm:hidden">Всего 4 простых шага до теплого часа с животными.</span>
              <span className="hidden sm:inline">Сценарий 1–2–3–4 снижает вопросы и повышает доверие до бронирования.</span>
            </p>
          </div>

          <div className="sm:hidden">
            <div className="inline-flex rounded-full border border-[#d9c891]/42 bg-[rgba(255,255,255,.07)] px-3 py-1.5 text-[0.72rem] font-bold text-[#efe4c8]">
              4 шага до визита
            </div>
          </div>

          <div className="hidden w-full max-w-sm sm:block">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#e8d9b4]/85">
              <span>Прогресс сценария</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[rgba(239,228,200,.22)]">
              <motion.div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#a6cf70_0%,#f1dfaf_100%)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <motion.article
                key={step.title}
                {...reveal(i)}
                whileHover={{ y: -3 }}
                onClick={() => setActiveStep(i)}
                onMouseEnter={() => setActiveStep(i)}
                onFocusCapture={() => setActiveStep(i)}
                className={`forest-card relative min-h-[154px] p-3.5 pt-5 transition sm:pt-6 ${isActive ? "border-[#e1cf9f]/80 shadow-[0_14px_34px_rgba(0,0,0,.36)]" : ""}`}
              >
                <div
                  className={`absolute left-3 top-2 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold sm:left-4 sm:h-6 sm:w-6 sm:text-[11px] ${
                    isActive
                      ? "border-[#d8c58f]/80 bg-[#789d4f] text-[#f8f2df]"
                      : "border-[#d9c891]/65 bg-[#1a2f1d] text-[#f5e8c8]"
                  }`}
                >
                  {i + 1}
                </div>

                <step.icon size={18} className="text-[#e7d8b1] sm:h-5 sm:w-5" />
                <h3 className="mt-2.5 text-[0.96rem] font-bold leading-[1.15] text-[#f7efdc] sm:mt-3 sm:text-lg">
                  <span className="sm:hidden">{step.mobileTitle}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </h3>
                <p className="mt-1.5 text-[0.76rem] leading-[1.35] text-[#efe4c8]/84 sm:mt-2 sm:text-sm">
                  <span className="sm:hidden">{step.mobileText}</span>
                  <span className="hidden sm:inline">{step.text}</span>
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
