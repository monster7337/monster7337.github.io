"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, Clock3, Gift, Leaf, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import Link from "next/link";
import { BOOKING_TICKETS, BOOKING_CONTACTS, BookingTicketId, formatCurrency } from "@/lib/bookingCatalog";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

type PricingProps = {
  onOpenBooking: (defaults?: { ticketId?: BookingTicketId; dateId?: string; time?: string }) => void;
};

const ticketIcons: Record<BookingTicketId, typeof Star> = {
  social: Leaf,
  "happy-hour": Clock3,
  family: Users,
  standard: Star,
};

const noteIcons: Record<BookingTicketId, typeof BadgePercent> = {
  social: ShieldCheck,
  "happy-hour": Clock3,
  family: Users,
  standard: BadgePercent,
};

export default function Pricing({ onOpenBooking }: PricingProps) {
  const reveal = useScrollRevealMotion({ amount: 0.16, desktopDelayStep: 0.06, desktopDistance: 10 });

  return (
    <section
      id="pricing"
      className="forest-section lazy-bg-grass-1 py-14 sm:py-16"
      data-lazy-background
    >
      <div className="forest-overlay bg-[rgba(8,18,11,.6)]" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Тарифы и спецпредложения</h2>
        <p className="mt-2 max-w-[620px] text-[0.92rem] text-[#efe4c8]/86 sm:hidden">
          Выберите подходящий билет и сразу переходите к записи.
        </p>

        <div className="mt-4 flex justify-center sm:mt-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7c37e]/42 bg-[rgba(18,35,13,.76)] px-4 py-2 text-[0.82rem] font-semibold text-[#f1e3b7] shadow-[0_10px_22px_rgba(0,0,0,.2)] backdrop-blur-sm sm:px-6 sm:py-3 sm:text-[1.02rem]">
            <MapPin size={16} className="text-[#e6d082]" />
            <span className="sm:hidden">Гривцова, 3</span>
            <span className="hidden sm:inline">{BOOKING_CONTACTS.address}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 md:grid-cols-2 md:gap-5">
          {BOOKING_TICKETS.map((plan, idx) => {
            const TicketIcon = ticketIcons[plan.id];
            const NoteIcon = noteIcons[plan.id];
            const isFeatured = plan.id === "standard";

            return (
              <motion.article
                key={plan.id}
                {...reveal(idx)}
                whileHover={{ y: -3, scale: 1.005 }}
                className={`relative overflow-hidden rounded-[22px] border p-3 shadow-[0_16px_32px_rgba(0,0,0,.26)] backdrop-blur-sm sm:p-5 ${
                  isFeatured
                    ? "border-[#e2c55f]/72 bg-[linear-gradient(180deg,rgba(18,41,12,.9)_0%,rgba(9,24,9,.96)_100%)] shadow-[0_0_0_1px_rgba(226,197,95,.22),0_0_34px_rgba(228,193,77,.24),0_20px_40px_rgba(0,0,0,.32)]"
                  : "border-[#d2bd75]/50 bg-[linear-gradient(180deg,rgba(19,40,13,.88)_0%,rgba(9,22,9,.96)_100%)]"
                }`}
              >
                {isFeatured ? (
                  <div className="absolute right-0 top-4 hidden rounded-l-[14px] bg-[linear-gradient(180deg,#efd26f_0%,#dcb34f_100%)] px-5 py-2 text-[0.9rem] font-black uppercase tracking-[0.06em] text-[#2f2408] shadow-[0_8px_18px_rgba(0,0,0,.18)] sm:block">
                    Популярный тариф
                  </div>
                ) : null}

                <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,218,128,.22)_0%,rgba(255,218,128,0)_72%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(132,173,63,.14),transparent_68%)]" />

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dcc56e]/70 bg-[rgba(255,234,171,.06)] text-[#ead37d] sm:h-14 sm:w-14">
                    <TicketIcon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[1.12rem] font-black leading-none text-[#f8f0da] sm:text-[2.45rem]">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-[0.72rem] font-bold text-[#f8f0da] sm:text-[1.45rem]">/ час</span>
                      {plan.oldPrice ? (
                        <span className="ml-1 text-[0.64rem] text-[#d9ccb0]/72 line-through sm:ml-3 sm:text-[1.1rem]">{formatCurrency(plan.oldPrice)}</span>
                      ) : null}
                      {plan.discount ? (
                        <span className="ml-1 rounded-full bg-[#ef4b4b] px-2 py-0.5 text-[0.66rem] font-black text-white sm:px-3 sm:text-[0.95rem]">
                          {plan.discount}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-2 text-[0.8rem] font-black leading-[1.18] text-[#f2df98] sm:mt-3 sm:text-[1.45rem]">
                      <span className="sm:hidden">{plan.mobileName}</span>
                      <span className="hidden sm:inline">{plan.name}</span>
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-[0.7rem] leading-[1.42] text-[#efe4c8]/92 sm:mt-4 sm:text-[0.96rem]">
                  <span className="sm:hidden">{plan.mobileDescription}</span>
                  <span className="hidden sm:inline">{plan.description}</span>
                </p>

                {plan.note ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#9fb851]/38 bg-[rgba(34,54,20,.58)] px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.02em] text-[#ebddab] sm:mt-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-[0.92rem]">
                    <NoteIcon size={13} />
                    <span className="sm:hidden">{plan.note}</span>
                    <span className="hidden sm:inline">{plan.note}</span>
                  </div>
                ) : null}

                <div className="mt-4 sm:mt-5">
                  <button
                    className="flex min-h-[40px] w-full items-center justify-between rounded-[14px] border border-[#c3d95d]/55 bg-[linear-gradient(180deg,#95c548_0%,#6c9f27_100%)] px-3 py-2 text-[0.78rem] font-black text-[#f7f1dc] shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_12px_26px_rgba(56,83,22,.32)] transition hover:brightness-105 sm:min-h-[54px] sm:px-5 sm:text-[1rem]"
                    onClick={() => onOpenBooking({ ticketId: plan.id })}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#dced9c]/35 bg-[rgba(255,255,255,.08)] text-[#f6efdb] sm:h-9 sm:w-9">
                      <Leaf size={14} />
                    </span>
                    <span>Выбрать</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-5 sm:mt-7">
          <div className="rounded-[24px] border border-[#d6c388]/28 bg-[linear-gradient(180deg,rgba(20,42,14,.86)_0%,rgba(11,23,10,.96)_100%)] p-4 shadow-[0_16px_32px_rgba(0,0,0,.26)] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[620px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d6c388]/24 bg-[rgba(255,255,255,.05)] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#e8d9b4]">
                  <Gift size={14} />
                  Подарочный сертификат
                </div>
                <div className="mt-3 text-[1.08rem] font-black text-[#f6efdb] sm:text-[1.28rem]">Можно оформить сертификат на посещение для 1-12 гостей</div>
                <p className="mt-2 text-[0.84rem] leading-[1.55] text-[#efe4c8]/82 sm:text-[0.94rem]">
                  Удобный подарок для пары, семьи или компании. Стоимость рассчитывается по количеству гостей, а сертификат оплачивается полностью сразу.
                </p>
              </div>

              <Link className="btn-cream min-h-[46px] shrink-0 px-5" href="/gift-certificates">
                Купить сертификат
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
