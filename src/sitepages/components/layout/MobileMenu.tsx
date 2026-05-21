"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  Home,
  LayoutGrid,
  Users,
  PhoneCall,
  ChevronRight,
  HelpCircle,
  Briefcase,
  BookOpen
} from "lucide-react";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />
    },
    {
      name: "Services",
      href: "/#services",
      icon: <LayoutGrid className="w-4 h-4" />
    },
    {
      name: "Our Team",
      href: "/#team",
      icon: <Users className="w-4 h-4" />
    },
    {
      name: "Our Works",
      href: "/our-work",
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      name: "Blogs",
      href: "/blog",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      name: "About Us",
      href: "/about-us",
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      name: "Contact Us",
      href: "/#contact",
      icon: <PhoneCall className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#07010f]/80 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[320px] bg-[#140620] border-l border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Glow ambient effects inside drawer */}
        <div className="absolute top-[-10%] left-[-20%] w-[250px] h-[250px] rounded-full bg-purple-700/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[250px] h-[250px] rounded-full bg-fuchsia-700/10 blur-[80px] pointer-events-none" />

        {/* Header section of Mobile Menu */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-purple-500/10">
          <Link href="/" className="flex items-center text-white text-xl font-bold tracking-tighter" onClick={onClose}>
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="ml-2 font-black">enteropia</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-purple-500/20 bg-purple-900/10 hover:bg-purple-800/30 transition-all text-white/80 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Links */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest pl-2">Navigation</p>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-purple-500/10 hover:bg-purple-900/10 transition-all text-white/90 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-900/20 text-purple-400 group-hover:bg-purple-800/40 group-hover:text-purple-300 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-400" />
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA and Footer section inside drawer */}
        <div className="relative z-10 p-6 border-t border-purple-500/10 bg-[#0b0214]/60 backdrop-blur-sm flex flex-col gap-4">
          <Link
            href="/#contact"
            onClick={onClose}
            className="group flex items-center justify-center gap-3 w-full py-3.5 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            Get Started
            <div className="bg-white/20 rounded-full p-0.5 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
          <div className="text-center">
            <span className="text-[10px] text-gray-500 tracking-wider font-medium">
              &copy; {new Date().getFullYear()} enteropia. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
