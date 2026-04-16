import "./globals.css";
import type { Metadata } from "next";
import AmbientEffects from "@/components/AmbientEffects";

export const metadata: Metadata = {
  title: 'Антикафе "В Ёлках" — минипиги и белки',
  description:
    "Место для семейного отдыха в Санкт-Петербурге: ручные минипиги, белки, чай, кофе, сладости и запись по времени.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AmbientEffects />
        {children}
      </body>
    </html>
  );
}
