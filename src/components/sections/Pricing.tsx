"use client";

import { motion } from "framer-motion";
import { Eye, MapPin } from "lucide-react";

type PricingProps = {
  onOpenBooking: () => void;
};

type Plan = {
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  viewed: string;
  location: string;
  description: string;
  button: "forest" | "cream";
};

const plans: Plan[] = [
  {
    name: 'Входной билет "ЛЬГОТНЫЙ"',
    price: "1000 ₽",
    oldPrice: "1500 ₽",
    discount: "-33%",
    viewed: "Посмотрели 596 человек",
    location: "Переулок Гривцова 3",
    description:
      "Скидка 33% на входной билет для пенсионеров, участников СВО, инвалидов и именинников + чай/кофе/сок/вода/сладости.",
    button: "forest",
  },
  {
    name: 'Входной билет "СЧАСТЛИВЫЙ ЧАС"',
    price: "1000 ₽ / час",
    oldPrice: "1500 ₽",
    discount: "-33%",
    viewed: "Посмотрели 632 человека",
    location: "Переулок Гривцова 3",
    description:
      "Акция: входной билет со скидкой 30% в будние дни в интервал на 11:00 + час/кофе/сок/вода/сладости. Не действует в выходные, праздничные дни и каникулы.",
    button: "forest",
  },
  {
    name: 'Входной билет "СЕМЕЙНЫЙ"',
    price: "1200 ₽ / час",
    oldPrice: "1500 ₽",
    discount: "-20%",
    viewed: "Посмотрели 679 человек",
    location: "Переулок Гривцова 3",
    description:
      "Акция: входной билет на семью от 3 человек и выше, со скидкой 20% (цена указана за одного человека) — 1 час нахождения в антикафе + чай/кофе/сок/вода/сладости.",
    button: "cream",
  },
  {
    name: 'Входной билет "СТАНДАРТНЫЙ"',
    price: "1500 ₽ / час",
    viewed: "Посмотрели 574 человека",
    location: "Переулок Гривцова 3",
    description:
      "Один час нахождения в антикафе с лесными жителями в будние дни с 15:00 до 19:00 и весь день с 10:00 до 19:00 в выходные и праздничные дни + чай/кофе/сок/вода/сладости.",
    button: "forest",
  },
];

export default function Pricing({ onOpenBooking }: PricingProps) {
  return (
    <section
      id="pricing"
      className="forest-section py-14 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay" />

      <div className="container-x section-content">
        <h2 className="section-title">Тарифы и спецпредложения</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {plans.map((plan, idx) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              whileHover={{ y: -3, scale: 1.005 }}
              className="forest-card relative overflow-hidden"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,211,130,.24)_0%,rgba(255,211,130,0)_75%)]" />

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[1.9rem] font-black leading-none text-[#f7f0df]">{plan.price}</span>
                {plan.oldPrice ? (
                  <span className="text-sm text-[#d9ccb0]/65 line-through">{plan.oldPrice}</span>
                ) : null}
                {plan.discount ? (
                  <span className="rounded-md bg-[#ff5d5d] px-2 py-0.5 text-xs font-bold text-white">
                    {plan.discount}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-2.5 py-1 text-sm text-[#d8ecff]">
                <Eye size={14} /> {plan.viewed}
              </div>

              <h3 className="mt-4 text-[1.35rem] font-black leading-tight text-[#f7f0df]">{plan.name}</h3>

              <div className="mt-4 flex items-center gap-2 border-y border-[#f6ecd4]/12 py-3 text-[#e8dbc0]/92">
                <MapPin size={16} /> {plan.location}
              </div>

              <p className="mt-4 text-[0.95rem] leading-relaxed text-[#efe4c8]/88">{plan.description}</p>

              <div className="mt-5">
                <button
                  className={`w-full ${plan.button === "cream" ? "btn-cream" : "btn-forest"}`}
                  onClick={onOpenBooking}
                >
                  Выбрать
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
