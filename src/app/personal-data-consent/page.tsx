import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export default function PersonalDataConsentPage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Согласие на обработку персональных данных"
      description="Полный текст документа извлечён из PDF и оформлен для чтения на сайте."
      paragraphs={readLegalDocument("personal-data-consent")}
      pdfPath="/legal/obrabotka-personalnyh-dannyh.pdf"
    />
  );
}
