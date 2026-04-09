"use client";

import { motion } from "framer-motion";

type SectionWaveProps = {
  flip?: boolean;
};

export default function SectionWave({ flip = false }: SectionWaveProps) {
  return (
    <div
      aria-hidden
      className={`container-x -mt-2 ${flip ? "rotate-180" : ""}`}
    >
      <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-forest-900/40">
        <motion.svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-10 w-[200%] sm:h-12"
          initial={{ x: 0 }}
          animate={{ x: [0, -600] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M0,48 C150,128 350,0 600,48 C850,96 1050,16 1200,48 L1200,120 L0,120 Z"
            fill="rgba(243,234,219,0.08)"
          />
          <path
            d="M1200,48 C1350,128 1550,0 1800,48 C2050,96 2250,16 2400,48 L2400,120 L1200,120 Z"
            fill="rgba(126,165,82,0.16)"
          />
        </motion.svg>
      </div>
    </div>
  );
}
