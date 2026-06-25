"use client";

import { useMemo } from "react";
import { useIsMobileMotion } from "@/lib/useMobileMotion";

type Particle = {
  left: number;
  offset: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

export default function WarmParticles() {
  const isMobileMotion = useIsMobileMotion();

  const embers = useMemo<Particle[]>(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        left: (index * 73) % 100,
        offset: -12 + ((index * 11) % 28),
        size: 4 + ((index * 7) % 5),
        delay: (index * 0.72) % 8,
        duration: 11 + ((index * 5) % 8) * 0.65,
        drift: -16 + ((index * 9) % 32),
      })),
    [],
  );

  const fireflies = useMemo<Particle[]>(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        left: (index * 31) % 100,
        offset: 22 + ((index * 27) % 58),
        size: 3 + ((index * 3) % 3),
        delay: (index * 0.58) % 7,
        duration: 8 + ((index * 11) % 6) * 0.55,
        drift: -9 + ((index * 13) % 18),
      })),
    [],
  );

  if (isMobileMotion) {
    return null;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {embers.map((particle, index) => (
        <span
          key={`ember-${index}`}
          className="absolute block rounded-full"
          style={{
            left: `${particle.left}%`,
            bottom: `${particle.offset}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background:
              "radial-gradient(circle, rgba(255,245,210,.92) 0%, rgba(255,210,126,.78) 42%, rgba(255,148,56,.25) 68%, transparent 86%)",
            boxShadow: "0 0 12px rgba(255,205,118,.55)",
            animation: `ember-rise ${particle.duration}s linear ${particle.delay}s infinite`,
            willChange: "transform, opacity",
            ["--drift-x" as string]: `${particle.drift}px`,
          }}
        />
      ))}

      {fireflies.map((particle, index) => (
        <span
          key={`firefly-${index}`}
          className="absolute block rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.offset}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background:
              "radial-gradient(circle, rgba(255,248,226,.95) 0%, rgba(255,224,153,.72) 46%, transparent 100%)",
            boxShadow: "0 0 9px rgba(255,224,150,.58)",
            animation: `twinkle-drift ${particle.duration}s ease-out ${particle.delay}s infinite`,
            willChange: "transform, opacity",
            ["--drift-x" as string]: `${particle.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
