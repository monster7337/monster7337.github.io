"use client";

import { useEffect, useRef } from "react";

type ModalViewportLockOptions = {
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function useModalViewportLock({ isOpen, onClose, onPrevious, onNext }: ModalViewportLockOptions) {
  const lockedScrollRef = useRef(0);
  const handlersRef = useRef({ onClose, onPrevious, onNext });

  useEffect(() => {
    handlersRef.current = { onClose, onPrevious, onNext };
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    lockedScrollRef.current = window.scrollY;

    const html = document.documentElement;
    const body = document.body;
    const previousScrollBehavior = html.style.scrollBehavior;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handlersRef.current.onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlersRef.current.onPrevious?.();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handlersRef.current.onNext?.();
      }
    };

    html.style.scrollBehavior = "auto";
    html.classList.add("modal-open");
    body.classList.add("modal-open");

    body.style.position = "fixed";
    body.style.top = `-${lockedScrollRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      html.classList.remove("modal-open");
      body.classList.remove("modal-open");

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      window.scrollTo(0, lockedScrollRef.current);

      window.requestAnimationFrame(() => {
        html.style.scrollBehavior = previousScrollBehavior;
      });
    };
  }, [isOpen]);
}
