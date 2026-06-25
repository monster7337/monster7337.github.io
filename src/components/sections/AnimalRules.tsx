"use client";

import { AlertTriangle, CircleCheck, Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const allowed = [
  "Кормить животных предоставляемым антикафе кормом",
  "Фото и видеосъемка без вспышки",
  "Посещение людьми с ограниченными возможностями*",
  "С разрешения инструктора держать животных на руках",
  "Принимать участие в дрессировке животных",
];

const forbidden = [
  "Посещение заведения в алкогольном или наркотическом опьянении",
  "Громкие звуки и резкие движения",
  "Приносить с собой и давать животным свой корм",
  "Приходить со своими животными",
  "Нахождение детей до 12 лет без сопровождения родителей",
  "Жестокое обращение с животными",
  "Контакт при признаках аллергии",
];

const wardrobe = ["удлиненные рукава", "штаны", "брюки", "джинсы из плотных тканей", "спортивная одежда"];
const avoidWardrobe = ["шорты", "футболки", "короткие платья и юбки"];

export default function AnimalRules() {
  return (
    <section
      id="rules"
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass2.webp')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.64)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Правила общения с животными</h2>
        <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
          <span className="sm:hidden">Что разрешено, что запрещено и как подготовиться к визиту.</span>
          <span className="hidden sm:inline">Кратко и понятно: что разрешено, что запрещено и какой гардероб подойдет для контакта с животными.</span>
        </p>

        <div className="mt-5 grid gap-3 md:mt-6 md:gap-4 lg:grid-cols-2">
          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <CircleCheck size={19} className="text-[#b8dc7a]" />
              <h3 className="text-[1rem] font-bold sm:text-lg">У нас можно</h3>
            </div>
            <ol className="mt-3 space-y-2.5">
              {allowed.map((x, index) => (
                <li key={x} className="flex gap-2.5 rounded-xl border border-[#a7c873]/35 bg-[rgba(91,126,53,.22)] px-3 py-2 text-[0.82rem] leading-[1.35] text-[#f7f3e3] sm:text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#86ad58] text-[0.75rem] font-black text-[#102013]">
                    {index + 1}
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="glass-leaf-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[#f7efdc]">
              <AlertTriangle size={19} className="text-[#f1b56c]" />
              <h3 className="text-[1rem] font-bold sm:text-lg">У нас нельзя</h3>
            </div>
            <ol className="mt-3 space-y-2.5">
              {forbidden.map((x, index) => (
                <li key={x} className="flex gap-2.5 rounded-xl border border-[#dfb56a]/35 bg-[rgba(84,42,24,.26)] px-3 py-2 text-[0.82rem] leading-[1.35] text-[#f5e6c8] sm:text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d9ad63] text-[0.75rem] font-black text-[#241708]">
                    {index + 1}
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        <motion.div whileHover={{ y: -2 }} className="forest-card mt-4 overflow-hidden border-[#d9c891]/70 bg-[linear-gradient(135deg,rgba(27,62,37,.78),rgba(108,80,34,.58))] p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#f7efdc]">
                <Shirt size={19} className="text-[#efd38f]" />
                <h3 className="text-[1rem] font-bold sm:text-lg">Рекомендуем</h3>
              </div>
              <p className="mt-2 text-[0.84rem] leading-[1.45] text-[#f6edd7]/90 sm:text-sm">
                Для контакта с животными правильно подбирайте гардероб. Подойдут:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {wardrobe.map((x) => (
                  <span key={x} className="rounded-full border border-[#ead59b]/45 bg-[rgba(244,232,194,.14)] px-3 py-1.5 text-[0.76rem] font-bold text-[#fff3d1] sm:text-sm">
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#e2bd7a]/42 bg-[rgba(33,24,12,.34)] p-3 md:w-[320px]">
              <div className="flex items-center gap-2 text-[#ffe6b3]">
                <Sparkles size={17} />
                <p className="text-[0.78rem] font-black uppercase tracking-[0.14em]">Не рекомендуем</p>
              </div>
              <p className="mt-2 text-[0.82rem] leading-[1.45] text-[#f8e8c8]/88 sm:text-sm">
                {avoidWardrobe.join(", ")}.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
