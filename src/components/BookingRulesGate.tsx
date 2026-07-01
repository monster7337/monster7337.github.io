"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Leaf, PawPrint, ShieldCheck, Sparkles, X } from "lucide-react";

const OPEN_EVENT = "v-elkah:booking-gate-open";

const rules = [
  "Помните: вы в гостях у животных, а не на аттракционе. Капибар нельзя принуждать к общению — слушайте иструкторов, чтобы всем было комфортно.",
  "Дети до 12 лет могут находиться с животными только со взрослым сопровождающим. Билет нужен каждому.",
  "Не опаздывайте — время сеанса сокращается, а продлить его нельзя.",
];

export function requestBookingGate(href = "/booking") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { href } }));
}

function isBookingPath(pathname: string) {
  return pathname === "/booking";
}

export default function BookingRulesGate() {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState("/booking");
  const [isOpen, setIsOpen] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(() => rules.map(() => false));

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!isOpen) {
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
      body.style.overflow = "";
      return undefined;
    }

    html.classList.add("modal-open");
    body.classList.add("modal-open");
    body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      html.classList.remove("modal-open");
      body.classList.remove("modal-open");
      body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOpenRequest = (event: Event) => {
      const customEvent = event as CustomEvent<{ href?: string }>;
      setPendingHref(customEvent.detail?.href || "/booking");
      setAcceptedRules(rules.map(() => false));
      setIsOpen(true);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor = target instanceof Element ? target.closest("a[href]") : null;

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const rawHref = anchor.getAttribute("href");

      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);

      if (url.origin !== window.location.origin || !isBookingPath(url.pathname)) {
        return;
      }

      if (pathname === "/booking" && url.pathname === "/booking") {
        return;
      }

      event.preventDefault();
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
      setAcceptedRules(rules.map(() => false));
      setIsOpen(true);
    };

    window.addEventListener(OPEN_EVENT, handleOpenRequest);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener(OPEN_EVENT, handleOpenRequest);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [pathname]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  if (!portalTarget) {
    return null;
  }

  const allAccepted = acceptedRules.every(Boolean);
  const toggleRule = (index: number) => {
    setAcceptedRules((current) => current.map((value, currentIndex) => (currentIndex === index ? !value : value)));
  };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 border-0 bg-[radial-gradient(circle_at_top,rgba(236,214,156,.14),transparent_34%),rgba(4,12,7,.72)] backdrop-blur-md"
            aria-label="Закрыть окно с правилами"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="elkah-booking-gate-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[720px] overflow-hidden rounded-[30px] border border-[#d6c388]/30 bg-[linear-gradient(180deg,rgba(15,36,21,.98),rgba(8,20,12,.98))] p-5 text-[#f6efdb] shadow-[0_32px_90px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.08)] sm:rounded-[34px] sm:p-7"
          >
            <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(228,203,122,.24)_0%,rgba(228,203,122,0)_72%)]" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(118,159,48,.18)_0%,rgba(118,159,48,0)_72%)]" />

            <button
              type="button"
              onClick={() => {
                setAcceptedRules(rules.map(() => false));
                setIsOpen(false);
              }}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6c388]/22 bg-[rgba(255,255,255,.05)] text-[#f6efdb] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,.1)]"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>

            <div className="relative z-[1]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
                <Sparkles size={14} />
                Перед записью
              </div>

              <h2 id="elkah-booking-gate-title" className="mt-4 max-w-[560px] text-[1.9rem] font-black leading-[1.02] text-[#f6efdb] sm:text-[2.8rem]">
                Несколько теплых правил, чтобы визит прошел спокойно и для гостей, и для животных
              </h2>

              <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.65] text-[#efe4c8]/82">
                У нас бережная атмосфера, и мы очень хотим ее сохранить. Перед переходом к бронированию посмотрите,
                пожалуйста, короткие правила поведения.
              </p>
            </div>

            <div className="relative z-[1] mt-6 grid gap-3">
              {rules.map((rule, index) => (
                <button
                  key={rule}
                  type="button"
                  onClick={() => toggleRule(index)}
                  aria-pressed={acceptedRules[index]}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-4 py-3.5 text-left transition hover:-translate-y-px hover:border-[#d6c388]/30 hover:bg-[rgba(255,255,255,.07)]"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d6c388]/22 bg-[rgba(214,195,136,.08)] text-[#e9cf82]">
                    <PawPrint size={16} />
                  </span>
                  <span className="pt-1 text-[0.92rem] leading-[1.58] text-[#f5edd8]/92">{rule}</span>
                  <span
                    className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
                      acceptedRules[index]
                        ? "border-[#d9d37f]/60 bg-[rgba(201,222,126,.18)] text-[#dff2a1]"
                        : "border-[#d6c388]/26 bg-[rgba(255,255,255,.04)] text-transparent"
                    }`}
                  >
                    {acceptedRules[index] ? <Check size={15} /> : null}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative z-[1] mt-4 grid grid-cols-[auto_1fr] items-start gap-3 rounded-[22px] border border-[#9dbd52]/24 bg-[rgba(128,168,58,.1)] px-4 py-3.5 text-[#eef1cf]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c7de7e]/18 bg-[rgba(199,222,126,.08)] text-[#d4e58e]">
                <ShieldCheck size={17} />
              </span>
              <span className="pt-1 text-[0.9rem] leading-[1.58]">
                Нажимая кнопку ниже, вы подтверждаете, что готовы соблюдать правила поведения в антикафе.
              </span>
            </div>

            <div className="relative z-[1] mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setAcceptedRules(rules.map(() => false));
                  setIsOpen(false);
                }}
                className="btn-cream min-h-[48px] flex-1 border-0 text-[0.95rem]"
              >
                Вернуться
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!allAccepted) {
                    return;
                  }
                  setAcceptedRules(rules.map(() => false));
                  setIsOpen(false);
                  router.push(pendingHref);
                }}
                disabled={!allAccepted}
                className="btn-forest min-h-[48px] flex-1 text-[0.95rem] disabled:cursor-not-allowed disabled:opacity-60 disabled:saturate-75"
              >
                <span className="inline-flex items-center gap-2">
                  <Heart size={16} />
                  <Leaf size={15} />
                  Перейти к бронированию
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    portalTarget
  );
}
