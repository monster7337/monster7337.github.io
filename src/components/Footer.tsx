import Link from "next/link";
import { Clock3, MapPin, Phone, Send, CircleUserRound } from "lucide-react";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

type FooterProps = {
  homeHrefPrefix?: string;
};

export default function Footer({ homeHrefPrefix = "" }: FooterProps) {
  const navigationLinks = [
    { label: "Главная", href: homeHrefPrefix || "#" },
    { label: "О нас", href: `${homeHrefPrefix}#about` },
    { label: "Отличия", href: `${homeHrefPrefix}#differences` },
    { label: "Тарифы", href: `${homeHrefPrefix}#pricing` },
    { label: "Сертификаты", href: "/gift-certificates" },
    { label: "Галерея", href: `${homeHrefPrefix}#gallery` },
    { label: "Запись", href: "/booking" },
    { label: "Контакты", href: `${homeHrefPrefix}#contacts` },
  ];

  const helpLinks = [
    { label: "Помощь", href: `${homeHrefPrefix}#faq` },
    { label: "Как проходит визит", href: `${homeHrefPrefix}#visit-flow` },
    { label: "Правила посещения", href: `${homeHrefPrefix}#rules` },
    { label: "Перенос и возврат", href: `${homeHrefPrefix}#faq` },
  ];

  return (
    <footer className="border-t border-[#a48c4b]/45 bg-[rgba(7,17,10,.92)]">
      <div className="container-x py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-[28px] border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] p-5 shadow-[0_12px_26px_rgba(0,0,0,.26)]">
            <div className="inline-flex rounded-full border border-[#d6c388]/30 bg-[rgba(255,255,255,.06)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">
              В Ёлках
            </div>
            <h3 className="mt-3 text-[1.35rem] font-black text-[#f6efdb]">Антикафе с белками и минипигами</h3>
            <p className="mt-3 text-[0.9rem] leading-[1.55] text-[#efe4c8]/78">
              Принимаем гостей по записи. Каждый визит длится 1 час, а выбрать время можно на 11:00, 13:00, 15:00, 17:00 или 19:00.
            </p>
          </div>

          <div>
            <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[#e8d9b4]">Навигация</h3>
            <div className="mt-4 grid gap-2 text-[0.95rem] text-[#f6efdb]">
              {navigationLinks.map((item) => (
                <a key={item.href} href={item.href} className="rounded-2xl border border-transparent px-3 py-2 text-[#f6efdb]/82 transition hover:border-[#d6c388]/24 hover:bg-[rgba(255,255,255,.04)] hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[#e8d9b4]">Помощь и правила</h3>
            <div className="mt-4 grid gap-2 text-[0.95rem] text-[#f6efdb]">
              {helpLinks.map((item) => (
                <a key={item.label} href={item.href} className="rounded-2xl border border-transparent px-3 py-2 text-[#f6efdb]/82 transition hover:border-[#d6c388]/24 hover:bg-[rgba(255,255,255,.04)] hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[#e8d9b4]">Контакты</h3>
            <div className="mt-4 grid gap-2 text-[0.95rem]">
              <a className="flex items-center gap-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44" href={BOOKING_CONTACTS.phoneHref}>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f2d28c]">
                  <Phone size={14} />
                </span>
                <span>{BOOKING_CONTACTS.phone}</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44"
                href={BOOKING_CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f2d28c]">
                  <Send size={14} />
                </span>
                <span>Telegram: {BOOKING_CONTACTS.telegramLabel}</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44"
                href={BOOKING_CONTACTS.vkHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f2d28c]">
                  <CircleUserRound size={14} />
                </span>
                <span>VK: {BOOKING_CONTACTS.vkLabel}</span>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#efe4c8]/82">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f2d28c]">
                  <MapPin size={14} />
                </span>
                <span>{BOOKING_CONTACTS.address}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#efe4c8]/82">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] text-[#f2d28c]">
                  <Clock3 size={14} />
                </span>
                <span>{BOOKING_CONTACTS.hours}</span>
              </div>
              <a className="btn-forest mt-2 min-h-[44px] w-full" href="/booking">
                Перейти к записи
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d6c388]/16">
        <div className="container-x flex flex-col gap-2 py-4 text-[0.8rem] text-[#efe4c8]/68 sm:flex-row sm:items-center sm:justify-between">
          <span>В Ёлках, {new Date().getFullYear()}</span>
          <span>{BOOKING_CONTACTS.note}</span>
        </div>
      </div>

      <div className="border-t border-[#d6c388]/10 bg-[rgba(255,255,255,.02)]">
        <div className="container-x py-4 sm:py-5">
          <p className="max-w-[860px] text-[0.76rem] leading-[1.6] text-[#efe4c8]/64 sm:text-[0.8rem]">
            Все материалы и цены, размещенные на сайте, носят справочный характер и не являются публичной офертой,
            определяемой положением Статьи 437(2) Гражданского кодекса Российской Федерации.
          </p>
          <div className="mt-4 flex flex-col gap-3 text-[0.76rem] leading-[1.55] text-[#efe4c8]/64 sm:flex-row sm:items-end sm:justify-between sm:text-[0.8rem]">
            <div className="flex flex-col gap-2">
              <div>{BOOKING_CONTACTS.legalName}</div>
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <span>ИНН {BOOKING_CONTACTS.inn}</span>
                <span>ОГРН {BOOKING_CONTACTS.ogrn}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[0.82rem] sm:items-end">
              <a href="https://animalplaces.ru/" className="text-[#f0a261] underline underline-offset-4 transition hover:text-[#ffd1a4]">
                Все пространства Animal Places
              </a>
              <a href="https://piggyland.ru/" className="text-[#f0a261] underline underline-offset-4 transition hover:text-[#ffd1a4]">
                Антикафе Piggy Land
              </a>
              <Link href="/privacy-policy" className="text-[#f0a261] underline underline-offset-4 transition hover:text-[#ffd1a4]">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
