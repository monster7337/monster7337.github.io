"use client";

import { AlertTriangle, Baby, Camera, CircleCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const allowed = ["Корм по правилам", "Фото и видео без вспышки", "Посещение с детьми", "Спокойный контакт"];
const forbidden = ["Громкие звуки", "Резкие движения", "Свой корм", "Контакт при признаках аллергии"];

export default function AnimalRules() {
  return (
    <section
      id="rules"
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.64)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Правила общения с животными</h2>
        <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
          <span className="sm:hidden">Коротко: что можно, чего лучше избегать и как сделать визит спокойным.</span>
          <span className="hidden sm:inline">Кратко и понятно: что можно, что нельзя, безопасность детей и рекомендации при аллергии.</span>
        </p>

        <div className="mt-5 grid gap-3 md:mt-6 md:gap-4 lg:grid-cols-2">
          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <CircleCheck size={18} />
              <h3 className="text-[1rem] font-bold sm:text-lg">Можно</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {allowed.map((x) => (
                <span key={x} className="chip chip-active px-2.5 py-1 text-[0.72rem] sm:px-3 sm:py-1.5 sm:text-sm">
                  {x}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <AlertTriangle size={18} />
              <h3 className="text-[1rem] font-bold sm:text-lg">Нельзя</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {forbidden.map((x) => (
                <span key={x} className="chip px-2.5 py-1 text-[0.72rem] sm:px-3 sm:py-1.5 sm:text-sm">
                  {x}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <div className="forest-card flex items-start gap-3 p-3.5 sm:p-5">
            <ShieldCheck size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-[0.78rem] leading-[1.35] text-[#efe4c8]/85 sm:text-sm">Инструктаж перед посещением обязателен.</p>
          </div>
          <div className="forest-card flex items-start gap-3 p-3.5 sm:p-5">
            <Baby size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-[0.78rem] leading-[1.35] text-[#efe4c8]/85 sm:text-sm">Дети до 10 лет в сопровождении взрослых.</p>
          </div>
          <div className="forest-card col-span-2 mx-auto flex w-full max-w-[220px] items-start gap-3 p-3.5 sm:max-w-none sm:p-5 md:col-span-1">
            <Camera size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-[0.78rem] leading-[1.35] text-[#efe4c8]/85 sm:text-sm">Фото можно, вспышку лучше выключить.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
