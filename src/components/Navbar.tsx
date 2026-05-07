"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

type NavbarProps = {
  onOpenBooking: () => void;
};

const navLinks = [
  { label: "О нас", href: "#about" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Запись", href: "#booking" },
  { label: "Галерея", href: "#gallery" },
  { label: "Контакты", href: "#contacts" },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!isMenuOpen) {
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
      return undefined;
    }

    html.classList.add("modal-open");
    body.classList.add("modal-open");

    return () => {
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleBooking = () => {
    closeMenu();
    onOpenBooking();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#a48c4b]/55 bg-[rgba(9,23,14,.84)] backdrop-blur-sm">
        <div className="container-x">
          <div className="hidden h-20 items-center justify-between gap-5 md:flex">
            <a href="#" className="flex min-w-0 items-center gap-4">
              <Image
                src="/logo/logo.png"
                alt='Логотип "В Ёлках"'
                width={68}
                height={68}
                className="h-[68px] w-[68px] object-contain"
              />
              <div className="min-w-0 leading-none">
                <div className="truncate text-[2.05rem] font-black tracking-tight text-[#f6efde]">В Ёлках</div>
                <div className="text-[11px] text-[#ede4cc]/80">Антикафе с белками и минипигами</div>
              </div>
            </a>

            <nav className="flex items-center gap-7 text-[1rem] font-semibold text-[#f0e7d2]/90">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="btn-forest px-6 py-3 text-[0.95rem]"
            >
              Записаться
            </motion.button>
          </div>

          <div className="flex h-[72px] items-center gap-2.5 md:hidden">
            <a
              href={BOOKING_CONTACTS.phoneHref}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6c388]/45 bg-[rgba(255,255,255,.08)] text-[#f4ecd8] shadow-[0_10px_20px_rgba(0,0,0,.18)]"
              aria-label="Позвонить"
            >
              <Phone size={18} />
            </a>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBooking}
              className="btn-forest mobile-booking-pulse flex-1 rounded-[16px] px-4 py-3 text-[0.9rem]"
            >
              Записаться
            </motion.button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6c388]/45 bg-[rgba(255,255,255,.08)] text-[#f4ecd8] shadow-[0_10px_20px_rgba(0,0,0,.18)]"
              aria-label="Открыть меню"
              aria-expanded={isMenuOpen}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[rgba(5,13,8,.62)] backdrop-blur-sm"
              onClick={closeMenu}
              aria-label="Закрыть меню"
            />

            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-3 right-3 top-[74px] rounded-[24px] border border-[#d6c388]/38 bg-[linear-gradient(180deg,rgba(16,37,22,.98),rgba(10,25,15,.96))] p-4 shadow-[0_22px_48px_rgba(0,0,0,.34)]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#d9c891]/78">Навигация</div>
                  <div className="mt-1 truncate text-[1rem] font-black text-[#f6efde]">В Ёлках</div>
                </div>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d6c388]/34 bg-[rgba(255,255,255,.05)] text-[#f4ecd8]"
                  aria-label="Закрыть меню"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-[48px] items-center justify-between rounded-[18px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.04)] px-4 text-[0.94rem] font-semibold text-[#f4ecd8]"
                  >
                    {link.label}
                    <span className="text-[#dccf9d]/72">↗</span>
                  </a>
                ))}

                <button type="button" onClick={handleBooking} className="btn-forest mt-1 min-h-[48px] w-full rounded-[18px]">
                  Записаться
                </button>
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
