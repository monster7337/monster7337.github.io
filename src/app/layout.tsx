import "./globals.css";
import type { Metadata, Viewport } from "next";
import AmbientEffects from "@/components/AmbientEffects";
import BookingRulesGate from "@/components/BookingRulesGate";
import { BOOKING_CONTACTS } from "@/lib/bookingCatalog";
import { absoluteUrl } from "@/lib/base-path";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: 'Антикафе с животными «В Ёлках» — минипиги и белки в СПб',
  description:
    "Антикафе с животными в центре Санкт-Петербурга: ручные минипиги, белки и бурундук, семейный отдых, свидания, фото, чай и онлайн-запись.",
  keywords: [
    "антикафе с минипигами санкт-петербург",
    "антикафе с белками спб",
    "где погладить минипига в спб",
    "куда сходить с детьми в спб",
    "свидание с животными спб"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: absoluteUrl("/"),
    siteName: 'Антикафе "В Ёлках"',
    title: 'Антикафе "В Ёлках" — минипиги и белки в СПб',
    description: "Встречи с ручными минипигами и белками в центре Санкт-Петербурга.",
    images: [{ url: absoluteUrl("/bg/og-cover.jpg"), width: 1200, height: 630, alt: 'Антикафе "В Ёлках"' }]
  },
  twitter: { card: "summary_large_image", title: 'Антикафе "В Ёлках"', description: "Минипиги и белки в самом центре СПб.", images: [absoluteUrl("/bg/og-cover.jpg")] },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo/logo.webp", apple: "/logo/logo.webp" }
};

export const viewport: Viewport = {
  themeColor: "#0b170f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${absoluteUrl("/")}#business`,
        name: 'Антикафе "В Ёлках"',
        description: "Антикафе с минипигами и белками в Санкт-Петербурге.",
        url: absoluteUrl("/"),
        image: absoluteUrl("/bg/hero.webp"),
        telephone: BOOKING_CONTACTS.phone,
        priceRange: "1000-1500 RUB",
        address: { "@type": "PostalAddress", streetAddress: "Переулок Гривцова, 3", addressLocality: "Санкт-Петербург", addressCountry: "RU" },
        sameAs: [BOOKING_CONTACTS.vkHref, BOOKING_CONTACTS.telegramHref]
      },
      { "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, url: absoluteUrl("/"), name: 'Антикафе "В Ёлках"', inLanguage: "ru-RU" }
    ]
  };

  return (
    <html lang="ru">
      <body>
        <div className="site-load-progress" aria-hidden="true">
          <span />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(()=>{const r=document.documentElement,d=()=>r.classList.add("site-ready");document.readyState==="complete"?requestAnimationFrame(d):addEventListener("load",d,{once:true});setTimeout(d,8000)})()'
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <AmbientEffects />
        <BookingRulesGate />
        {children}
      </body>
    </html>
  );
}
