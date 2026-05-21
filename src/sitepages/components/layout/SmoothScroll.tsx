"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
    });

    // Request Animation Frame loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Expose lenis globally for modal scroll locking
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}
