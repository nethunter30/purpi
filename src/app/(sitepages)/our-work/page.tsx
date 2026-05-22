import React from "react";
import { Metadata } from "next";
import OurWorkClient from "./OurWorkClient";
import { caseStudies } from "@/lib/caseStudiesData";

export const metadata: Metadata = {
  title: "Our Portfolio & Case Studies | enteropia",
  description: "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation. See how we help clients scale and optimize their platforms.",
  keywords: ["enteropia portfolio", "case studies", "software engineering portfolio", "cloud security case studies", "AI engineering success", "enteropia portfolio"],
  alternates: {
    canonical: "https://enteropia.com/our-work",
  },
  openGraph: {
    title: "Our Portfolio & Case Studies | enteropia",
    description: "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation. See how we help clients scale and optimize their platforms.",
    url: "https://enteropia.com/our-work",
    type: "website",
  },
};

export default function OurWorkPage() {
  // Generate structured data for the listing page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Our Portfolio & Case Studies | enteropia",
    "description": "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation.",
    "url": "https://enteropia.com/our-work",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": caseStudies.length,
      "itemListElement": caseStudies.map((study, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://enteropia.com/our-work/${study.id}`,
        "name": study.title,
        "description": study.description
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OurWorkClient caseStudies={caseStudies} />
    </>
  );
}
