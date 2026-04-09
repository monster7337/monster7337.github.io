"use client";

import { useEffect, useMemo, useRef } from "react";

type Ember = {
  left: number;
  bottom: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

type Firefly = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

export default function WarmParticles() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const embers = useMemo<Ember[]>(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 73) % 100,
        bottom: -14 + ((i * 11) % 34),
        size: 4 + ((i * 7) % 6),
        delay: (i * 0.42) % 7,
        duration: 9 + ((i * 5) % 10) * 0.55,
        drift: -18 + ((i * 9) % 36),
      })),
    [],
  );

  const fireflies = useMemo<Firefly[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: (i * 31) % 100,
        top: 20 + ((i * 27) % 64),
        size: 3 + ((i * 3) % 3),
        delay: (i * 0.34) % 6,
        duration: 6 + ((i * 11) % 8) * 0.4,
        drift: -10 + ((i * 13) % 20),
      })),
    [],
  );

  useEffect(() => {
    let raf = 0;
    const applyLayer = (opacity: number, blur: number, scale: number) => {
      const node = layerRef.current;
      if (!node) return;
      node.style.opacity = String(opacity);
      node.style.filter = `blur(${blur}px)`;
      node.style.transform = `scale(${scale})`;
    };

    const showIdle = () => applyLayer(0.92, 0, 1);
    const showScrolling = () => applyLayer(0.08, 13, 0.965);

    const onScroll = () => {
      if (!raf) {
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          showScrolling();
        });
      }

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        showIdle();
      }, 180);
    };

    showIdle();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden transition-[opacity,filter,transform] duration-300"
    >
      {embers.map((e, i) => (
        <span
          key={`ember-${i}`}
          className="absolute block rounded-full"
          style={{
            left: `${e.left}%`,
            bottom: `${e.bottom}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background:
              "radial-gradient(circle, rgba(255,245,210,.95) 0%, rgba(255,210,126,.84) 40%, rgba(255,148,56,.34) 65%, rgba(255,132,40,0) 85%)",
            boxShadow: "0 0 14px rgba(255,205,118,.72), 0 0 26px rgba(255,162,70,.32)",
            animationName: "ember-rise, ember-flicker",
            animationDuration: `${e.duration}s, ${Math.max(2.4, e.duration * 0.46)}s`,
            animationDelay: `${e.delay}s, ${e.delay / 1.8}s`,
            animationIterationCount: "infinite, infinite",
            animationTimingFunction: "linear, ease-in-out",
            willChange: "transform, opacity, filter",
            ["--drift-x" as string]: `${e.drift}px`,
          }}
        />
      ))}

      {fireflies.map((f, i) => (
        <span
          key={`firefly-${i}`}
          className="absolute block rounded-full"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            background:
              "radial-gradient(circle, rgba(255,248,226,1) 0%, rgba(255,224,153,.85) 44%, rgba(255,183,90,.2) 74%, rgba(255,154,72,0) 100%)",
            boxShadow: "0 0 10px rgba(255,224,150,.8), 0 0 18px rgba(255,184,86,.24)",
            animationName: "twinkle-drift, ember-flicker",
            animationDuration: `${f.duration}s, ${Math.max(2.2, f.duration * 0.6)}s`,
            animationDelay: `${f.delay}s, ${f.delay / 2}s`,
            animationIterationCount: "infinite, infinite",
            animationTimingFunction: "ease-out, ease-in-out",
            willChange: "transform, opacity, filter",
            ["--drift-x" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
