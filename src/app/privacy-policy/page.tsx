import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export default function PrivacyPolicyPage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Политика конфиденциальности"
      description="Полный текст документа извлечён из PDF и оформлен для чтения на сайте."
      paragraphs={readLegalDocument("privacy-policy")}
      pdfPath="/legal/politika-konfidentsialnosti.pdf"
    />
  );
}
