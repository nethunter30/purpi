"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

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

    lenisRef.current = lenis;

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

    // Dynamic resize observer for document height changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
      });
      resizeObserver.observe(document.body);
    }

    // Cleanup on unmount
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
      }
    };
  }, []);

  // Listen for route changes
  useEffect(() => {
    if (lenisRef.current) {
      // Instantly scroll to top on route change
      lenisRef.current.scrollTo(0, { immediate: true });
      // Recalculate dimensions immediately
      lenisRef.current.resize();
    }
  }, [pathname]);

  return <>{children}</>;
}
