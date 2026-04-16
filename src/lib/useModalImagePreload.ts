"use client";

import { useEffect, useRef } from "react";

type UseModalImagePreloadOptions = {
  urls: readonly string[];
  isOpen: boolean;
  activeIndex: number | null;
  immediateRadius?: number;
  preloadAll?: boolean;
};

function normalizeIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function primeImage(src: string, fetchPriority: "high" | "low" = "low") {
  const image = new window.Image();
  image.decoding = "async";
  image.loading = "eager";

  if ("fetchPriority" in image) {
    image.fetchPriority = fetchPriority;
  }

  image.src = src;
}

export function useModalImagePreload({
  urls,
  isOpen,
  activeIndex,
  immediateRadius = 2,
  preloadAll = false,
}: UseModalImagePreloadOptions) {
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen || activeIndex === null || !urls.length) {
      return undefined;
    }

    const warmImage = (index: number, fetchPriority: "high" | "low" = "low") => {
      const src = urls[normalizeIndex(index, urls.length)];

      if (loadedRef.current.has(src)) {
        return;
      }

      loadedRef.current.add(src);
      primeImage(src, fetchPriority);
    };

    warmImage(activeIndex, "high");

    for (let offset = 1; offset <= Math.min(immediateRadius, urls.length - 1); offset += 1) {
      warmImage(activeIndex + offset);
      warmImage(activeIndex - offset);
    }

    if (!preloadAll) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      urls.forEach((src) => {
        if (loadedRef.current.has(src)) {
          return;
        }

        loadedRef.current.add(src);
        primeImage(src);
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [activeIndex, immediateRadius, isOpen, preloadAll, urls]);
}
