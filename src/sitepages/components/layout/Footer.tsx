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

  // Dynamic state for loaded services
  const [services, setServices] = useState([
    { name: "Digital Solutions & Media", href: "/services/digital-solutions-media" },
    { name: "Software Solutions", href: "/services/software-solutions" },
    { name: "App Solutions", href: "/services/app-solutions" },
    { name: "Networking & Cybersecurity", href: "/services/networking-and-secure-solutions" },
    { name: "Cloud Infrastructure", href: "/services/cloud-infrastructure" },
    { name: "AI & Machine Learning", href: "/services/ai-machine-learning" },
  ]);

  // Copy states
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Newsletter form states
  const [emailInput, setEmailInput] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setServices(
            result.data.map((s: any) => ({
              name: s.title,
              href: `/services/${s.slug}`,
            }))
          );
        }
      } catch (error) {
        // Safe fallback already defined
      }
    };
    fetchServices();
  }, []);

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
    { name: "About Us", href: "/#about", isScroll: true },
    { name: "Tech Partners", href: "/tech-partners" },
    { name: "Our Team", href: "/#team", isScroll: true },
    { name: "Careers", href: "/careers", hasBadge: true },
    { name: "Contact Us", href: "/contact" },
  ];

  const resourceLinks = [
    { name: "Help Center", href: "/support" },
    { name: "FAQs", href: "/faq" },
    { name: "Blogs & News", href: "/blogs" },
    { name: "System Status", href: "/status" },
    { name: "Developer Panel", href: "/admin" },
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
          <form onSubmit={handleSubscribe} className="relative flex items-center w-full lg:w-auto max-w-xs border border-purple-500/15 focus-within:border-purple-500/50 rounded-full bg-[#12061f]/75 px-2.5 py-0.5 transition-all focus-within:shadow-[0_0_15px_rgba(196,85,227,0.15)]">
            <input
              type="email"
              placeholder="Enter your email to connect"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none px-1 py-0.5"
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className="flex items-center gap-1 bg-[#a855f7] hover:bg-[#b86df9] disabled:bg-purple-950/60 text-white font-bold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              {subscribing ? "Connecting..." : subscribed ? "Connected!" : "Subscribe"}
              {!subscribing && !subscribed && <ArrowRight className="w-2 h-2" />}
            </button>
          </form>
        </div>

        {/* Dynamic Multi-column Links Section - Extremely Tight Grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-6">
          
          {/* Column 1: Brand Identity */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center text-white text-xl font-extrabold italic tracking-tight">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-contain" />
              <p className="ml-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">enteropia</p>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Hevit Yard Solutions delivers premium, innovative custom software, IT networks, and digital transformation.
            </p>
            
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

          {/* Column 2: Solutions */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-1.5 text-xs">
              {services.slice(0, 5).map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-gray-400 hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Company</h3>
            <ul className="space-y-1.5 text-xs">
              {companyLinks.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                    <span className="flex items-center gap-1">
                      {link.name}
                      {link.hasBadge && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          Hiring
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Resources</h3>
            <ul className="space-y-1.5 text-xs">
              {resourceLinks.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Details - Highly Compacted */}
          <div className="space-y-2">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-1.5 text-xs text-gray-400">
              
              {/* Primary Email */}
              <div className="flex flex-col relative">
                <div className="flex items-center gap-1 justify-between">
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

              {/* Call Hotline */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 justify-between">
                  <a href="tel:+18135550199" className="hover:text-white transition-colors text-xs">
                    +1 (813) 555-0199
                  </a>
                  <button 
                    onClick={() => handleCopy("+1 (813) 555-0199")}
                    className="p-0.5 rounded bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer relative"
                  >
                    {copiedText === "+1 (813) 555-0199" ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 text-purple-400/80" />
                    )}
                    {copiedText === "+1 (813) 555-0199" && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-950 border border-purple-500/30 text-white text-[10px] py-0.2 px-1.5 rounded shadow-lg whitespace-nowrap animate-bounce">
                        Copied!
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col leading-snug pt-0.5">
                <span className="text-[10px] uppercase tracking-wider text-purple-500 font-bold mb-0.5">HQ Address</span>
                <span className="text-xs">
                  8425 Coastal Commerce Blvd, Suite 310, Tampa, FL 33619
                </span>
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
            <span className="hidden md:inline text-purple-950">|</span>
            <span className="hidden md:inline">Hevit Yard Solutions Technology.</span>
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
