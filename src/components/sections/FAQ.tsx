import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Можно без записи?",
    a: "Нет, посещение строго по предварительной записи. Это нужно для комфорта животных и гостей.",
  },
  { q: "С какого возраста детям можно?", a: "Можно с детьми, до 12 лет только со взрослыми." },
  { q: "Что делать при аллергии?", a: "Сообщите заранее. Поможем подобрать формат или ограничить контакт." },
  { q: "Можно ли фото и видео?", a: "Да, можно. Просим выключить вспышку." },
  { q: "Сколько длится визит?", a: "Каждый сеанс длится ровно 1 час." },
  { q: "Есть ли парковка рядом?", a: "Да, в районе переулка Гривцова есть городские парковочные места." },
  { q: "Можно со своей едой?", a: "Напитки и сладости у нас есть, по остальному лучше уточнить при записи." },
  {
    q: "Как отменить запись?",
    a: "При отмене за два дня предоплата возвращается. За одни сутки возможен перенос записи на другую свободную дату. При отмене менее чем за сутки предоплата не возвращается. Подробные условия описаны в договоре оферты.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="forest-section lazy-bg-grass-3 py-12 sm:py-14"
      data-lazy-background
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.65)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Частые вопросы</h2>
        <p className="mt-2 max-w-[620px] text-[0.92rem] text-[#efe4c8]/86 sm:hidden">
          Самые частые вопросы перед записью в одном месте.
        </p>
        <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2">
          {faqs.map((f) => (
            <details key={f.q} className="faq-item glass-leaf-card p-4 sm:p-5">
              <summary className="faq-summary flex cursor-pointer items-center justify-between gap-3 text-[0.95rem] font-bold leading-[1.3] text-[#f8f0de] sm:text-base">
                <span>{f.q}</span>
                <ChevronDown className="faq-chevron h-4 w-4 shrink-0 text-[#dcc892]" />
              </summary>
              <p className="mt-2 text-[0.8rem] leading-[1.45] text-[#efe4c8]/85 sm:text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
