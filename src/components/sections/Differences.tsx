"use client";

import { Clock3, HeartHandshake, Sparkles, Stars, PartyPopper, Heart } from "lucide-react";

const differences = [
  {
    icon: HeartHandshake,
    title: "В штате работает зоотехник",
    description:
      "За состоянием животных следит специалист в области животноводства: он отвечает за уход, рационы кормления, распорядок дня, своевременные прививки и оптимальные условия содержания, отдыха и общения с гостями.",
    mobileDescription: "Зоотехник ведет уход, питание, режим дня, прививки и условия содержания животных.",
  },
  {
    icon: Clock3,
    title: "Тихий час после каждого интервала",
    description:
      "Для отдыха животных мы выстроили специальный режим посещения с перерывами каждый час: после каждой группы поросята спят и восстанавливаются, а инструкторы спокойно готовят пространство к следующему визиту.",
    mobileDescription: "После каждой группы у животных есть обязательный перерыв на сон и восстановление.",
  },
  {
    icon: Sparkles,
    title: "Санитарный час и контроль среды",
    description:
      "Перед каждым интервалом в антикафе проводится сухая и влажная уборка с дезинфицирующими средствами и кварцеванием отдельных зон. Во всех залах постоянно идет рециркуляция воздуха, а температура и влажность помещения находятся под контролем.",
    mobileDescription:
      "Перед каждой группой проводится уборка и дезинфекция, а воздух, температура и влажность постоянно контролируются.",
  },
];

const occasions = [
  {
    icon: PartyPopper,
    title: "Дни рождения и праздники",
    description: "«В Ёлках» подходит для дней рождения, семейных встреч и уютных праздников без суеты.",
    mobileDescription: "Подходит для дня рождения и семейного праздника.",
  },
  {
    icon: Stars,
    title: "Девичники и пижамные вечеринки",
    description: "Можно собраться с подругами и провести вечер в уютной, легкой атмосфере.",
    mobileDescription: "Уютный и легкий вечер с подругами.",
  },
  {
    icon: Heart,
    title: "Корпоративы и романтические вечера",
    description: "Пространство подходит и для пары, и для небольшой компании, которая хочет провести время необычно.",
    mobileDescription: "Необычный формат для пары или небольшой компании.",
  },
];

export default function Differences() {
  return (
    <section
      id="differences"
      className="forest-section lazy-bg-grass-2 border-b-0 py-12 sm:py-16"
      data-lazy-background
    >
      <div className="forest-overlay bg-[rgba(7,17,10,.62)]" />

      <div className="container-x section-content">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
            О нас
          </div>
          <h2 className="mt-4 text-[1.95rem] font-black leading-[1.06] text-[#f6efde] sm:text-[2.75rem]">
            Наши принципиальные отличия от других подобных пространств
          </h2>
          <p className="mt-3 text-[0.92rem] leading-[1.6] text-[#efe4c8]/84 sm:text-[1rem]">
            Для нас важны не только впечатления гостей, но и профессиональный уход, режим отдыха животных и санитарный
            контроль пространства.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
          {differences.map((item) => (
            <article key={item.title} className="glass-leaf-card rounded-[26px] p-4 sm:p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                <item.icon size={26} />
              </div>
              <h3 className="mt-4 text-[1.02rem] font-black leading-[1.22] text-[#f4ead3] sm:text-[1.32rem]">{item.title}</h3>
              <p className="mt-3 text-[0.86rem] leading-[1.62] text-[#efe4c8]/82 sm:text-[0.98rem]">
                <span className="sm:hidden">{item.mobileDescription}</span>
                <span className="hidden sm:inline">{item.description}</span>
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[760px] text-center sm:mt-12">
          <div className="inline-flex rounded-full border border-[#d6c388]/22 bg-[rgba(255,255,255,.05)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
            Форматы визита
          </div>
          <h3 className="mt-4 text-[1.5rem] font-black leading-[1.12] text-[#f6efde] sm:text-[2rem]">
            «В Ёлках» подходит не только для обычного визита
          </h3>
          <p className="mt-3 text-[0.9rem] leading-[1.6] text-[#efe4c8]/82 sm:text-[0.98rem]">
            К нам приходят не только ради знакомства с животными, но и ради встреч, необычных вечеров и спокойных
            праздников.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
          {occasions.map((item) => (
            <article key={item.title} className="glass-leaf-card rounded-[26px] p-4 sm:p-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#dbc788]/34 bg-[rgba(255,255,255,.05)] text-[#e0c973]">
                <item.icon size={26} />
              </div>
              <h3 className="mt-4 text-[1.02rem] font-black leading-[1.22] text-[#f4ead3] sm:text-[1.32rem]">{item.title}</h3>
              <p className="mt-3 text-[0.86rem] leading-[1.62] text-[#efe4c8]/82 sm:text-[0.98rem]">
                <span className="sm:hidden">{item.mobileDescription}</span>
                <span className="hidden sm:inline">{item.description}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
