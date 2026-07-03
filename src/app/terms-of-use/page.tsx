import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export default function TermsOfUsePage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Условия использования"
      description="Полный текст документа извлечён из PDF и оформлен для чтения на сайте."
      paragraphs={readLegalDocument("terms-of-use")}
      pdfPath="/legal/usloviya-ispolzovaniya.pdf"
    />
  );
}
