import "./globals.css";
import type { Metadata, Viewport } from "next";
import AmbientEffects from "@/components/AmbientEffects";
import BookingRulesGate from "@/components/BookingRulesGate";
import { BOOKING_CONTACTS, BOOKING_TICKETS } from "@/lib/bookingCatalog";
import { absoluteUrl } from "@/lib/base-path";
import { faqs } from "@/components/sections/FAQ";

const seoTitle = 'Антикафе с белками и минипигами в СПб | «В Ёлках»';
const seoDescription =
  "Антикафе «В Ёлках» в центре Санкт-Петербурга: ручные белки, минипиги и бурундук, семейный отдых, фотосессии, праздники и онлайн-запись.";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: seoTitle,
  description: seoDescription,
  applicationName: "В Ёлках",
  category: "entertainment",
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
    siteName: 'Антикафе «В Ёлках»',
    title: seoTitle,
    description: seoDescription,
    images: [{ url: absoluteUrl("/bg/og-cover.jpg"), width: 1200, height: 630, alt: "Белки и минипиги в антикафе «В Ёлках»" }]
  },
  twitter: { card: "summary_large_image", title: seoTitle, description: seoDescription, images: [absoluteUrl("/bg/og-cover.jpg")] },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo/logo.webp", apple: "/logo/logo.webp" },
  other: {
    "geo.region": "RU-SPE",
    "geo.placename": "Санкт-Петербург",
    ICBM: "59.9308079, 30.3131588"
  }
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
        name: 'Антикафе «В Ёлках»',
        alternateName: ["В Елках", "В Ёлках — антикафе с белками и минипигами"],
        legalName: BOOKING_CONTACTS.legalName,
        description: seoDescription,
        url: absoluteUrl("/"),
        image: [absoluteUrl("/bg/hero.webp"), absoluteUrl("/bg/og-cover.jpg")],
        logo: absoluteUrl("/logo/logo.webp"),
        telephone: BOOKING_CONTACTS.phone,
        priceRange: "1000–1500 ₽",
        currenciesAccepted: "RUB",
        paymentAccepted: "Банковская карта, наличные, СБП",
        taxID: BOOKING_CONTACTS.inn,
        hasMap: BOOKING_CONTACTS.mapHref,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Переулок Гривцова, 3",
          addressLocality: "Санкт-Петербург",
          addressRegion: "Санкт-Петербург",
          postalCode: "190031",
          addressCountry: "RU"
        },
        geo: { "@type": "GeoCoordinates", latitude: 59.9308079, longitude: 30.3131588 },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "11:00",
          closes: "20:00"
        },
        areaServed: { "@type": "City", name: "Санкт-Петербург" },
        sameAs: [BOOKING_CONTACTS.vkHref, BOOKING_CONTACTS.telegramHref, BOOKING_CONTACTS.mapHref],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Билеты в антикафе «В Ёлках»",
          itemListElement: BOOKING_TICKETS.map((ticket) => ({
            "@type": "Offer",
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            priceCurrency: "RUB",
            availability: "https://schema.org/InStock",
            url: absoluteUrl("/booking")
          }))
        },
        potentialAction: {
          "@type": "ReserveAction",
          target: absoluteUrl("/booking"),
          result: { "@type": "Reservation", name: "Бронирование визита в антикафе «В Ёлках»" }
        }
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: 'Антикафе «В Ёлках»',
        alternateName: "В Елках",
        inLanguage: "ru-RU",
        publisher: { "@id": `${absoluteUrl("/")}#business` }
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        url: absoluteUrl("/"),
        name: seoTitle,
        description: seoDescription,
        inLanguage: "ru-RU",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        about: { "@id": `${absoluteUrl("/")}#business` },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/bg/og-cover.jpg") }
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl("/")}#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a }
        }))
      }
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
              '(()=>{const r=document.documentElement,d=()=>r.classList.add("site-ready"),q=()=>requestAnimationFrame(d);document.readyState==="loading"?addEventListener("DOMContentLoaded",q,{once:true}):q();addEventListener("pageshow",d,{once:true});setTimeout(d,1800)})()'
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
