import "./globals.css";
import type { Metadata } from "next";
import WarmParticles from "@/components/WarmParticles";
import CursorWarmth from "@/components/CursorWarmth";

export const metadata: Metadata = {
  title: 'Антикафе "В Ёлках" — минипиги и белки',
  description:
    "Место для семейного отдыха в Санкт-Петербурге: ручные минипиги, белки, чай, кофе, сладости и запись по времени.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <WarmParticles />
        <CursorWarmth />
        {children}
      </body>
    </html>
  );
}
