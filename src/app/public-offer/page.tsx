import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export const metadata = { robots: { index: false, follow: false } };

export default function PublicOfferPage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Публичная оферта"
      description="Актуальная редакция условий бронирования, посещения и оформления подарочных сертификатов."
      paragraphs={readLegalDocument("public-offer")}
    />
  );
}
