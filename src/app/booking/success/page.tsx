import { Suspense } from "react";
import BookingSuccessClient from "@/components/BookingSuccessClient";

export const metadata = { robots: { index: false, follow: false } };

export default function BookingSuccessPage() {
  return (
    <main className="forest-section min-h-screen py-16" style={{ backgroundImage: "url('/bg/grass1.webp')" }}>
      <div className="forest-overlay bg-[rgba(7,17,10,.72)]" />
      <div className="container-x section-content">
        <div className="mx-auto max-w-3xl">
          <Suspense fallback={<div className="forest-card p-6 sm:p-8 text-[#f6efdb]">Загружаем детали записи...</div>}>
            <BookingSuccessClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
