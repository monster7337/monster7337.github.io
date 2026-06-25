"use client";

import { usePathname } from "next/navigation";
import WarmParticles from "@/components/WarmParticles";

export default function AmbientEffects() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <WarmParticles />;
}
