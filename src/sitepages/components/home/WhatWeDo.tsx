import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import { Sparkles } from "lucide-react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

export default async function WhatWeDo() {
    let categories: any[] = [];
    try {
        await dbConnect();
        categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    } catch (err) {
        console.error("Error loading categories for homepage:", err);
    }

    return (
        <section id="services" className="relative w-full py-6 flex flex-col items-center justify-center z-10 bg-black overflow-hidden">
            {/* Decorative background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            <FadeUp className="flex flex-col items-center justify-center w-full">
                {/* Header Content */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 mb-16 relative z-10">
                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/10 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-5">
                        What We Do
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Your Premium Tech Partner
                    </h2>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
                        Founded in 2026, enteropia delivers innovative, reliable, and scalable tech solutions,
                        specializing in software development, IT infrastructure, and digital transformation. We help
                        businesses build lasting value with sustainable, future-ready systems.
                    </p>
                </div>

                {/* Grid Layout */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-lg mx-auto relative z-10">
                        <Sparkles className="w-12 h-12 text-purple-500/50 mb-4 animate-pulse" />
                        <h3 className="text-lg font-bold text-white mb-2">Services Coming Soon</h3>
                        <p className="text-gray-400 text-xs md:text-sm">
                            Our premium tech catalog is currently being updated. Please check back shortly.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] w-full px-6 relative z-10">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/services/${category.slug}`}
                                className="relative flex flex-col justify-between rounded-sm bg-[#0d0517]/60 border border-purple-950/40 hover:border-purple-500/30 p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(168,85,247,0.12)] group overflow-hidden"
                            >
                                {/* Subtle internal glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex flex-col h-full justify-between relative z-10">
                                    <div>
                                        {/* Title */}
                                        <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-purple-300 transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                        {/* Description */}
                                        <p className="text-gray-400 text-sm leading-relaxed text-justify mb-6 group-hover:text-gray-300 transition-colors duration-300">
                                            {category.description}
                                        </p>
                                    </div>

                                    {/* Subtle link arrow indicator at the bottom right */}
                                    <div className="flex justify-end items-center mt-auto">
                                        <span className="px-4 py-1.5 rounded-full border border-purple-900/40 bg-purple-950/20 flex items-center justify-center text-xs text-purple-400 group-hover:text-purple-300 group-hover:border-purple-500/30 group-hover:bg-purple-900/20 transition-all duration-300">
                                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">Explore More</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </FadeUp>
        </section>
    );
}
