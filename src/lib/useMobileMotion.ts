"use client";

import { useMemo, useSyncExternalStore } from "react";

const MOBILE_MOTION_QUERY = "(max-width: 767px), (pointer: coarse)";

type RevealMotionOptions = {
  amount?: number;
  desktopDelayStep?: number;
  desktopDistance?: number;
  desktopDuration?: number;
  mobileDelayStep?: number;
  mobileDistance?: number;
  mobileDuration?: number;
};

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(MOBILE_MOTION_QUERY);
  const listener = () => onStoreChange();

  mediaQuery.addEventListener("change", listener);
  return () => mediaQuery.removeEventListener("change", listener);
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(MOBILE_MOTION_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobileMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useScrollRevealMotion({
  amount = 0.2,
  desktopDelayStep = 0.06,
  desktopDistance = 12,
  desktopDuration = 0.42,
  mobileDelayStep = 0,
  mobileDistance = 8,
  mobileDuration = 0.3,
}: RevealMotionOptions = {}) {
  const isMobileMotion = useIsMobileMotion();

  return useMemo(() => {
    const distance = isMobileMotion ? mobileDistance : desktopDistance;
    const duration = isMobileMotion ? mobileDuration : desktopDuration;
    const delayStep = isMobileMotion ? mobileDelayStep : desktopDelayStep;

    return (index = 0) => ({
      initial: { opacity: 0, y: distance },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount },
      transition: {
        duration,
        delay: index * delayStep,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    });
  }, [amount, desktopDelayStep, desktopDistance, desktopDuration, isMobileMotion, mobileDelayStep, mobileDistance, mobileDuration]);
}
