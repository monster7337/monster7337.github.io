"use client";

import { motion } from "framer-motion";
import { Eye, MapPin } from "lucide-react";
import { BOOKING_TICKETS, BookingTicketId, formatCurrency } from "@/lib/bookingCatalog";
import { useScrollRevealMotion } from "@/lib/useMobileMotion";

type PricingProps = {
  onOpenBooking: (defaults?: { ticketId?: BookingTicketId; dateId?: string; time?: string }) => void;
};

export default function Pricing({ onOpenBooking }: PricingProps) {
  const reveal = useScrollRevealMotion({ amount: 0.16, desktopDelayStep: 0.06, desktopDistance: 10 });

  return (
    <section
      id="pricing"
      className="forest-section py-14 sm:py-16"
      style={{ backgroundImage: "url('/bg/grass1.png')" }}
    >
      <div className="forest-overlay" />

      <div className="container-x section-content">
        <h2 className="section-title text-[1.95rem] sm:text-[2.35rem]">Тарифы и спецпредложения</h2>
        <p className="mt-2 max-w-[620px] text-[0.92rem] text-[#efe4c8]/86 sm:hidden">
          Выберите подходящий билет и сразу переходите к записи.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-2 md:gap-4">
          {BOOKING_TICKETS.map((plan, idx) => (
            <motion.article
              key={plan.id}
              {...reveal(idx)}
              whileHover={{ y: -3, scale: 1.005 }}
              className="forest-card relative min-h-[250px] overflow-hidden p-3.5 sm:min-h-0 sm:p-5"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,211,130,.24)_0%,rgba(255,211,130,0)_75%)]" />

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[1.18rem] font-black leading-none text-[#f7f0df] sm:text-[1.9rem]">
                  {formatCurrency(plan.price)}
                  <span className="text-[0.8em]"> / час</span>
                </span>
                {plan.oldPrice ? (
                  <span className="text-[11px] text-[#d9ccb0]/65 line-through sm:text-sm">{formatCurrency(plan.oldPrice)}</span>
                ) : null}
                {plan.discount ? (
                  <span className="rounded-md bg-[#ff5d5d] px-1.5 py-0.5 text-[10px] font-bold text-white sm:px-2 sm:text-xs">
                    {plan.discount}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-2 py-1 text-[10px] text-[#d8ecff] sm:gap-2 sm:px-2.5 sm:text-sm">
                <Eye size={13} className="sm:h-[14px] sm:w-[14px]" />
                <span className="sm:hidden">{plan.mobileViewed}</span>
                <span className="hidden sm:inline">{plan.viewed}</span>
              </div>

              <h3 className="mt-3 text-[0.92rem] font-black leading-[1.16] text-[#f7f0df] sm:mt-4 sm:text-[1.35rem]">
                <span className="sm:hidden">{plan.mobileName}</span>
                <span className="hidden sm:inline">{plan.name}</span>
              </h3>

              <div className="mt-3 flex items-center gap-1.5 border-y border-[#f6ecd4]/12 py-2 text-[11px] text-[#e8dbc0]/92 sm:mt-4 sm:gap-2 sm:py-3 sm:text-base">
                <MapPin size={14} className="sm:h-4 sm:w-4" />
                <span className="sm:hidden">Гривцова 3</span>
                <span className="hidden sm:inline">{plan.location}</span>
              </div>

              <p className="mt-3 text-[0.74rem] leading-[1.35] text-[#efe4c8]/88 sm:mt-4 sm:text-[0.95rem] sm:leading-relaxed">
                <span className="sm:hidden">{plan.mobileDescription}</span>
                <span className="hidden sm:inline">{plan.description}</span>
              </p>

              {plan.note ? (
                <div className="mt-3 inline-flex rounded-full border border-[#d6c388]/35 bg-[rgba(255,255,255,.06)] px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-[#f1e7cd] sm:text-xs">
                  {plan.note}
                </div>
              ) : null}

              <div className="mt-4 sm:mt-5">
                <button
                  className={`w-full min-h-[40px] px-3 py-2 text-[0.8rem] sm:min-h-0 sm:px-6 sm:py-2.5 sm:text-base ${plan.button === "cream" ? "btn-cream" : "btn-forest"}`}
                  onClick={() => onOpenBooking({ ticketId: plan.id })}
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
