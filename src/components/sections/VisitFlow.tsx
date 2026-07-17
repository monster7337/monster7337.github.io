"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight, BadgeCheck, CalendarDays, HeartHandshake, Sparkles } from "lucide-react";

const steps = [
  {
    icon: BadgeCheck,
    title: "Выберите формат",
    text: "Подберите визит для семьи, пары или компании друзей и проверьте, что входит в стоимость.",
    mobileText: "Подберите визит для семьи, пары или компании.",
  },
  {
    icon: CalendarDays,
    title: "Выберите день и время",
    text: "Мы работаем по предварительной записи, поэтому лучше заранее закрепить удобный час.",
    mobileText: "Закрепите удобные дату и время заранее.",
  },
  {
    icon: Sparkles,
    title: "Подтвердите запись",
    text: "Оставьте контакты, проверьте детали брони и получите подтверждение без лишних звонков.",
    mobileText: "Оставьте контакты и подтвердите визит.",
  },
  {
    icon: HeartHandshake,
    title: "Приезжайте в Ёлках",
    text: "Вас ждут ручные животные, чай, сладости, спокойные фото и уютный лесной уголок в центре города.",
    mobileText: "Приезжайте на час общения, чая и теплых фото.",
  },
];

export default function VisitFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 640) {
      return undefined;
    }

    let frame = 0;
    let lastScrollY = window.scrollY;

    const updateActiveStep = () => {
      frame = 0;

      const focusLine = window.innerHeight * 0.46;
      const scrollingDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;

      const cards = cardRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (!cards.length) {
        return;
      }

      let nextIndex = scrollingDown ? 0 : cards.length - 1;

      if (scrollingDown) {
        for (let index = 0; index < cards.length; index += 1) {
          const rect = cards[index].getBoundingClientRect();
          if (rect.top <= focusLine) {
            nextIndex = index;
          }
        }
      } else {
        for (let index = cards.length - 1; index >= 0; index -= 1) {
          const rect = cards[index].getBoundingClientRect();
          if (rect.bottom >= focusLine) {
            nextIndex = index;
          }
        }
      }

      setActiveStep((current) => (current === nextIndex ? current : nextIndex));
    };

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section id="visit-flow" className="forest-section lazy-bg-grass-1 py-12 sm:py-16" data-lazy-background>
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div>
          <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Как проходит визит</h2>
          <p className="mt-2 max-w-3xl text-[0.92rem] text-[#efe4c8]/86 sm:text-base">
            <span className="sm:hidden">Четыре коротких шага до теплого часа с животными.</span>
            <span className="hidden sm:inline">Все просто: выберите формат, день и время, а дальше мы будем ждать вас в гости.</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:mt-7 sm:gap-5">
          <div
            className="relative grid overflow-hidden rounded-2xl border border-[#d9c891]/45 bg-[linear-gradient(135deg,rgba(17,43,22,.88),rgba(8,22,13,.84))] p-4 shadow-[0_18px_46px_rgba(0,0,0,.34)] backdrop-blur-md md:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] md:gap-6 md:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#a6cf70]/18 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-48 bg-[radial-gradient(circle_at_bottom_right,rgba(232,216,176,.24),transparent_66%)]" />

            <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3">
              <span className="w-fit rounded-full border border-[#d9c891]/38 bg-[rgba(255,255,255,.08)] px-2.5 py-1.5 text-[0.68rem] font-black uppercase text-[#e7d8b1] sm:px-3 sm:text-[0.82rem]">
                Плавный путь к визиту
              </span>
              <div className="grid">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={clsx(
                      "col-start-1 row-start-1 flex flex-col gap-1.5 transition sm:gap-2",
                      index === activeStep ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                    )}
                    aria-hidden={index !== activeStep}
                  >
                    <h3 className="text-[1.35rem] font-black leading-[1.05] text-[#f7efdc] sm:text-[2.35rem]">{step.title}</h3>
                    <p className="max-w-2xl text-[0.82rem] leading-[1.42] text-[#efe4c8]/86 sm:text-base sm:leading-relaxed">
                      <span className="sm:hidden">{step.mobileText}</span>
                      <span className="hidden sm:inline">{step.text}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-4 flex flex-col justify-center gap-3 md:mt-0 md:gap-4">
              <div className="flex items-baseline gap-2.5 sm:gap-3">
                <strong className="min-w-[4ch] text-right text-[2rem] font-black leading-none text-[#f6efde] sm:text-[3.4rem]">
                  {Math.round(progress)}%
                </strong>
                <span className="text-[0.78rem] font-bold text-[#e8d9b4]/86 sm:text-sm">пути открыто</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-[#d9c891]/20 bg-[rgba(239,228,200,.18)] shadow-[inset_0_1px_2px_rgba(0,0,0,.22)] sm:h-4">
                <div
                  className="relative h-full rounded-full bg-[linear-gradient(90deg,#6f9447_0%,#a6cf70_52%,#f1dfaf_100%)] shadow-[0_10px_24px_rgba(95,131,55,.24)] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const progressStep = Math.round(((i + 1) / steps.length) * 100);

              return (
                <button
                  key={step.title}
                  type="button"
                  ref={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  data-step-index={i}
                  onClick={() => setActiveStep(i)}
                  onMouseEnter={() => setActiveStep(i)}
                  onFocus={() => setActiveStep(i)}
                  className={clsx(
                    "forest-card relative flex min-h-[196px] flex-col items-start gap-2.5 overflow-hidden p-3.5 text-left transition sm:min-h-[266px] sm:gap-3 sm:p-5",
                    isActive
                      ? "border-[#e1cf9f]/85 bg-[rgba(18,46,24,.72)] shadow-[0_24px_58px_rgba(0,0,0,.42)]"
                      : "hover:-translate-y-1 hover:border-[#e1cf9f]/72"
                  )}
                  aria-pressed={isActive}
                >
                  {isActive ? (
                    <span
                      className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#a6cf70]/20 blur-xl sm:h-44 sm:w-44"
                    />
                  ) : null}

                  <div className="relative z-10 flex w-full items-center justify-between gap-3">
                    <span className="text-[1.65rem] font-black leading-none text-[#d8c58f] sm:text-[2.25rem]">0{i + 1}</span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9c891]/38 bg-[rgba(255,255,255,.08)] text-[#e7d8b1] sm:h-11 sm:w-11">
                      <Icon size={18} />
                    </span>
                  </div>

                  <h3 className="relative z-10 text-[0.94rem] font-black leading-[1.12] text-[#f7efdc] sm:text-[1.18rem]">{step.title}</h3>
                  <p className="relative z-10 text-[0.74rem] leading-[1.42] text-[#efe4c8]/82 sm:text-[0.9rem] sm:leading-relaxed">
                    <span className="sm:hidden">{step.mobileText}</span>
                    <span className="hidden sm:inline">{step.text}</span>
                  </p>

                  <div className="relative z-10 mt-auto flex w-full items-center justify-between border-t border-[#d9c891]/18 pt-2.5 text-[0.72rem] font-black text-[#e7d8b1] sm:pt-3 sm:text-[0.78rem]">
                    <span>{progressStep}% маршрута</span>
                    <ArrowUpRight size={15} className="sm:h-[17px] sm:w-[17px]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
