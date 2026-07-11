import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/base-path";

export const dynamic = "force-static";

const routes = ["/", "/booking", "/gift-certificates"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: absoluteUrl(route) }));
}
