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

    // Intercept click events on hash links to smooth scroll using Lenis
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest("a");
      if (!closestLink) return;

      const href = closestLink.getAttribute("href");
      if (href && href.includes("#") && !href.startsWith("http") && !href.startsWith("//")) {
        const [path, hash] = href.split("#");
        const currentPath = window.location.pathname;
        const targetPath = path === "" ? currentPath : path;

        if (targetPath === currentPath) {
          try {
            const cleanHash = hash.split("?")[0];
            const targetId = decodeURIComponent(cleanHash);
            const element = document.getElementById(targetId);
            if (element) {
              e.preventDefault();
              lenis.scrollTo(element, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
              window.history.pushState(null, "", `#${cleanHash}`);
            }
          } catch (err) {
            console.error("Error in smooth scroll click handler:", err);
          }
        }
      }
    };

    document.addEventListener("click", handleHashClick);

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
      document.removeEventListener("click", handleHashClick);
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
      const hash = window.location.hash;
      if (hash) {
        // Wait a short moment for Next.js to render/mount the target page's elements
        setTimeout(() => {
          try {
            const cleanHash = hash.split("?")[0];
            const targetId = decodeURIComponent(cleanHash.substring(1));
            const element = document.getElementById(targetId);
            if (element && lenisRef.current) {
              lenisRef.current.scrollTo(element, { immediate: true });
            } else if (lenisRef.current) {
              lenisRef.current.scrollTo(0, { immediate: true });
            }
          } catch (err) {
            console.error("Error scrolling to hash target on route change:", err);
            if (lenisRef.current) {
              lenisRef.current.scrollTo(0, { immediate: true });
            }
          }
        }, 100);
      } else {
        // Instantly scroll to top on route change
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      // Recalculate dimensions immediately
      lenisRef.current.resize();
    }
  }, [pathname]);

  return <>{children}</>;
}
