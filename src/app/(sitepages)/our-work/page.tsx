import React from "react";
import { Metadata } from "next";
import OurWorkClient from "./OurWorkClient";
import dbConnect from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
import CategoryModel from "@/models/manage-services/categories";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Portfolio & Case Studies",
  description:
    "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation. See how we help clients scale and optimize their platforms.",
  keywords: [
    "enteropia portfolio",
    "case studies",
    "software engineering portfolio",
    "cloud security case studies",
    "AI engineering success",
    "enteropia portfolio",
  ],
  alternates: {
    canonical: "https://enteropia.com/our-work",
  },
  openGraph: {
    title: "Our Portfolio & Case Studies | enteropia",
    description:
      "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation. See how we help clients scale and optimize their platforms.",
    url: "https://enteropia.com/our-work",
    type: "website",
  },
};

export default async function OurWorkPage() {
  await dbConnect();
  const studiesList = await CaseStudy.find({ isActive: true }).sort({ createdAt: 1 });
  const categoryDocs = await CategoryModel.find({}).sort({ createdAt: 1 });
  const categories = ["All", ...categoryDocs.map((c) => c.name)];

  const plainStudies = studiesList.map((s) => {
    const obj = s.toObject ? s.toObject() : s;
    return {
      id: obj.id || "",
      title: obj.title || "",
      client: obj.client || "",
      category: obj.category || "",
      subCategory: obj.subCategory || "",
      description: obj.description || "",
      challenge: obj.challenge || "",
      solution: obj.solution || "",
      impact: obj.impact || "",
      impactLabel: obj.impactLabel || "",
      image: obj.image || "",
      techStack: obj.techStack || [],
      results: obj.results || [],
      milestones: obj.milestones || [],
    };
  });

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Our Portfolio & Case Studies | enteropia",
    description:
      "Read enteropia's detailed case studies across Software Engineering, Cloud & Security, and AI & Automation.",
    url: "https://enteropia.com/our-work",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: plainStudies.length,
      itemListElement: plainStudies.map((study, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://enteropia.com/our-work/${study.id}`,
        name: study.title,
        description: study.description,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OurWorkClient caseStudies={plainStudies} categories={categories} />
    </>
  );
}
