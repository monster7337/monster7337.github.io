"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 140, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 140, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 160);
      y.set(e.clientY - 160);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(126,165,82,0.24)_0%,rgba(201,163,91,0.14)_35%,rgba(10,18,13,0)_72%)] blur-xl"
      style={{ x: sx, y: sy }}
    />
  );
}
