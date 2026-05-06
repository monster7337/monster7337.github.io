"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroProps = {
  onOpenBooking: () => void;
};

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="forest-section min-h-[100svh] border-t-0 sm:min-h-[78vh]">
      <div className="absolute inset-0">
        <Image
          src="/bg/hero.png"
          alt='Антикафе "В Ёлках"'
          fill
          priority
          className="object-cover object-[30%_center] sm:object-center"
        />
      </div>
      <div className="forest-overlay bg-[rgba(7,17,10,.3)] sm:bg-[rgba(7,17,10,.44)]" />

      <div className="container-x section-content flex min-h-[100svh] flex-col justify-end pb-8 pt-24 sm:min-h-[78vh] sm:justify-center sm:pb-12 sm:pt-16">
        <div className="mx-auto w-full max-w-[850px]">
          <div className="mx-auto max-w-[350px] rounded-[28px] border border-[rgba(236,222,187,.24)] bg-[rgba(9,23,14,.42)] px-4 py-4 text-center shadow-[0_18px_40px_rgba(0,0,0,.24)] backdrop-blur-xl sm:max-w-[850px] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-bold tracking-[0.18em] text-[#e7dbbb]/82 sm:text-xs sm:tracking-[0.2em] sm:text-[#e7dbbb]/85"
          >
            АНТИКАФЕ &quot;В ЁЛКАХ&quot;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-2 text-[2.15rem] font-black leading-[0.94] tracking-tight text-[#f6efde] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] sm:mt-3 sm:text-[3rem] sm:leading-none sm:text-[3.8rem]"
          >
            <span className="sm:hidden">Тёплый визит с белками и минипигами</span>
            <span className="hidden sm:inline">Место для незабываемого отдыха всей семьей и в компании друзей</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-3 max-w-[280px] text-[0.84rem] font-semibold leading-[1.45] text-[#ffefc8]/94 sm:mt-4 sm:max-w-[760px] sm:text-[1.05rem] sm:font-bold sm:text-[#ffefc8]"
          >
            <span className="sm:hidden">Чай, уют и живое общение с животными по предварительной записи.</span>
            <span className="hidden sm:inline">ВНИМАНИЕ!!! ПОСЕЩЕНИЕ АНТИКАФЕ СТРОГО ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ!!!</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 grid gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
          >
            <button className="btn-forest min-h-[44px] w-full sm:min-w-40 sm:w-auto" onClick={onOpenBooking}>
              Онлайн-запись
            </button>
            <a className="btn-cream min-h-[44px] w-full sm:min-w-40 sm:w-auto" href="#about">
              Узнать больше
            </a>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
