import React from "react";
import type { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";
import dbConnect from "@/lib/db";
import Industry from "@/models/Industry";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Industries We Serve",
    description: "Learn about the industries we serve and how we tailor software, cloud infrastructure, and security solutions for specific business verticals.",
    alternates: {
        canonical: "https://enteropia.com/industries",
    },
};

export default async function IndustriesPage() {
    await dbConnect();
    const list = await Industry.find({ isActive: true }).sort({ createdAt: 1 });

    // Fallback seed array mappings if empty on page load
    const plainList = list.map((ind) => {
        const obj = ind.toObject ? ind.toObject() : ind;
        return {
            id: obj.id || "",
            title: obj.title || "",
            description: obj.description || "",
            iconName: obj.iconName || "",
            link: obj.link || "/solutions",
        };
    });

    return <IndustriesClient industries={plainList} />;
}