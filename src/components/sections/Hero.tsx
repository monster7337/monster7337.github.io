"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type HeroProps = {
  onOpenBooking: () => void;
};

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="forest-section min-h-[100svh] border-t-0 sm:min-h-[calc(100svh-80px)]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/bg/heromobile.webp?v=20260527c"
          alt='Антикафе "В Ёлках"'
          fill
          unoptimized
          priority
          className="object-cover object-[50%_12%] sm:hidden"
        />
        <Image
          src="/bg/hero.webp?v=20260507"
          alt='Антикафе "В Ёлках"'
          fill
          unoptimized
          priority
          className="hidden object-cover object-[33%_42%] sm:block sm:-translate-x-[1%] sm:-translate-y-[2%] sm:scale-[1.08] sm:object-[52%_50%]"
        />
      </div>

      <div className="forest-overlay bg-[rgba(7,17,10,.26)] sm:bg-[rgba(7,17,10,.36)]" />

      <div className="container-x section-content flex min-h-[100svh] flex-col justify-end pb-[148px] pt-24 sm:min-h-[calc(100svh-80px)] sm:justify-center sm:pb-10 sm:pt-10">
        <div className="mx-auto w-full max-w-[360px] sm:max-w-[460px]">
          <div className="mx-auto rounded-[22px] border border-[rgba(236,222,187,.18)] bg-[rgba(9,23,14,.12)] px-3 py-3 text-center shadow-[0_18px_42px_rgba(0,0,0,.20)] backdrop-blur-[6px] sm:rounded-[24px] sm:px-5 sm:py-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[8px] font-bold tracking-[0.14em] text-[#e7dbbb]/80 sm:text-[11px] sm:tracking-[0.18em] sm:text-[#e7dbbb]/82"
            >
              АНТИКАФЕ "В ЁЛКАХ"
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="mt-2 text-[1.12rem] font-black leading-[1.04] tracking-tight text-[#f6efde] drop-shadow-[0_2px_12px_rgba(0,0,0,.45)] sm:text-[1.88rem] sm:leading-[1.04]"
            >
              <span className="sm:hidden">Идеальное место для незабываемого отдыха в кругу семьи или друзей</span>
              <span className="hidden sm:inline">Идеальное место для незабываемого отдыха в кругу семьи или друзей</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mx-auto mt-2 max-w-[228px] text-[0.68rem] font-semibold leading-[1.32] text-[#ffefc8]/90 sm:mt-3 sm:max-w-[410px] sm:text-[0.9rem] sm:font-bold sm:text-[#ffefc8]/94"
            >
              <span className="sm:hidden">Чай, уют и живое общение с животными по предварительной записи.</span>
              <span className="hidden sm:inline">ВНИМАНИЕ! ПОСЕЩЕНИЕ АНТИКАФЕ СТРОГО ПО ПРЕДВАРИТЕЛЬНОЙ ЗАПИСИ!</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-3 grid gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3"
            >
              <button className="btn-forest min-h-9 w-full px-4 text-[0.92rem] sm:min-h-10 sm:min-w-36 sm:w-auto sm:text-sm" onClick={onOpenBooking}>
                Онлайн-запись
              </button>
              <a className="btn-cream min-h-9 w-full px-4 text-[0.92rem] sm:min-h-10 sm:min-w-36 sm:w-auto sm:text-sm" href="#about">
                Узнать больше
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
