"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type NavbarProps = {
  onOpenBooking: () => void;
};

export default function Navbar({ onOpenBooking }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#a48c4b]/55 bg-[rgba(9,23,14,.84)] backdrop-blur-sm">
      <div className="container-x flex h-14 items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-3">
          <Image src="/logo/elkah-emblem.svg" alt='Логотип "В Ёлках"' width={42} height={42} />
          <div className="leading-none">
            <div className="text-[1.7rem] font-black tracking-tight text-[#f6efde]">В Ёлках</div>
            <div className="text-[10px] text-[#ede4cc]/80">Антикафе с белками и минипигами</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-[0.95rem] font-semibold text-[#f0e7d2]/90 md:flex">
          <a href="#about" className="hover:text-white">
            О нас
          </a>
          <a href="#pricing" className="hover:text-white">
            Тарифы
          </a>
          <a href="#gallery" className="hover:text-white">
            Галерея
          </a>
          <a href="#contacts" className="hover:text-white">
            Контакты
          </a>
        </nav>

        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={onOpenBooking} className="btn-forest px-5 py-2 text-sm">
          Записаться
        </motion.button>
      </div>
    </header>
  );
}
