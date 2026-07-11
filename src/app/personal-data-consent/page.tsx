import LegalPdfPage from "@/components/LegalPdfPage";
import { readLegalDocument } from "@/lib/legalDocuments";

export const metadata = { robots: { index: false, follow: false } };

export default function PersonalDataConsentPage() {
  return (
    <LegalPdfPage
      eyebrow="В Ёлках"
      title="Согласие на обработку персональных данных"
      description="Актуальная редакция согласия на обработку персональных данных."
      paragraphs={readLegalDocument("personal-data-consent")}
    />
  );
}
