"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Check, Heart, Leaf, PawPrint, X } from "lucide-react";

const OPEN_EVENT = "v-elkah:booking-gate-open";
const BOOKING_DRAFT_STORAGE_KEY = "velkah-booking-draft";
const GIFT_DRAFT_STORAGE_KEY = "velkah-gift-draft";

const rules = [
  "Помните: вы в гостях у животных, а не на аттракционе. Животных нельзя принуждать к общению — слушайте инструкторов, чтобы всем было комфортно.",
  "Дети до 12 лет могут находиться с животными только со взрослым сопровождающим. Билет нужен каждому.",
  "Не опаздывайте — время сеанса сокращается, а продлить его нельзя.",
];

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function requestBookingGate(href = "/booking") {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { href } }));
}

function isGatedPath(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return normalizedPathname === "/booking" || normalizedPathname === "/gift-certificates";
}

function hasDraftForPath(href: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const url = new URL(href, window.location.href);

  const targetPathname = normalizePathname(url.pathname);

  if (targetPathname === "/booking") {
    return Boolean(window.sessionStorage.getItem(BOOKING_DRAFT_STORAGE_KEY));
  }

  if (targetPathname === "/gift-certificates") {
    return Boolean(window.sessionStorage.getItem(GIFT_DRAFT_STORAGE_KEY));
  }

  return false;
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
      const href = customEvent.detail?.href || "/booking";

      if (hasDraftForPath(href)) {
        router.push(href);
        return;
      }

      setPendingHref(href);
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
      const anchor = target instanceof Element ? (target.closest("a[href]") as HTMLAnchorElement | null) : null;

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const rawHref = anchor.getAttribute("href");

      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      const nextHref = `${url.pathname}${url.search}${url.hash}`;

      if (normalizePathname(pathname) !== "/" || url.origin !== window.location.origin || !isGatedPath(url.pathname)) {
        return;
      }

      if (hasDraftForPath(nextHref)) {
        return;
      }

      event.preventDefault();
      setPendingHref(nextHref);
      setAcceptedRules(rules.map(() => false));
      setIsOpen(true);
    };

    window.addEventListener(OPEN_EVENT, handleOpenRequest);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener(OPEN_EVENT, handleOpenRequest);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [pathname, router]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  if (!portalTarget) {
    return null;
  }

  const allAccepted = acceptedRules.every(Boolean);

  const toggleRule = (index: number) => {
    setAcceptedRules((current) => current.map((value, currentIndex) => (currentIndex === index ? !value : value)));
  };

  const close = () => {
    setAcceptedRules(rules.map(() => false));
    setIsOpen(false);
  };

  const proceed = () => {
    if (!allAccepted) {
      return;
    }

    setAcceptedRules(rules.map(() => false));
    setIsOpen(false);
    router.push(pendingHref);
  };

  return createPortal(
      isOpen ? (
        <div
          className="fixed inset-0 z-[120] overflow-hidden p-3 sm:flex sm:items-center sm:justify-center sm:p-6"
        >
          <button
            type="button"
            className="absolute inset-0 border-0 bg-[radial-gradient(circle_at_top,rgba(236,214,156,.14),transparent_34%),rgba(4,12,7,.72)] backdrop-blur-md"
            aria-label="Закрыть окно с правилами"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="elkah-booking-gate-title"
            className="relative mx-auto flex w-full max-w-[720px] flex-col overflow-hidden rounded-[30px] border border-[#d6c388]/30 bg-[linear-gradient(180deg,rgba(15,36,21,.98),rgba(8,20,12,.98))] p-4 text-[#f6efdb] shadow-[0_32px_90px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.08)] sm:rounded-[34px] sm:p-7"
          >
            <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(228,203,122,.24)_0%,rgba(228,203,122,0)_72%)]" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(118,159,48,.18)_0%,rgba(118,159,48,0)_72%)]" />

            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6c388]/22 bg-[rgba(255,255,255,.05)] text-[#f6efdb] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,.1)]"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>

            <div className="relative z-[1] shrink-0 pr-10">
              <h2 id="elkah-booking-gate-title" className="text-[1.55rem] font-black leading-[1.02] text-[#f6efdb] sm:text-[2.2rem]">
                Правила поведения
              </h2>
            </div>

            <div className="relative z-[1] mt-4 sm:mt-5">
              <div className="grid gap-3">
                {rules.map((rule, index) => (
                  <button
                    key={rule}
                    type="button"
                    onClick={() => toggleRule(index)}
                    aria-pressed={acceptedRules[index]}
                    className="grid w-full touch-manipulation grid-cols-[auto_1fr_auto] items-start gap-3 rounded-[20px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] px-3 py-2.5 text-left transition hover:-translate-y-px hover:border-[#d6c388]/30 hover:bg-[rgba(255,255,255,.07)] sm:px-4 sm:py-3.5"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6c388]/22 bg-[rgba(214,195,136,.08)] text-[#e9cf82] sm:h-9 sm:w-9">
                      <PawPrint size={16} />
                    </span>
                    <span className="pt-0.5 text-[0.8rem] leading-[1.42] text-[#f5edd8]/92 sm:pt-1 sm:text-[0.92rem] sm:leading-[1.58]">{rule}</span>
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

            </div>

            <div className="relative z-[1] mt-4 flex shrink-0 flex-col gap-2 sm:mt-5 sm:flex-row sm:gap-3">
              <button type="button" onClick={close} className="btn-cream min-h-[48px] flex-1 touch-manipulation border-0 text-[0.95rem]">
                Вернуться
              </button>
              <button
                type="button"
                onClick={proceed}
                disabled={!allAccepted}
                className="btn-forest min-h-[48px] flex-1 touch-manipulation text-[0.95rem] disabled:cursor-not-allowed disabled:opacity-60 disabled:saturate-75"
              >
                <span className="inline-flex items-center gap-2">
                  <Heart size={16} />
                  <Leaf size={15} />
                  Перейти к оформлению
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null,
    portalTarget
  );
}
