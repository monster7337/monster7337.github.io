"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type GalleryProps = {
  onOpenBooking: () => void;
};

const galleryItems = [
  { src: "/bg/hero.png", alt: "Белка", pos: "object-left" },
  { src: "/bg/grass2.png", alt: "Кормление белки", pos: "object-center" },
  { src: "/bg/grass1.png", alt: "Угощения в антикафе", pos: "object-center" },
];

export default function Gallery({ onOpenBooking }: GalleryProps) {
  return (
    <section
      id="gallery"
      className="forest-section py-14 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass2.png')" }}
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.58)]" />

      <div className="container-x section-content">
        <h2 className="section-title">Фотогалерея</h2>

        <div className="mt-7 grid gap-5 lg:grid-cols-12">
          <div className="grid gap-3 lg:col-span-9 lg:grid-cols-3">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={item.alt}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative h-80 overflow-hidden rounded-lg border border-[#dac792]/58 shadow-[0_8px_22px_rgba(0,0,0,.28)]"
              >
                <Image src={item.src} alt={item.alt} fill className={`object-cover ${item.pos}`} />
              </motion.div>
            ))}
          </div>

          <form
            className="form-shell lg:col-span-3"
            onSubmit={(e) => {
              e.preventDefault();
              onOpenBooking();
            }}
          >
            <input className="field-paper" placeholder="Ваше имя" />
            <input className="field-paper mt-3" placeholder="+7 (___) ___-__-__" />
            <textarea className="field-paper mt-3 min-h-[120px]" placeholder="Ваше сообщение" />
            <button className="btn-forest mt-4 w-full" type="submit">
              Отправить
            </button>
          </form>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="btn-forest min-w-52" onClick={onOpenBooking}>
            Смотреть больше
          </button>
        </div>
      </div>
    </section>
  );
}
