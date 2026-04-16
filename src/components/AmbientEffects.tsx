"use client";

import { usePathname } from "next/navigation";
import CursorWarmth from "@/components/CursorWarmth";
import WarmParticles from "@/components/WarmParticles";

export default function AmbientEffects() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <WarmParticles />
      <CursorWarmth />
    </>
  );
}
