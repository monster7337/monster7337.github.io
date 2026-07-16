import HomePageClient from "@/components/HomePageClient";
import { absoluteUrl } from "@/lib/base-path";

export const metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function Page() {
  return <HomePageClient />;
}
