import Link from "next/link";

type LegalPdfPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: string[];
  pdfPath?: string;
  returnHref?: string;
  returnLabel?: string;
};

export default function LegalPdfPage({
  eyebrow,
  title,
  description,
  paragraphs,
  pdfPath,
  returnHref = "/booking",
  returnLabel = "Вернуться к записи",
}: LegalPdfPageProps) {
  return (
    <main className="forest-section min-h-screen bg-[url('/bg/grass3.webp')] pb-28 pt-5 sm:py-10">
      <div className="forest-overlay bg-[rgba(7,17,10,.78)]" />
      <div className="container-x section-content">
        <div className="mx-auto max-w-[980px]">
          <div className="mb-4">
            <Link className="btn-cream min-h-[44px] px-5" href={returnHref}>
              ← {returnLabel}
            </Link>
          </div>

          <div className="forest-card rounded-[30px] p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-[#d6c388]/30 bg-[rgba(255,255,255,.05)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">
              {eyebrow}
            </div>
            <h1 className="mt-4 text-[2rem] font-black leading-[1.05] text-[#f6efdb] sm:text-[2.5rem]">{title}</h1>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-[#efe4c8]/82 sm:text-[1rem]">{description}</p>

            <div className="mt-6 grid gap-4 rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.08)] p-5 sm:p-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className="m-0 whitespace-pre-wrap text-[0.92rem] leading-[1.72] text-[#f3ead5]/88"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {pdfPath ? (
                <a className="btn-forest min-h-[48px] px-5" href={pdfPath} target="_blank" rel="noreferrer">
                  Открыть исходный PDF
                </a>
              ) : null}
              <Link className="btn-cream min-h-[48px] px-5" href={returnHref}>
                {returnLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
