import { Suspense } from "react";
import BookingPageClient from "@/components/BookingPageClient";
import { absoluteUrl } from "@/lib/base-path";

export const metadata = {
  title: 'Онлайн-запись | "В Ёлках"',
  description: "Отдельная страница онлайн-записи в антикафе В Ёлках: билет, дата, время и быстрая отправка заявки.",
  alternates: { canonical: absoluteUrl("/booking") },
};

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingPageClient />
    </Suspense>
  );
}
