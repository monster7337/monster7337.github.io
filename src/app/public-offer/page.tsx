import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export default function PublicOfferPage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Публичная оферта"
      description="Полный текст документа извлечён из PDF и оформлен для чтения на сайте."
      paragraphs={readLegalDocument("public-offer")}
      pdfPath="/legal/publichnaya-oferta.pdf"
    />
  );
}
