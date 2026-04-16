import { AtSign, Clock3, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Image from "next/image";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";

const mobileContacts = [
  { icon: Phone, label: "Позвонить", value: BOOKING_CONTACTS.phone, href: BOOKING_CONTACTS.phoneHref },
  { icon: Send, label: "Telegram", value: "Написать", href: BOOKING_CONTACTS.telegramHref, external: true },
  { icon: MessageCircle, label: "VK", value: "Открыть", href: BOOKING_CONTACTS.vkHref, external: true },
  { icon: Clock3, label: "Время", value: "11:00 / 13:00 / 15:00 / 17:00 / 19:00" },
];

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="forest-section border-b-0 py-10 sm:py-12"
      style={{ backgroundImage: "url('/bg/grass3.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Контакты</h2>
            <p className="mt-2 max-w-[420px] text-[0.92rem] leading-relaxed text-[#f2e9d4]/88 lg:hidden">
              Связаться с нами, выбрать удобное время и быстро найти дорогу можно прямо отсюда.
            </p>
            <div className="mt-4 hidden h-px bg-[#efe0bc]/24 lg:block" />
            <ul className="mt-6 hidden space-y-3 text-[0.98rem] text-[#f2e9d4]/92 lg:block">
              <li className="flex items-center gap-3">
                <Phone size={17} />
                <a className="hover:text-white" href={BOOKING_CONTACTS.phoneHref}>
                  {BOOKING_CONTACTS.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <AtSign size={17} /> {BOOKING_CONTACTS.telegramLabel}
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={17} /> {BOOKING_CONTACTS.address}
              </li>
              <li className="flex items-center gap-3">
                <Clock3 size={17} /> {BOOKING_CONTACTS.hours}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:block">
            {mobileContacts.map((item) => {
              const Icon = item.icon;
              const content = (
                <div className="glass-leaf-card min-h-[118px] p-3.5 sm:p-5 lg:hidden">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(242,226,191,.4)] bg-[rgba(255,255,255,.1)] text-[#f8f0de]">
                    <Icon size={18} />
                  </div>
                  <div className="mt-2 text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">{item.label}</div>
                  <div className="mt-1 text-[0.86rem] font-bold leading-[1.2] text-[#f6efdb]">{item.value}</div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="block lg:hidden"
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className="lg:hidden">
                  {content}
                </div>
              );
            })}

            <div className="hidden glass-leaf-card lg:block">
              <div className="text-lg font-black text-[#f6efdb]">Ссылки</div>
              <div className="mt-3 space-y-2 text-sm">
                <a
                  className="block rounded-md border border-[#d4c290]/34 bg-[rgba(255,255,255,.07)] px-3 py-2 text-[#efe4c8] hover:border-[#e3d2a4]/58"
                  href={BOOKING_CONTACTS.telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <Send size={14} /> Telegram: {BOOKING_CONTACTS.telegramLabel}
                  </span>
                </a>
                <a
                  className="block rounded-md border border-[#d4c290]/34 bg-[rgba(255,255,255,.07)] px-3 py-2 text-[#efe4c8] hover:border-[#e3d2a4]/58"
                  href={BOOKING_CONTACTS.vkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle size={14} /> VK: {BOOKING_CONTACTS.vkLabel}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-4">
            <div className="forest-card p-3.5 lg:hidden">
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Адрес</div>
              <div className="mt-1 text-[0.92rem] font-bold leading-[1.28] text-[#f6efdb]">{BOOKING_CONTACTS.address}</div>
              <div className="mt-2 text-[0.78rem] leading-[1.4] text-[#efe4c8]/84">Мы принимаем гостей по записи: 11:00, 13:00, 15:00, 17:00 и 19:00.</div>
            </div>

            <a
              className="group block overflow-hidden rounded-2xl border border-[#d8c693]/45 bg-[rgba(12,28,18,.78)] shadow-[0_10px_24px_rgba(0,0,0,.24)] backdrop-blur-md lg:rounded-lg"
              href={BOOKING_CONTACTS.mapHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative h-[190px] sm:h-[220px]">
                <Image
                  src={BOOKING_CONTACTS.mapImage}
                  alt={`Карта: ${BOOKING_CONTACTS.address}`}
                  fill
                  sizes="(min-width: 1024px) 26vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,14,9,.88)] via-[rgba(6,14,9,.08)] to-[rgba(6,14,9,.18)]" />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-[#dcc892]/26 bg-[rgba(7,17,11,.78)] px-3 py-1.5 text-[0.72rem] font-semibold text-[#f6efdb]">
                  <MapPin size={14} />
                  Адрес на карте
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                  <div className="rounded-2xl border border-[#dcc892]/18 bg-[rgba(7,17,11,.76)] px-3 py-2 text-[#f6efdb]">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8d9b4]">Как нас найти</div>
                    <div className="mt-1 text-[0.86rem] font-bold leading-[1.3] sm:text-sm">{BOOKING_CONTACTS.address}</div>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#dcc892]/22 bg-[rgba(255,255,255,.1)] px-3 py-2 text-[0.72rem] font-bold text-[#f6efdb]">
                    Открыть карту
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
