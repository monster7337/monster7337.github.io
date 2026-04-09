"use client";

import { motion } from "framer-motion";

type WaveDividerProps = {
  soft?: boolean;
};

export default function WaveDivider({ soft = false }: WaveDividerProps) {
  return (
    <div aria-hidden className="relative h-10 overflow-hidden border-y border-[#a48c4b]/35 bg-[rgba(7,17,10,.6)]">
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: soft ? [0.55, 0.75, 0.55] : [0.7, 1, 0.7] }}
        transition={{ duration: soft ? 8 : 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          fill="rgba(212,186,124,.35)"
          animate={{
            d: [
              "M0,52 C220,82 420,18 720,52 C1020,86 1220,24 1440,52 L1440,100 L0,100 Z",
              "M0,48 C220,22 420,86 720,48 C1020,14 1220,82 1440,48 L1440,100 L0,100 Z",
              "M0,52 C220,82 420,18 720,52 C1020,86 1220,24 1440,52 L1440,100 L0,100 Z",
            ],
          }}
          transition={{ duration: soft ? 10 : 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
