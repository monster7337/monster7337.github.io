"use client";


const items = [
  { k: "01", t: "Лесной интерьер", d: "Зелёные градиенты, тёплые материалы, мягкий свет." },
  { k: "02", t: "Фотозоны", d: "Кадры “как из Pinterest”, без лишней суеты." },
  {
    k: "03",
    t: "Свидания/ДР",
    d: "Формат, который легко продать на сайте и записать онлайн.",
  },
  { k: "04", t: "Живые эмоции", d: "Белка/минипиг = вау-контент для соцсетей." },
];

export default function Highlights() {
  return (
    <section className="container-x py-4">
      <div className="glass p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold">Почему «В Ёлках» запоминается</h3>
            <p className="muted mt-2">Блок для “вау” + доверия (и конверсии в запись).</p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((x) => (
            <div
              key={x.k}
              className="rounded-xl2 border border-white/10 bg-white/5 p-5"
            >
              <div className="text-gold-500 font-extrabold">{x.k}</div>
              <div className="mt-2 font-bold">{x.t}</div>
              <div className="mt-1 text-sm muted">{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
