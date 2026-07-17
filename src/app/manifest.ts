import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Антикафе "В Ёлках"',
    short_name: "В Ёлках",
    description: "Антикафе с белками и минипигами в Санкт-Петербурге.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b170f",
    theme_color: "#0b170f",
    lang: "ru",
    icons: [
      {
        src: "/logo/logo.webp",
        sizes: "256x256",
        type: "image/webp",
      },
    ],
  };
}
