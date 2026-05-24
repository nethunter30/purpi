import React from "react";
import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";
import { solutions } from "../../../lib/solutionsData";

export const metadata: Metadata = {
    title: "Industry Solutions & Pre-configured IT Packages | enteropia",
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

export default function SolutionsPage() {
    // Generate search engine schema markup (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Industry Solutions & Pre-configured IT Packages | enteropia",
        "description": "Explore enteropia's pre-configured IT infrastructure packages designed for your business vertical.",
        "url": "https://enteropia.com/solutions",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": solutions.length,
            "itemListElement": solutions.map((item, idx) => ({
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SolutionsClient solutions={solutions} />
        </>
    );
}