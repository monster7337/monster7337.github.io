"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroProps = {
  onOpenBooking: () => void;
};

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="forest-section min-h-[78vh] border-t-0">
      <div className="absolute inset-0">
        <Image
          src="/bg/hero.png"
          alt='Антикафе "В Ёлках"'
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="forest-overlay bg-[rgba(7,17,10,.44)]" />

      <div className="container-x section-content flex min-h-[78vh] flex-col justify-center pb-12 pt-16">
        <div className="mx-auto max-w-[850px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.2em] text-[#e7dbbb]/85"
          >
            АНТИКАФЕ &quot;В ЁЛКАХ&quot;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-3 text-[3rem] font-black leading-none tracking-tight text-[#f6efde] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] sm:text-[3.8rem]"
          >
            Место для незабываемого отдыха всей семьей
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-[760px] text-[1.05rem] font-bold text-[#ffefc8]"
          >
            ВНИМАНИЕ!!! ПОСЕЩЕНИЕ АНТИКАФЕ СТРОГО ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ!!!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="btn-forest min-w-40" onClick={onOpenBooking}>
              Онлайн-запись
            </button>
            <a className="btn-cream min-w-40" href="#about">
              Узнать больше
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
