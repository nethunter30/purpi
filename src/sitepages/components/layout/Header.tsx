"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute bg-[#140620] top-0 w-full z-50 py-6 px-8 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center text-white text-3xl font-black italic tracking-tighter">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
          <p className="ml-3">enteropia</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-200">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/solutions" className="hover:text-white transition-colors">
          Solutions
        </Link>
        <Link href="/tech-partners" className="hover:text-white transition-colors">
          Tech Partners
        </Link>
        <Link href="/contact" className="hover:text-white transition-colors">
          Contact Us
        </Link>
        <div className="flex items-center cursor-pointer group hover:text-white transition-colors">
          <span>About Us</span>
          <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      </nav>

      {/* Call to Action */}
      <div className="flex items-center">
        <Link
          href="/get-started"
          className="group flex items-center gap-3 px-6 py-2.5 rounded-full border border-purple-500/30 bg-purple-900/10 hover:bg-purple-800/30 transition-all text-white text-sm font-medium"
        >
          Get Started
          <div className="bg-purple-600 rounded-full p-1 group-hover:bg-purple-500 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
