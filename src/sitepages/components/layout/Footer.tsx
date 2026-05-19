import React from "react";
import Link from "next/link";
import Image from "next/image";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Twitter = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const Instagram = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const Youtube = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-white pt-24 pb-8 px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col">

        {/* Large Heading */}
        <div className="flex justify-center mb-24 text-center">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight leading-tight">
            Let's Talk <br /> With Us
          </h2>
        </div>

        {/* Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mb-16">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="flex items-center text-white text-3xl font-black italic tracking-tighter">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
              <p className="ml-3">enteropia</p>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <a href="mailto:info@twocars.com" className="text-gray-300 text-[15px] hover:text-white transition-colors">
              info@twocars.com
            </a>
            <a href="tel:0781234512112" className="text-gray-300 text-[15px] hover:text-white transition-colors">
              (078) 12345 12112
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center md:items-end text-center md:text-left text-gray-300 text-[13px] leading-relaxed">
            <p className="uppercase">8425 COASTAL COMMERCE</p>
            <p className="uppercase">BLVD,</p>
            <p className="uppercase">SUITE 310, TAMPA, FL 33619</p>
            <p className="mt-2 text-[14px]">United States</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-700/60 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-400 text-sm">
            Copyright © 2023 . All rights reserved
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7] hover:bg-[#9333ea] transition-colors">
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7] hover:bg-[#9333ea] transition-colors">
              <Twitter className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7] hover:bg-[#9333ea] transition-colors">
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7] hover:bg-[#9333ea] transition-colors">
              <Youtube className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-gray-300">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact us</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
