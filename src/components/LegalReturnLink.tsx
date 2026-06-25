"use client";

import { useSearchParams } from "next/navigation";

type LegalReturnLinkProps = {
  defaultHref: string;
  defaultLabel: string;
};

export default function LegalReturnLink({ defaultHref, defaultLabel }: LegalReturnLinkProps) {
  const searchParams = useSearchParams();
  const requestedHref = searchParams.get("returnTo");
  const returnHref = requestedHref?.startsWith("/") ? requestedHref : defaultHref;
  const returnLabel = returnHref.includes("gift-certificates") ? "Вернуться к сертификату" : defaultLabel;

  return (
    <div className="mt-6">
      <a className="btn-cream min-h-[44px] px-5" href={returnHref}>
        {returnLabel}
      </a>
    </div>
  );
}
