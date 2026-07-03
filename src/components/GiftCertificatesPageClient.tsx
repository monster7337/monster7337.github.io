"use client";

import { ArrowLeft, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import GiftCertificateOrderForm from "@/components/GiftCertificateOrderForm";
import Navbar from "@/components/Navbar";
import { buildBookingHref } from "@/lib/bookingHref";

export default function GiftCertificatesPageClient() {
  const router = useRouter();

  return (
    <main>
      <Navbar
        homeHrefPrefix="/"
        onOpenBooking={() => {
          router.push(buildBookingHref());
        }}
      />
      <section className="forest-section border-b-0 border-t-0 py-10 sm:py-12" style={{ backgroundImage: "url('/bg/grass1.webp')" }}>
        <div className="forest-overlay bg-[rgba(7,17,10,.66)]" />
        <div className="container-x section-content">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex justify-start sm:mb-5">
              <button
                type="button"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.82rem] font-semibold text-[#f3e7c6] transition hover:bg-[rgba(255,255,255,.1)]"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={16} />
                На главную
              </button>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6c388]/28 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#e7d8b1]">
              <Gift size={14} />
              Подарочные сертификаты
            </div>
            <h1 className="mt-4 text-[2rem] font-black leading-[1.02] text-[#f6efde] sm:text-[3.15rem]">Подарочный сертификат в антикафе «В Ёлках»</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-[#efe4c8]/84 sm:text-[1rem]">
              Оформите сертификат на посещение для одного гостя, пары или компании до 12 человек. Сертификат оплачивается
              полностью сразу и сохраняется в системе.
            </p>
          </div>
        </div>
      </section>
      <GiftCertificateOrderForm />
      <Footer homeHrefPrefix="/" />
    </main>
  );
}
