"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Heart, PawPrint, X } from "lucide-react";
import Image from "next/image";
import { galleryImageBlurDataUrl, getOptimizedGallerySrc } from "@/lib/galleryAssets";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";
import { useModalImagePreload } from "@/lib/useModalImagePreload";
import { useModalViewportLock } from "@/lib/useModalViewportLock";

type AnimalsProps = {
  onOpenBooking?: () => void;
};

type AnimalProfile = {
  slug: string;
  name: string;
  type: string;
  badge: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  character: string;
  trait: string;
  likes: string[];
  facts: string[];
};

const mobilePreviewCount = 4;

const animals: AnimalProfile[] = [
  {
    slug: "lapka",
    name: "Лапка",
    type: "Белка",
    badge: "Любит тишину",
    image: getOptimizedGallerySrc("/gallery/IMG_8205.jpeg"),
    imageAlt: "Белка Лапка в антикафе В Ёлках",
    imagePosition: "center 42%",
    character: "Шустрая белка, которая быстро привыкает к спокойным гостям и любит наблюдать за залом сверху.",
    trait: "Лучше всего раскрывается, когда знакомство проходит без спешки и резких движений.",
    likes: ["веточки и мягкий фундук", "спокойный голос", "сидеть повыше и смотреть на гостей"],
    facts: ["часто сама выходит на контакт", "очень удачно получается на фото крупным планом", "любит короткие, но частые подходы"],
  },
  {
    slug: "ryzhik",
    name: "Рыжик",
    type: "Белка",
    badge: "Звезда фотозоны",
    image: getOptimizedGallerySrc("/gallery/IMG_4325.jpeg"),
    imageAlt: "Белка Рыжик в антикафе В Ёлках",
    imagePosition: "center 22%",
    character: "Уверенная рыжая белка, которая любит активность в зале и часто оказывается в центре внимания гостей.",
    trait: "Если в комнате спокойная атмосфера, Рыжик быстро превращает знакомство в красивую фотосессию.",
    likes: ["высокие домики и укромные точки", "интерес к новым людям", "быть частью живых кадров"],
    facts: ["часто выбирает самые заметные места", "особенно хорош для ярких фото", "любит исследовать пространство вокруг гостей"],
  },
  {
    slug: "plombir",
    name: "Пломбир",
    type: "Минипиг",
    badge: "Самый спокойный",
    image: getOptimizedGallerySrc("/gallery/IMG_4770.jpeg"),
    imageAlt: "Минипиг Пломбир в антикафе В Ёлках",
    imagePosition: "center 44%",
    character: "Мягкий по характеру минипиг, который быстро расслабляется рядом с людьми и с удовольствием принимает почесушки.",
    trait: "Подходит для первого знакомства с минипигами, если нужен спокойный и понятный формат общения.",
    likes: ["почесушки за ушком", "лежать рядом с гостями", "яблочные кусочки под присмотром"],
    facts: ["быстро привыкает к голосу гостей", "часто остаётся рядом дольше других", "идеален для семейных кадров"],
  },
  {
    slug: "iriska",
    name: "Ириска",
    type: "Минипиг",
    badge: "Очень любопытная",
    image: getOptimizedGallerySrc("/gallery/IMG_4783.jpeg"),
    imageAlt: "Минипиг Ириска в антикафе В Ёлках",
    imagePosition: "center 38%",
    character: "Любопытная и быстрая минипиг, которая любит всё изучать носом и часто подходит знакомиться первой.",
    trait: "Вносит в визит больше движения и живой реакции, но при этом остаётся дружелюбной и понятной.",
    likes: ["морковь и лёгкие снеки", "быстро включаться в контакт", "быть в центре внимания"],
    facts: ["отлично реагирует на мягкое внимание", "часто первой идёт знакомиться", "выглядит очень выразительно на крупных планах"],
  },
  {
    slug: "karamelka",
    name: "Карамелька",
    type: "Минипиг",
    badge: "Любимица детей",
    image: getOptimizedGallerySrc("/gallery/IMG_4776.jpeg"),
    imageAlt: "Минипиг Карамелька в антикафе В Ёлках",
    imagePosition: "center 36%",
    character: "Контактная минипиг с мягким характером, которая быстро вызывает доверие у детей и спокойно держит внимание на себе.",
    trait: "Часто становится тем самым животным, после которого гости начинают чувствовать себя совсем как дома.",
    likes: ["тёплые пледы и мягкие лежанки", "спокойные семейные визиты", "нежное внимание без суеты"],
    facts: ["часто выбирает самые уютные места", "легко вписывается в неспешный визит", "подходит для тёплых семейных фото"],
  },
  {
    slug: "zefir",
    name: "Зефир",
    type: "Минипиг",
    badge: "Любит компанию",
    image: getOptimizedGallerySrc("/gallery/IMG_4785.jpeg"),
    imageAlt: "Минипиг Зефир в антикафе В Ёлках",
    imagePosition: "center 50%",
    character: "Общительный минипиг, которому особенно нравится быть рядом с другими жителями и гостями в одном активном часе.",
    trait: "Добавляет в визит ощущение настоящей живой фермы, когда хочется смотреть, как животные общаются между собой.",
    likes: ["компанию других минипигов", "движение в зале", "когда гости долго остаются рядом"],
    facts: ["лучше всего раскрывается в активных визитах", "часто оказывается в центре общего кадра", "создаёт очень живое настроение в галерее"],
  },
];

const animalImageUrls = animals.map((animal) => animal.image);
const mobilePreviewAnimals = animals.slice(0, mobilePreviewCount);

function AnimalMobileCard({
  animal,
  index,
  onOpen,
}: {
  animal: AnimalProfile;
  index: number;
  onOpen: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      className="group flex h-full min-h-[284px] flex-col overflow-hidden rounded-[22px] border border-[rgba(236,222,187,.28)] bg-[rgba(255,255,255,.08)] text-left shadow-[0_14px_30px_rgba(0,0,0,.24)]"
      onClick={() => onOpen(animal.slug)}
    >
      <div className="relative">
        <Image
          src={animal.image}
          alt={animal.imageAlt}
          width={640}
          height={640}
          priority={index < mobilePreviewCount}
          unoptimized
          placeholder="blur"
          blurDataURL={galleryImageBlurDataUrl}
          sizes="(max-width: 639px) 50vw, 25vw"
          className="h-[158px] w-full object-cover transition duration-500 group-active:scale-[1.02]"
          style={animal.imagePosition ? { objectPosition: animal.imagePosition } : undefined}
        />
        <span className="absolute right-2 top-2 rounded-full border border-[#dcc892]/24 bg-[rgba(8,16,11,.68)] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#f6edd7]">
          {animal.type}
        </span>
      </div>

      <div className="flex min-h-[126px] flex-1 flex-col justify-between px-3 pb-3 pt-3">
        <div>
          <span className="block text-[1rem] font-black text-[#f8f0dd]">{animal.name}</span>
          <span className="mt-1 block min-h-[2.2rem] text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.18em] text-[#e8d9b4]">
            {animal.badge}
          </span>
        </div>
        <span className="inline-flex rounded-full border border-[#dcc892]/18 bg-[rgba(255,255,255,.08)] px-2.5 py-1 text-[0.7rem] font-bold text-[#f6edd7]">
          Подробнее
        </span>
      </div>
    </button>
  );
}

function AnimalDesktopCard({
  animal,
  onOpen,
}: {
  animal: AnimalProfile;
  onOpen: (slug: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[rgba(236,222,187,.28)] bg-[rgba(255,255,255,.08)] shadow-[0_14px_30px_rgba(0,0,0,.24)] backdrop-blur-md">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#dcc892]/18">
        <Image
          src={animal.image}
          alt={animal.imageAlt}
          fill
          unoptimized
          placeholder="blur"
          blurDataURL={galleryImageBlurDataUrl}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 44vw, 100vw"
          className="object-cover"
          style={animal.imagePosition ? { objectPosition: animal.imagePosition } : undefined}
        />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#dccb9d]">{animal.type}</div>
            <h3 className="mt-1 text-[1.15rem] font-black text-[#f8f0dd]">{animal.name}</h3>
          </div>
          <span className="rounded-full border border-[#dcc892]/20 bg-[rgba(255,255,255,.05)] px-2.5 py-1 text-[10px] font-semibold text-[#f3e7c6]">
            {animal.badge}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#f6edd7]">{animal.character}</p>
        <p className="mt-2 text-[0.86rem] leading-6 text-[#efe4c8]/76">{animal.trait}</p>

        <button type="button" className="btn-forest mt-4 min-h-[42px] w-full text-sm" onClick={() => onOpen(animal.slug)}>
          Узнать подробнее
        </button>
      </div>
    </article>
  );
}

export default function Animals({ onOpenBooking }: AnimalsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const reveal = useScrollRevealMotion({ amount: 0.18, desktopDelayStep: 0.05, desktopDistance: 10 });

  const activeIndex = animals.findIndex((animal) => animal.slug === activeSlug);
  const activeAnimal = activeIndex >= 0 ? animals[activeIndex] : null;
  const hasHiddenAnimals = animals.length > mobilePreviewCount;

  const closeAnimal = () => setActiveSlug(null);
  const showPrevious = () => {
    setActiveSlug((currentSlug) => {
      const currentIndex = animals.findIndex((animal) => animal.slug === currentSlug);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex - 1 + animals.length) % animals.length;
      return animals[nextIndex]?.slug ?? null;
    });
  };
  const showNext = () => {
    setActiveSlug((currentSlug) => {
      const currentIndex = animals.findIndex((animal) => animal.slug === currentSlug);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % animals.length;
      return animals[nextIndex]?.slug ?? null;
    });
  };
  const openBookingFromModal = () => {
    closeAnimal();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        onOpenBooking?.();
      });
    });
  };

  useModalViewportLock({
    isOpen: activeAnimal !== null,
    onClose: closeAnimal,
    onPrevious: showPrevious,
    onNext: showNext,
  });

  useModalImagePreload({
    urls: animalImageUrls,
    isOpen: activeAnimal !== null,
    activeIndex,
    immediateRadius: 2,
    preloadAll: true,
  });

  return (
    <>
      <section
        id="animals"
        className="forest-section py-12 sm:py-14"
        style={{ backgroundImage: "url('/bg/grass1.png')" }}
      >
        <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

        <div className="container-x section-content">
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Животные</h2>
          <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
            <span className="sm:hidden">Выберите животное, чтобы посмотреть фото и узнать, кто любит внимание, а кто предпочитает спокойное знакомство.</span>
            <span className="hidden sm:inline">У каждого нашего жителя свой характер. Откройте карточку и посмотрите, кто обожает почесушки, а кто любит наблюдать за гостями со стороны.</span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:hidden">
            {mobilePreviewAnimals.map((animal, index) => (
              <div key={animal.slug} className="h-full">
                <AnimalMobileCard animal={animal} index={index} onOpen={setActiveSlug} />
              </div>
            ))}
          </div>

          <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2 md:mt-6 md:gap-4 lg:grid-cols-3">
            {animals.map((animal, index) => (
              <motion.div
                key={animal.slug}
                {...reveal(index)}
                whileHover={{ y: -3 }}
              >
                <AnimalDesktopCard animal={animal} onOpen={setActiveSlug} />
              </motion.div>
            ))}
          </div>

          {hasHiddenAnimals ? (
            <div className="mt-5 flex justify-center sm:hidden">
              <button type="button" className="btn-forest min-h-[44px] w-full" onClick={() => setActiveSlug(animals[0]?.slug ?? null)}>
                Показать всех животных
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {activeAnimal ? (
          <motion.div
            className="fixed inset-0 z-[90] p-2 sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[rgba(4,10,7,.84)] backdrop-blur-[8px]"
              onClick={closeAnimal}
              aria-label="Закрыть карточку животного"
            />

            <motion.div
              className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#dcc892]/35 bg-[rgba(7,17,11,.97)] shadow-[0_30px_90px_rgba(0,0,0,.48)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24 }}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dcc892]/26 bg-[rgba(255,255,255,.08)] text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.12)] sm:right-4 sm:top-4 sm:h-11 sm:w-11"
                onClick={closeAnimal}
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>

              <div className="relative h-[38svh] min-h-[260px] shrink-0 border-b border-[#dcc892]/18 lg:h-full lg:min-h-full lg:border-b-0 lg:border-r">
                <Image
                  key={activeAnimal.image}
                  src={activeAnimal.image}
                  alt={activeAnimal.imageAlt}
                  fill
                  unoptimized
                  priority
                  placeholder="blur"
                  blurDataURL={galleryImageBlurDataUrl}
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover"
                  style={activeAnimal.imagePosition ? { objectPosition: activeAnimal.imagePosition } : undefined}
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:py-6">
                  <div className="pr-12">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dccb9d]">Наш житель</span>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-[1.38rem] font-black text-[#f8f0dd] sm:text-[2.1rem]">{activeAnimal.name}</h3>
                          <span className="rounded-full border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-2.5 py-1 text-[0.7rem] font-semibold text-[#f6edd7] sm:px-3 sm:py-1.5 sm:text-xs">
                            {activeAnimal.type}
                          </span>
                        </div>
                        <p className="mt-2 text-[0.85rem] font-semibold text-[#e8d9b4] sm:hidden">{activeAnimal.badge}</p>
                        <p className="mt-3 text-[0.88rem] leading-5 text-[#f6edd7] sm:text-sm sm:leading-6">{activeAnimal.character}</p>
                        <p className="mt-2 text-[0.82rem] leading-5 text-[#efe4c8]/76 sm:text-sm sm:leading-6">{activeAnimal.trait}</p>
                      </div>
                      <span className="hidden whitespace-nowrap rounded-full border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-3 py-1.5 text-xs font-semibold text-[#f6edd7] sm:inline-flex">
                        {activeIndex + 1} / {animals.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="glass-leaf-card min-h-0 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#f6edd7]">
                        <Heart size={16} />
                        Любит
                      </div>
                      <ul className="mt-3 space-y-2 text-[0.84rem] leading-5 text-[#efe4c8]/82 sm:text-sm sm:leading-6">
                        {activeAnimal.likes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#d8c07d]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="glass-leaf-card min-h-0 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#f6edd7]">
                        <PawPrint size={16} />
                        Интересные факты
                      </div>
                      <ul className="mt-3 space-y-2 text-[0.84rem] leading-5 text-[#efe4c8]/82 sm:text-sm sm:leading-6">
                        {activeAnimal.facts.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8cb85b]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#dcc892]/18 bg-[rgba(8,18,11,.96)] px-3 py-3 sm:px-6 sm:py-4">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-3 py-3 text-sm font-semibold text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.1)]"
                      onClick={showPrevious}
                    >
                      <ArrowLeft size={18} />
                      <span className="hidden sm:inline">Назад</span>
                    </button>

                    <div className="text-center text-[0.88rem] font-bold whitespace-nowrap text-[#f6edd7] sm:text-sm">
                      {activeIndex + 1} / {animals.length}
                    </div>

                    <button
                      type="button"
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#dcc892]/22 bg-[rgba(255,255,255,.05)] px-3 py-3 text-sm font-semibold text-[#f6edd7] transition hover:bg-[rgba(255,255,255,.1)]"
                      onClick={showNext}
                    >
                      <span className="hidden sm:inline">Вперед</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {onOpenBooking ? (
                    <button type="button" className="btn-forest mt-2 min-h-[46px] w-full sm:mt-3" onClick={openBookingFromModal}>
                      <CalendarDays size={18} />
                      Записаться на визит
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
