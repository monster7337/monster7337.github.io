"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useIsMobileMotion } from "@/lib/useMobileMotion";

export default function CursorWarmth() {
  const isMobileMotion = useIsMobileMotion();
  const x = useMotionValue(-220);
  const y = useMotionValue(-220);

  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (isMobileMotion) {
      return undefined;
    }

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 120);
      y.set(e.clientY - 120);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobileMotion, x, y]);

  if (isMobileMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[68] h-60 w-60 rounded-full"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(255,198,117,.22) 0%, rgba(240,151,60,.13) 33%, rgba(18,31,19,0) 72%)",
        filter: "blur(8px)",
      }}
    />
  );
}
