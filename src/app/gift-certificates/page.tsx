import GiftCertificatesPageClient from "@/components/GiftCertificatesPageClient";
import { absoluteUrl } from "@/lib/base-path";

export const metadata = {
  title: 'Подарочные сертификаты | "В Ёлках"',
  description: "Подарочный сертификат В Ёлках на посещение для одного гостя, пары или компании до 12 человек.",
  alternates: { canonical: absoluteUrl("/gift-certificates") },
};

export default function GiftCertificatesPage() {
  return <GiftCertificatesPageClient />;
}
