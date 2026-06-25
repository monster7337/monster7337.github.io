type LegalSection = {
  title: string;
  content: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  returnHref?: string;
  returnLabel?: string;
};

export default function LegalPage({ eyebrow, title, intro, sections, returnHref = "/booking", returnLabel = "Вернуться к записи" }: LegalPageProps) {
  return (
    <main className="forest-section min-h-screen bg-[url('/bg/grass3.webp')] py-10 sm:py-14">
      <div className="forest-overlay bg-[rgba(7,17,10,.78)]" />
      <div className="container-x section-content">
        <div className="mx-auto max-w-[860px]">
          <div className="forest-card rounded-[30px] p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-[#d6c388]/30 bg-[rgba(255,255,255,.05)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#e8d9b4]">
              {eyebrow}
            </div>
            <h1 className="mt-4 text-[2rem] font-black leading-[1.05] text-[#f6efdb] sm:text-[2.5rem]">{title}</h1>
            <p className="mt-4 text-[0.95rem] leading-[1.7] text-[#efe4c8]/82 sm:text-[1rem]">{intro}</p>

            <div className="mt-6 space-y-4">
              {sections.map((section) => (
                <section key={section.title} className="rounded-[24px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4 sm:p-5">
                  <h2 className="text-[1rem] font-black text-[#f6efdb] sm:text-[1.1rem]">{section.title}</h2>
                  <div className="mt-3 space-y-2 text-[0.92rem] leading-[1.65] text-[#efe4c8]/84">
                    {section.content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <Suspense
              fallback={
                <div className="mt-6">
                  <a className="btn-cream min-h-[44px] px-5" href={returnHref}>
                    {returnLabel}
                  </a>
                </div>
              }
            >
              <LegalReturnLink defaultHref={returnHref} defaultLabel={returnLabel} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
import { Suspense } from "react";
import LegalReturnLink from "@/components/LegalReturnLink";
