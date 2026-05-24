"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Server,
    GraduationCap,
    ShieldAlert,
    Store,
    Rocket,
    Check,
    ArrowRight,
    ChevronRight
} from "lucide-react";
import { SolutionItem } from "../../../lib/solutionsData";

// Icon map for dynamic lookup
const iconMap: Record<string, React.ComponentType<any>> = {
    Server,
    GraduationCap,
    ShieldAlert,
    Store,
    Rocket
};

interface SolutionsClientProps {
    solutions: SolutionItem[];
}

export default function SolutionsClient({ solutions }: SolutionsClientProps) {
    return (
        <div className="relative min-h-screen bg-[#140620] text-white flex flex-col overflow-x-hidden">

            {/* ── HERO HEADER SECTION ── */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-6 flex flex-col items-center z-10 w-full bg-[#140620]">

                {/* Subtle grid pattern & glow effects */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
                <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-purple-700/10 via-fuchsia-850/5 to-transparent blur-[130px] pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-700/10 via-indigo-900/5 to-transparent blur-[130px] pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-25 w-full max-w-7xl mx-auto flex flex-col items-center">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-widest text-purple-400/80">
                        <Link href="/" className="hover:text-purple-300 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-gray-300">Solutions</span>
                    </nav>

                    {/* Heading Row with Floating Abstract Graphic */}
                    <div className="flex flex-col lg:flex-row items-center lg:justify-start gap-10 lg:gap-20 w-full mt-4">

                        {/* Text block */}
                        <div className="flex-1 text-center lg:text-left space-y-6 max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                                Industry Solutions
                            </h1>
                            <p className="text-purple-200/80 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-light">
                                Pre-configured IT packages for your business vertical. Designed to get you up and running fast.
                            </p>
                        </div>

                        {/* Glowing Website Logo Container */}
                        <div className="relative w-72 h-72 md:w-80 md:h-80 flex-shrink-0 flex items-center justify-center select-none pointer-events-none">
                            {/* Dual neon glow effects */}
                            {/* <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[40px] animate-pulse" />
              <div className="absolute inset-4 bg-blue-500/10 rounded-full blur-[20px]" /> */}

                            {/* Rotating logo icon */}
                            <div className="relative w-56 h-56 md:w-64 md:h-64 animate-[spin_20s_linear_infinite]">
                                <Image
                                    src="/logo.png"
                                    alt="enteropia Logo"
                                    fill
                                    sizes="(max-width: 768px) 224px, 256px"
                                    className="object-contain"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ── CARDS SECTION (DARK CONTRAST LAYOUT) ── */}
            <section className="relative w-full bg-black text-slate-800 flex-1 py-16 md:py-24 z-20">

                {/* Soft slate wave transition element at top */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#140620]/15 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">

                    {/* Flex Wrap Container to center bottom trailing rows */}
                    <div className="flex flex-wrap justify-center gap-6 lg:gap-8">

                        {solutions.map((item) => {
                            const IconComponent = iconMap[item.iconName] || Server;

                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col bg-black/40 backdrop-blur-md shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 w-72 sm:w-[320px]"
                                >

                                    {/* Top image illustration */}
                                    <div className="relative w-full h-36 sm:h-40 flex-shrink-0 bg-slate-800 overflow-hidden border-b border-white/10">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-103"
                                        />
                                        {/* Visual fade overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Info Content block */}
                                    <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 flex-1 flex flex-col justify-between">

                                        <div>
                                            {/* Icon & Title Row */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-white/10 flex-shrink-0">
                                                    <IconComponent className="w-4 h-4 stroke-[2.2]" />
                                                </div>
                                                <h3 className="text-[15px] sm:text-base font-extrabold text-white tracking-tight group-hover:text-purple-400 transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            {/* Description */}
                                            <p className="text-slate-400 text-[11px] sm:text-xs leading-snug mb-1 font-light line-clamp-1">
                                                {item.description}
                                            </p>

                                            {/* Features Bullet List */}
                                            <ul className="space-y-0.5 mb-2">
                                                {item.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-2 text-slate-400 text-xs sm:text-[13px]">
                                                        <div className="mt-0.5 w-3 h-3 rounded-full bg-purple-500/20 border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                                                            <Check className="w-2 h-2 stroke-[2.5]" />
                                                        </div>
                                                        <span className="font-normal text-slate-300 leading-snug">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Bottom Pricing & Action Section */}
                                        <div className="border-t border-white/10 pt-2 flex items-center justify-between mt-auto">

                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Starting from</span>
                                                <span className="text-sm sm:text-base font-black text-purple-400 tracking-tight font-mono mt-0.5">
                                                    {item.startingPrice}
                                                </span>
                                            </div>

                                            <Link
                                                href={item.learnMoreUrl}
                                                className="group/btn flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider"
                                            >
                                                Learn More
                                                <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>
            </section>

            {/* 3) How We Work Section */}
            <section className="relative w-full bg-[#140620] py-20 overflow-hidden">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Heading */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-16">
                        How We Work
                    </h2>

                    {/* Steps Timeline */}
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-0">

                        {/* Connecting line (desktop only) */}

                        <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-500/60 via-purple-400/40 to-purple-500/60" />

                        {[
                            { step: "1", title: "Assessment", desc: "Evaluate current infrastructure and identify gaps." },
                            { step: "2", title: "Design", desc: "Create tailored solution architecture." },
                            { step: "3", title: "Deployment", desc: "Implement with minimal disruption." },
                            { step: "4", title: "Support", desc: "Ongoing management and optimization." },
                        ].map(({ step, title, desc }) => (
                            <div key={step} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4 px-2">
                                {/* Circle */}
                                <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center text-white font-black text-base mb-4 shadow-[0_0_18px_rgba(168,85,247,0.5)]">
                                    {step}
                                </div>
                                <h3 className="text-white font-bold text-sm md:text-base mb-1">{title}</h3>
                                <p className="text-slate-400 text-[13px] leading-snug font-light">{desc}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* 4) CTA Section */}
            <section className="relative w-full bg-[#140620] py-20">
                <div className="max-w-2xl mx-auto px-6 flex flex-col items-center text-center gap-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                        Ready to Upgrade Your Infrastructure?
                    </h2>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                    >
                        Contact Us
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </div>
    );
}
