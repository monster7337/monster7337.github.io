"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Camera, Clock3, Heart, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import Image from "next/image";
import { galleryImageBlurDataUrl, getOptimizedGallerySrc } from "@/lib/galleryAssets";
import { useModalImagePreload } from "@/lib/useModalImagePreload";
import { useModalViewportLock } from "@/lib/useModalViewportLock";
import { requestBookingGate } from "@/components/BookingRulesGate";

type GalleryProps = {
  onOpenBooking?: () => void;
};

const galleryItems = [
  { src: getOptimizedGallerySrc("/gallery/IMG_4785.jpeg"), alt: "Фото антикафе В Ёлках 1", width: 5712, height: 4284 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2622.jpeg"), alt: "Фото антикафе В Ёлках 2", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2606.jpeg"), alt: "Фото антикафе В Ёлках 3", width: 4681, height: 5957 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2583.jpeg"), alt: "Фото антикафе В Ёлках 4", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2678.jpeg"), alt: "Фото антикафе В Ёлках 5", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2768.jpeg"), alt: "Фото антикафе В Ёлках 6", width: 960, height: 1280 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2884.jpeg"), alt: "Фото антикафе В Ёлках 7", width: 10174, height: 3864 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2895.jpeg"), alt: "Фото антикафе В Ёлках 8", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2900.jpeg"), alt: "Фото антикафе В Ёлках 9", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2945.jpeg"), alt: "Фото антикафе В Ёлках 10", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2968.jpeg"), alt: "Фото антикафе В Ёлках 11", width: 3024, height: 4032 },
  { src: getOptimizedGallerySrc("/gallery/IMG_2989.jpeg"), alt: "Фото антикафе В Ёлках 12", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3009.jpeg"), alt: "Фото антикафе В Ёлках 13", width: 4284, height: 5712 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3053.jpeg"), alt: "Фото антикафе В Ёлках 14", width: 2066, height: 3672 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3084.jpeg"), alt: "Фото антикафе В Ёлках 15", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3119.jpeg"), alt: "Фото антикафе В Ёлках 16", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3172.jpeg"), alt: "Фото антикафе В Ёлках 17", width: 1320, height: 1732 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3173.jpeg"), alt: "Фото антикафе В Ёлках 18", width: 1320, height: 1729 },
  { src: getOptimizedGallerySrc("/gallery/IMG_3246.jpeg"), alt: "Фото антикафе В Ёлках 19", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4159.jpeg"), alt: "Фото антикафе В Ёлках 20", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4290.jpeg"), alt: "Фото антикафе В Ёлках 21", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4325.jpeg"), alt: "Фото антикафе В Ёлках 22", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4394.jpeg"), alt: "Фото антикафе В Ёлках 23", width: 2160, height: 3840 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4770.jpeg"), alt: "Фото антикафе В Ёлках 24", width: 5712, height: 4284 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4776.jpeg"), alt: "Фото антикафе В Ёлках 25", width: 5712, height: 4284 },
  { src: getOptimizedGallerySrc("/gallery/IMG_4783.jpeg"), alt: "Фото антикафе В Ёлках 26", width: 4032, height: 3024 },
];

const previewItems = galleryItems.slice(0, 6).map((item) => ({
  ...item,
  previewSrc: item.src.replace("/gallery/optimized/", "/gallery/optimized/thumb/"),
}));
const galleryImageUrls = galleryItems.map((item) => item.src);

export default function Gallery({ onOpenBooking = () => requestBookingGate() }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? galleryItems[activeIndex] : null;

  const closeLightbox = () => setActiveIndex(null);
  const showPrevious = () => {
    setActiveIndex((current) => (current === null ? 0 : (current - 1 + galleryItems.length) % galleryItems.length));
  };
  const showNext = () => {
    setActiveIndex((current) => (current === null ? 0 : (current + 1) % galleryItems.length));
  };
  const openBySrc = (src: string) => {
    const index = galleryItems.findIndex((item) => item.src === src);
    if (index >= 0) setActiveIndex(index);
  };

  useModalViewportLock({
    isOpen: activeItem !== null,
    onClose: closeLightbox,
    onPrevious: showPrevious,
    onNext: showNext,
  });

  useModalImagePreload({
    urls: galleryImageUrls,
    isOpen: activeItem !== null,
    activeIndex,
    immediateRadius: 1,
    preloadAll: false,
  });

  return (
    <>
      <section id="gallery" className="forest-section lazy-bg-grass-2 py-14 sm:py-16" data-lazy-background>
        <div className="forest-overlay bg-[rgba(8,18,11,.58)]" />

        <div className="container-x section-content">
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Фотогалерея</h2>
          <p className="mt-2 max-w-[620px] text-[0.92rem] text-[#efe4c8]/86 sm:hidden">
            Несколько тёплых кадров, чтобы вы сразу почувствовали атмосферу нашего пространства.
          </p>

          <div className="mt-5 grid gap-4 lg:mt-7 lg:grid-cols-12 lg:gap-5">
            <div className="lg:col-span-9">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previewItems.map((item, idx) => (
                  <button
                    key={item.src}
                    type="button"
                    className="group relative block overflow-hidden rounded-[22px] border border-[#dac792]/58 bg-[rgba(14,31,19,.58)] text-left shadow-[0_8px_22px_rgba(0,0,0,.28)]"
                    onClick={() => openBySrc(item.src)}
                    aria-label={`Открыть ${item.alt}`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={item.previewSrc}
                        alt={item.alt}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={galleryImageBlurDataUrl}
                        sizes="(min-width: 640px) 30vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[rgba(6,14,9,.92)] via-[rgba(6,14,9,.42)] to-transparent px-3 py-3 sm:px-4">
                        <span className="rounded-full border border-[#dcc892]/30 bg-[rgba(8,16,11,.55)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0e4bf]">
                          Фото {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#f6edd7]">Смотреть</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:hidden">
                <button type="button" className="btn-forest min-h-[44px] w-full" onClick={() => setActiveIndex(0)}>
                  Открыть все фото
                </button>
              </div>
            </div>

            <div className="form-shell rounded-2xl p-4 lg:col-span-3">
              <div className="text-sm font-bold text-[#f5eddb]">Готовы выбрать время?</div>
              <p className="mt-1 text-[0.82rem] leading-[1.45] text-[#efe4c8]/78">
                Откройте запись и выберите удобный день, время и формат визита.
              </p>

              <button
                type="button"
                onClick={onOpenBooking}
                className="btn-forest mt-4 min-h-[46px] w-full"
              >
                Записаться
              </button>

              <div className="mt-4 rounded-[24px] border border-[#b69b44]/40 bg-[linear-gradient(180deg,rgba(28,52,20,.9)_0%,rgba(17,33,13,.96)_100%)] p-3 shadow-[0_16px_34px_rgba(0,0,0,.22)]">
                <div className="flex items-center gap-2 text-[0.92rem] font-bold text-[#d8e38f]">
                  <Sparkles size={16} />
                  Что вас ждёт
                </div>

                <div className="mt-3 space-y-2.5">
                  {[
                    { icon: Users, label: "Контакт с животными" },
                    { icon: Camera, label: "Уютная фотозона" },
                    { icon: Heart, label: "Для семьи, друзей и свиданий" },
                    { icon: CalendarDays, label: "По предварительной записи" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-[14px] border border-[#92ae5c]/18 bg-[linear-gradient(180deg,rgba(57,88,35,.42)_0%,rgba(23,42,16,.7)_100%)] px-3 py-3 text-[0.88rem] font-semibold text-[#f2ebd6]"
                    >
                      <item.icon size={18} className="shrink-0 text-[#d6e38b]" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-[18px] border border-[#c8a846]/50 bg-[linear-gradient(180deg,rgba(53,74,28,.76)_0%,rgba(27,44,18,.92)_100%)] px-3 py-3">
                  <div className="flex items-center gap-3 text-[0.9rem] font-semibold text-[#f3df8f]">
                    <Clock3 size={18} className="shrink-0" />
                    <span>Сеанс 1 час</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[0.9rem] font-semibold text-[#f3df8f]">
                    <Users size={18} className="shrink-0" />
                    <span>Можно с семьёй, друзьями или на свидание</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { icon: ShieldCheck, label: "Безопасно" },
                    { icon: Heart, label: "Уютно" },
                    { icon: Sparkles, label: "Живые эмоции" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[14px] border border-[#92ae5c]/14 bg-[rgba(29,50,21,.7)] px-2 py-2.5 text-center"
                    >
                      <item.icon size={16} className="mx-auto text-[#cfde84]" />
                      <div className="mt-1 text-[0.68rem] font-medium leading-[1.2] text-[#dfe7bd]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 hidden justify-center sm:flex">
            <button type="button" className="btn-forest min-h-[44px] sm:min-w-52" onClick={() => setActiveIndex(0)}>
              Открыть все фото
            </button>
          </div>
        </div>
      </section>

      {activeItem ? (
          <div
            className="fixed inset-0 z-[90] bg-[rgba(3,8,6,.96)] backdrop-blur-[10px]"
            onClick={closeLightbox}
          >
            <div
              className="relative h-full w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dcc892]/24 bg-[rgba(7,17,11,.72)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:right-5 sm:top-5"
                onClick={closeLightbox}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>

              <button
                type="button"
                className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcc892]/24 bg-[rgba(7,17,11,.72)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:left-5"
                onClick={showPrevious}
                aria-label="Предыдущее фото"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative h-full w-full">
                <Image
                  key={activeItem.src}
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={galleryImageBlurDataUrl}
                  sizes="100vw"
                  className="object-contain p-3 sm:p-6 md:p-10"
                />
              </div>

              <button
                type="button"
                className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#dcc892]/24 bg-[rgba(7,17,11,.72)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:right-5"
                onClick={showNext}
                aria-label="Следующее фото"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
      ) : null}
    </>
  );
}
