"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import ServiceSearch from "./ServiceSearch";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 py-2 px-4 sm:py-2 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-purple-950/20 backdrop-blur-md border-b border-purple-950/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-purple-950/20 backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-white text-2xl font-black tracking-tighter">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
              <Image src="/logo.png" alt="Logo" fill className="object-contain animate-[spin_10s_linear_infinite]" />
            </div>
            <p className="ml-1  font-bold">enter<span className="text-purple-500">opia</span></p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-200">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/#team" className="hover:text-white transition-colors">
            Our Team
          </Link>
          <Link href="/industries" className="hover:text-white transition-colors">
            Industries
          </Link>
          <Link href="/solutions" className="hover:text-white transition-colors">
            Solutions
          </Link>
          {/* About Dropdown */}
          <div className="relative group py-2">
            <Link href="/about-us" className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              About Us
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:rotate-180" />
            </Link>
            <div className="absolute left-0 mt-2 w-40 rounded-sm bg-[#140620] border border-purple-950/30 p-2 shadow-2xl transition-all duration-300 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 flex flex-col gap-2 z-50">
              <Link href="/our-work" className="px-3 py-1.5 rounded-sm hover:bg-purple-950/30 text-xs text-gray-300 hover:text-white transition-all">
                Our Works
              </Link>
              <Link href="/blog" className="px-3 py-1.5 rounded-sm hover:bg-purple-950/30 text-xs text-gray-300 hover:text-white transition-all">
                Blogs
              </Link>
            </div>
          </div>
          <Link href="/#contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Call to Action & Hamburger Menu */}
        <div className="flex items-center gap-3">
          {/* Services Search Engine */}
          <ServiceSearch />

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden p-2 rounded-full border border-purple-500/20 bg-purple-900/10 hover:bg-purple-800/30 text-white/90 hover:text-white transition-all"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
