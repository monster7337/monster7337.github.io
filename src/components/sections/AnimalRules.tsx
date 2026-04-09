"use client";

import { AlertTriangle, Baby, Camera, CircleCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const allowed = ["Корм по правилам", "Фото и видео без вспышки", "Посещение с детьми", "Спокойный контакт"];
const forbidden = ["Громкие звуки", "Резкие движения", "Свой корм", "Контакт при признаках аллергии"];

export default function AnimalRules() {
  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.64)]" />

      <div className="container-x section-content">
        <h2 className="section-title">Правила общения с животными</h2>
        <p className="mt-2 max-w-3xl text-[#efe4c8]/86">
          Кратко и понятно: что можно, что нельзя, безопасность детей и рекомендации при аллергии.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <CircleCheck size={18} />
              <h3 className="text-lg font-bold">Можно</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {allowed.map((x) => (
                <span key={x} className="chip chip-active">
                  {x}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <AlertTriangle size={18} />
              <h3 className="text-lg font-bold">Нельзя</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {forbidden.map((x) => (
                <span key={x} className="chip">
                  {x}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="forest-card flex items-start gap-3">
            <ShieldCheck size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-sm text-[#efe4c8]/85">Инструктаж перед посещением обязателен.</p>
          </div>
          <div className="forest-card flex items-start gap-3">
            <Baby size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-sm text-[#efe4c8]/85">Дети до 10 лет в сопровождении взрослых.</p>
          </div>
          <div className="forest-card flex items-start gap-3">
            <Camera size={18} className="mt-0.5 text-[#e7d8b1]" />
            <p className="text-sm text-[#efe4c8]/85">Фото можно, вспышку лучше выключить.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
