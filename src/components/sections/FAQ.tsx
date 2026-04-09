"use client";

const faqs = [
  {
    q: "Можно без записи?",
    a: "Нет, посещение строго по предварительной записи. Это нужно для комфорта животных и гостей.",
  },
  { q: "С какого возраста детям можно?", a: "Можно с детьми, до 10 лет только со взрослыми." },
  { q: "Что делать при аллергии?", a: "Сообщите заранее. Поможем подобрать формат или ограничить контакт." },
  { q: "Можно ли фото и видео?", a: "Да, можно. Просим выключить вспышку." },
  { q: "Сколько длится визит?", a: "Обычно от 60 минут, также есть безлимитные форматы." },
  { q: "Есть ли парковка рядом?", a: "Да, в районе переулка Гривцова есть городские парковочные места." },
  { q: "Можно со своей едой?", a: "Напитки и сладости у нас есть, по остальному лучше уточнить при записи." },
  { q: "Как отменить запись?", a: "Напишите в Telegram или позвоните — перенесем на удобное время." },
];

export default function FAQ() {
  return (
    <section
      className="forest-section py-12 sm:py-14"
      style={{ backgroundImage: "url('/bg/grass3.png')" }}
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.65)]" />

      <div className="container-x section-content">
        <h2 className="section-title">FAQ</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <details key={f.q} className="glass-leaf-card">
              <summary className="cursor-pointer text-base font-bold text-[#f8f0de]">{f.q}</summary>
              <p className="mt-2 text-sm text-[#efe4c8]/85">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
