"use client";

import { motion } from "framer-motion";
import { Camera, ClipboardCheck, DoorOpen, MessageSquareHeart } from "lucide-react";
import { useMemo, useState } from "react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Запись",
    text: "Выбираете дату и время онлайн или по телефону.",
  },
  {
    icon: MessageSquareHeart,
    title: "2. Инструктаж",
    text: "Коротко объясняем правила и безопасность.",
  },
  {
    icon: Camera,
    title: "3. Общение + чай/фото",
    text: "Знакомство с животными, чай/кофе и уютные фото.",
  },
  {
    icon: DoorOpen,
    title: "4. Завершение",
    text: "Спокойный выход и план следующего визита.",
  },
];

export default function VisitFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title">Как проходит визит</h2>
            <p className="mt-2 max-w-3xl text-[#efe4c8]/86">
              Сценарий 1–2–3–4 снижает вопросы и повышает доверие до бронирования.
            </p>
          </div>

          <div className="w-full max-w-sm">
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

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.42, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                onMouseEnter={() => setActiveStep(i)}
                onFocusCapture={() => setActiveStep(i)}
                className={`forest-card relative pt-6 transition ${isActive ? "border-[#e1cf9f]/80 shadow-[0_14px_34px_rgba(0,0,0,.36)]" : ""}`}
              >
                <div
                  className={`absolute left-4 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold ${
                    isActive
                      ? "border-[#d8c58f]/80 bg-[#789d4f] text-[#f8f2df]"
                      : "border-[#d9c891]/65 bg-[#1a2f1d] text-[#f5e8c8]"
                  }`}
                >
                  {i + 1}
                </div>

                <step.icon size={20} className="text-[#e7d8b1]" />
                <h3 className="mt-3 text-lg font-bold text-[#f7efdc]">{step.title}</h3>
                <p className="mt-2 text-sm text-[#efe4c8]/84">{step.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
