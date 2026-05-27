"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Building2,
    GraduationCap,
    ShieldPlus,
    ShoppingCart,
    Rocket,
    Factory,
    Landmark,
    Briefcase,
    Truck,
    Utensils,
    ArrowRight
} from "lucide-react";
const iconMap: Record<string, React.ElementType> = {
    Building2,
    GraduationCap,
    ShieldPlus,
    ShoppingCart,
    Rocket,
    Factory,
    Landmark,
    Briefcase,
    Truck,
    Utensils,
};

export interface IndustryItem {
    id: string;
    title: string;
    description: string;
    iconName: string;
    link: string;
}

interface IndustriesClientProps {
    industries: IndustryItem[];
}

export default function IndustriesClient({ industries }: IndustriesClientProps) {
    return (
        <div className="flex flex-col w-full font-sans">

            {/* 1) Dark Hero Section */}
            <section className="relative w-full bg-[#140620] pt-32 pb-24 overflow-hidden selection:bg-purple-500/30">
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                    <div className="flex-1 max-w-2xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-[13px] font-bold mb-6 uppercase tracking-widest">
                            <Link href="/" className="text-purple-500 hover:text-purple-400 transition-colors">HOME</Link>
                            <span className="text-purple-500">&gt;</span>
                            <span className="text-white">INDUSTRIES</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
                            Industries We Serve
                        </h1>

                        <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-light">
                            Specialized IT solutions tailored to the unique requirements of each industry vertical.
                        </p>
                    </div>

                    {/* Glowing Website Logo Container */}
                    <div className="relative w-72 h-72 md:w-80 md:h-80 flex-shrink-0 flex items-center justify-center select-none pointer-events-none lg:mr-16 xl:mr-24">
                        {/* Rotating logo icon */}
                        <div className="relative w-56 h-56 md:w-64 md:h-64 animate-[spin_20s_linear_infinite]">
                            <Image
                                src="/logo.png"
                                alt="enteropia Logo"
                                fill
                                sizes="(max-width: 768px) 224px, 256px"
                                className="object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Background Gradients for depth */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
            </section>

            {/* 2) Grid Section */}
            <section className="relative w-full bg-black py-24">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-3">
                            VERTICALS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Expertise Across Sectors
                        </h2>
                    </div>

                    {/* Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {industries.map((item) => {
                            const IconComponent = iconMap[item.iconName] || Building2;

                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col bg-black/40 backdrop-blur-md p-6 md:p-8 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                                >
                                    {/* Top Icon Block */}
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-sm flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <IconComponent className="w-6 h-6 stroke-[1.5]" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-400 text-[14px] leading-relaxed mb-8 flex-1 font-light">
                                        {item.description}
                                    </p>

                                    {/* Action Link */}
                                    <Link
                                        href={item.link}
                                        className="group/btn flex items-center gap-1 text-[13px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Get Solution
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
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
                                <div className="w-11 h-11 rounded-sm bg-purple-500 flex items-center justify-center text-white font-black text-base mb-4 shadow-[0_0_18px_rgba(168,85,247,0.5)]">
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