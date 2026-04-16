import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

const navigationLinks = [
  { label: "Главная", href: "#" },
  { label: "О нас", href: "#about" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Галерея", href: "#gallery" },
  { label: "Запись", href: "#booking" },
  { label: "Контакты", href: "#contacts" },
];

const helpLinks = [
  { label: "Помощь", href: "#faq" },
  { label: "Как проходит визит", href: "#visit-flow" },
  { label: "Правила посещения", href: "#rules" },
  { label: "Перенос и возврат", href: "#faq" },
];

export default function Footer() {
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
              <a className="rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44" href={BOOKING_CONTACTS.phoneHref}>
                {BOOKING_CONTACTS.phone}
              </a>
              <a
                className="rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44"
                href={BOOKING_CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
              >
                Telegram: {BOOKING_CONTACTS.telegramLabel}
              </a>
              <a
                className="rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#f6efdb] transition hover:border-[#d6c388]/44"
                href={BOOKING_CONTACTS.vkHref}
                target="_blank"
                rel="noreferrer"
              >
                VK: {BOOKING_CONTACTS.vkLabel}
              </a>
              <div className="rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#efe4c8]/82">
                {BOOKING_CONTACTS.address}
              </div>
              <div className="rounded-2xl border border-[#d6c388]/24 bg-[rgba(255,255,255,.04)] px-3 py-2 text-[#efe4c8]/82">
                {BOOKING_CONTACTS.hours}
              </div>
              <a className="btn-forest mt-2 min-h-[44px] w-full" href="#booking">
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
    </footer>
  );
}
