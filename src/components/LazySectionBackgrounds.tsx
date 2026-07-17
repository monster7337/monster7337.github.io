"use client";

import { useEffect } from "react";

export default function LazySectionBackgrounds() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-lazy-background]"));

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("lazy-background-ready"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("lazy-background-ready");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "600px 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
