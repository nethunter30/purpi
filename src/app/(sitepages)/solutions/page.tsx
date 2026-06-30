import React from "react";
import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";
import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Industry Solutions & Pre-configured IT Packages",
    description: "Explore enteropia's pre-configured IT infrastructure packages designed for your business vertical: small business setup, school networks, HIPAA-grade hospital security, retail POS, and startup cloud foundation.",
    keywords: [
        "IT packages",
        "industry IT solutions",
        "small business IT starter",
        "school network design",
        "hospital IT security",
        "retail POS infrastructure",
        "startup cloud deployment",
        "enteropia solutions"
    ],
    alternates: {
        canonical: "https://enteropia.com/solutions",
    },
    openGraph: {
        title: "Industry Solutions & Pre-configured IT Packages | enteropia",
        description: "Explore enteropia's pre-configured IT infrastructure packages designed for your business vertical: small business setup, school networks, HIPAA-grade hospital security, retail POS, and startup cloud foundation.",
        url: "https://enteropia.com/solutions",
        type: "website",
    },
};

export default async function SolutionsPage() {
    await dbConnect();
    let solutionsList = await Solution.find({ isActive: true }).sort({ createdAt: 1 });


    const plainSolutions = solutionsList.map((sol) => {
        const obj = sol.toObject ? sol.toObject() : sol;
        return {
            id: obj.id || "",
            title: obj.title || "",
            description: obj.description || "",
            image: obj.image || "",
            iconName: obj.iconName || "",
            features: obj.features || [],
            startingPrice: obj.startingPrice || "",
            learnMoreUrl: obj.learnMoreUrl || "",
        };
    });

    // Generate search engine schema markup (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Industry Solutions & Pre-configured IT Packages | enteropia",
        "description": "Explore enteropia's pre-configured IT infrastructure packages designed for your business vertical.",
        "url": "https://enteropia.com/solutions",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": plainSolutions.length,
            "itemListElement": plainSolutions.map((item, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": item.title,
                "description": item.description,
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "INR",
                    "price": item.startingPrice.replace(/[^\d]/g, ""),
                    "availability": "https://schema.org/InStock",
                }
            }))
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://enteropia.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Solutions",
                "item": "https://enteropia.com/solutions"
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                id="schema-solutions"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                id="schema-solutions-breadcrumb"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <SolutionsClient solutions={plainSolutions} />
        </>
    );
}