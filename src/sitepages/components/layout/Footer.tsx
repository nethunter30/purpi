"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronUp, Copy, Check, Clock, Mail, Phone, MapPin } from "lucide-react";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();


  // Dynamic categories from the DB via the category API
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/services/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        } else {
          setCategoriesError(true);
        }
      } catch (err) {
        console.error("Error fetching categories in Footer:", err);
        setCategoriesError(true);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Copy states
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Newsletter form states
  const [emailInput, setEmailInput] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribing(true);
    // Simulate dynamic backend call, mock safe finish
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubscribed(true);
    setEmailInput("");
    setSubscribing(false);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const companyLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us", isScroll: true },
    { name: "Industries", href: "/industries" },
    { name: "Solutions", href: "/solutions" },
    { name: "Our Team", href: "/#team", isScroll: true },
    { name: "Blogs & News", href: "/blogs" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-[#0c0414] text-white pt-8 pb-4 px-6 md:px-8 relative z-20 border-t border-purple-950/20 overflow-hidden">

      {/* Background ambient glow overlay */}
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[250px] h-[250px] bg-purple-900/5 rounded-full blur-[70px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto flex flex-col relative z-10">

        {/* Dynamic & Hyper-Compact Top Banner Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-purple-950/20 pb-4 mb-6 gap-4">
          <div className="max-w-md">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-[#c455e3] bg-clip-text text-transparent mb-0.5 tracking-tight">
              Ready to supercharge your business?
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Contact enteropia today. Let's design custom software, high-speed networks, and future-ready IT infrastructure.
            </p>
          </div>

          {/* Interactive Compact Subscription */}
          <Link href="/#contact">
            <button className="flex items-center gap-1 bg-[#a855f7] hover:bg-[#b86df9] disabled:bg-purple-950/60 text-white font-bold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full transition-all cursor-pointer whitespace-nowrap">
              Let's Connect!
              <ArrowRight className="w-2 h-2" />
            </button>
          </Link>
        </div>

        {/* Dynamic Multi-column Links Section - Extremely Tight Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-6">

          {/* Column 1: Brand Identity */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center text-white text-xl font-extrabold tracking-tight">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
              <p className="ml-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">enteropia</p>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Your dedicated engineering partner — from architecture to deployment.</p>
            {/* Social Icons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <a href="#" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c0f2b] border border-purple-500/10 text-gray-400 hover:text-white hover:bg-[#a855f7] hover:border-transparent transition-all duration-300" title="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c0f2b] border border-purple-500/10 text-gray-400 hover:text-white hover:bg-[#a855f7] hover:border-transparent transition-all duration-300" title="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c0f2b] border border-purple-500/10 text-gray-400 hover:text-white hover:bg-[#a855f7] hover:border-transparent transition-all duration-300" title="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1c0f2b] border border-purple-500/10 text-gray-400 hover:text-white hover:bg-[#a855f7] hover:border-transparent transition-all duration-300" title="Youtube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Services</h3>
            <ul className="space-y-1.5 text-xs">
              {categoriesLoading ? (
                // Skeleton shimmer rows while fetching
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i}>
                    <span className="inline-block h-3 rounded bg-purple-950/40 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                  </li>
                ))
              ) : categoriesError ? (
                <li className="text-gray-600 text-[11px]">Could not load services.</li>
              ) : categories.length === 0 ? (
                <li className="text-gray-600 text-[11px]">No services found.</li>
              ) : (
                categories.slice(0, 5).map((category) => (
                  <li key={category.slug}>
                    <Link href={`/services/${category.slug}`} className="text-gray-400 hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Company</h3>
            <ul className="space-y-1.5 text-xs">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                    <span className="flex items-center gap-1">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Details - Highly Compacted */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-2.5 text-xs text-gray-400">

              {/* Emails */}
              <div className="space-y-1.5">
                {/* Primary Email */}
                <div className="flex flex-col relative">
                  <div className="flex items-center gap-2 justify-start">
                    <a href="mailto:info@enteropia.com" className="hover:text-white transition-colors truncate text-xs">
                      info@enteropia.com
                    </a>
                    <button
                      onClick={() => handleCopy("info@enteropia.com")}
                      className="p-0.5 rounded bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer relative"
                    >
                      {copiedText === "info@enteropia.com" ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-purple-400/80" />
                      )}
                      {copiedText === "info@enteropia.com" && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-950 border border-purple-500/30 text-white text-[10px] py-0.2 px-1.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Secondary Email */}
                <div className="flex flex-col relative">
                  <div className="flex items-center gap-2 justify-start">
                    <a href="mailto:enteropia.dev@gmail.com" className="hover:text-white transition-colors truncate text-xs">
                      enteropia.dev@gmail.com
                    </a>
                    <button
                      onClick={() => handleCopy("enteropia.dev@gmail.com")}
                      className="p-0.5 rounded bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer relative"
                    >
                      {copiedText === "enteropia.dev@gmail.com" ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-purple-400/80" />
                      )}
                      {copiedText === "enteropia.dev@gmail.com" && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-950 border border-purple-500/30 text-white text-[10px] py-0.2 px-1.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-1.5">
                {/* Call Hotline */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 justify-start">
                    <a href="tel:+919900112530" className="hover:text-white transition-colors text-xs">
                      +91 9900112530
                    </a>
                    <button
                      onClick={() => handleCopy("+919900112530")}
                      className="p-0.5 rounded bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer relative"
                    >
                      {copiedText === "+919900112530" ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-purple-400/80" />
                      )}
                      {copiedText === "+919900112530" && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-950 border border-purple-500/30 text-white text-[10px] py-0.2 px-1.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 justify-start">
                    <a
                      href="https://wa.me/918150903035"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors text-xs"
                    >
                      +91 8150903035 (WhatsApp)
                    </a>
                    <button
                      onClick={() => handleCopy("+91 8150903035")}
                      className="p-0.5 rounded bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer relative"
                    >
                      {copiedText === "+91 8150903035" ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-purple-400/80" />
                      )}
                      {copiedText === "+91 8150903035" && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-950 border border-purple-500/30 text-white text-[10px] py-0.2 px-1.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-purple-950/20 mb-4" />

        {/* Bottom Bar - Extremely Premium and Tighter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
            <span>Copyright © {currentYear} enteropia. All rights reserved.</span>
          </div>

          {/* Legal Links & Back-To-Top */}
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {legalLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-500 hover:text-white transition-colors duration-250">
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Back to Top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center justify-center w-6 h-6 rounded-full border border-purple-500/10 bg-[#12061f] text-gray-400 hover:text-white hover:border-[#a855f7] hover:shadow-[0_0_10px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer"
              title="Scroll to top"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
