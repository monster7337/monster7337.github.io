"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BookingPlanner from "@/components/sections/BookingPlanner";
import { BookingTicketId } from "@/lib/bookingCatalog";
import { buildBookingHref } from "@/lib/bookingHref";

export default function BookingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTicketId = (searchParams.get("ticketId") as BookingTicketId | null) ?? undefined;
  const initialDateId = searchParams.get("dateId") ?? undefined;
  const initialTime = searchParams.get("time") ?? undefined;

  return (
    <main className="booking-mobile-app">
      <Navbar
        homeHrefPrefix="/"
        bookingMode
        onOpenBooking={() => {
          router.push(buildBookingHref());
        }}
      />
      <section
        className="booking-page-hero forest-section border-b-0 border-t-0 py-10 sm:py-12"
        style={{ backgroundImage: "url('/bg/grass1.webp')" }}
      >
        <div className="forest-overlay bg-[rgba(7,17,10,.66)]" />
        <div className="container-x section-content">
          <div className="booking-page-hero-inner mx-auto max-w-4xl text-center">
            <div className="booking-page-back-row mb-4 flex justify-start sm:mb-5">
              <button
                type="button"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.82rem] font-semibold text-[#f3e7c6] transition hover:bg-[rgba(255,255,255,.1)]"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={16} />
                На главную
              </button>
            </div>
            <div className="booking-page-hero-badge inline-flex rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
              Онлайн-запись
            </div>
            <h1 className="booking-page-title mt-4 text-[2rem] font-black leading-[1.02] text-[#f6efde] sm:text-[3.15rem]">
              Предварительная запись в антикафе «В Ёлках»
            </h1>
            <p className="booking-page-intro mx-auto mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-[#efe4c8]/84 sm:text-[1rem]">
              Выберите билеты, дату и время визита. На сайте оплачивается только предварительная оплата 500 ₽ за каждое место,
              остаток вносится уже на месте при посещении.
            </p>
          </div>
        </div>
      </section>
      <BookingPlanner initialTicketId={initialTicketId} initialDateId={initialDateId} initialTime={initialTime} />
      <Footer homeHrefPrefix="/" />
    </main>
  );
}
