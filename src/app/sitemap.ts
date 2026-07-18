import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/base-path";

export const dynamic = "force-static";

const routes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/booking", changeFrequency: "weekly" as const, priority: 0.95 },
  { path: "/gift-certificates", changeFrequency: "monthly" as const, priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
