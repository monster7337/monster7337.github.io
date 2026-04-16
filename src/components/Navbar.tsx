"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

type NavbarProps = {
  onOpenBooking: () => void;
};

export default function Navbar({ onOpenBooking }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#a48c4b]/55 bg-[rgba(9,23,14,.84)] backdrop-blur-sm">
      <div className="container-x flex h-[62px] items-center justify-between gap-3 md:h-14 md:gap-4">
        <a href="#" className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <Image src="/logo/elkah-emblem.svg" alt='Логотип "В Ёлках"' width={42} height={42} />
          <div className="min-w-0 leading-none">
            <div className="truncate text-[1.18rem] font-black tracking-tight text-[#f6efde] md:text-[1.7rem]">В Ёлках</div>
            <div className="text-[10px] text-[#ede4cc]/80 md:hidden">Белки и минипиги</div>
            <div className="hidden text-[10px] text-[#ede4cc]/80 md:block">Антикафе с белками и минипигами</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-[0.95rem] font-semibold text-[#f0e7d2]/90 md:flex">
          <a href="#about" className="hover:text-white">
            О нас
          </a>
          <a href="#pricing" className="hover:text-white">
            Тарифы
          </a>
          <a href="#booking" className="hover:text-white">
            Запись
          </a>
          <a href="#gallery" className="hover:text-white">
            Галерея
          </a>
          <a href="#contacts" className="hover:text-white">
            Контакты
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BOOKING_CONTACTS.phoneHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d6c388]/45 bg-[rgba(255,255,255,.08)] text-[#f4ecd8] shadow-[0_10px_20px_rgba(0,0,0,.18)] md:hidden"
            aria-label="Позвонить"
          >
            <Phone size={18} />
          </a>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenBooking}
            className="btn-forest mobile-booking-pulse px-4 py-2 text-[0.82rem] md:px-5 md:text-sm"
          >
            Записаться
          </motion.button>
        </div>
      </div>
    </header>
  );
}
