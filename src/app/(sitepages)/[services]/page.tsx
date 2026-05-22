import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import SubService from "@/models/SubService";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ services: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { services } = await params;
  if (services !== "services") {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: "Our Services & Technology Solutions | enteropia",
    description: "Discover enteropia's range of tech solutions including Software Engineering, Cloud Infrastructure, Security, and AI & Machine Learning to power your corporate vision.",
    keywords: [
      "software engineering",
      "cloud solutions",
      "cybersecurity solutions",
      "machine learning consulting",
      "AI automation",
      "enteropia services"
    ],
    alternates: {
      canonical: "https://enteropia.com/services",
    },
    openGraph: {
      title: "Our Services & Technology Solutions | enteropia",
      description: "Discover enteropia's range of tech solutions including Software & App Engineering, Cloud Infrastructure, Security, and AI & Machine Learning.",
      url: "https://enteropia.com/services",
      type: "website",
    },
  };
}

export default async function ServicesPage({ params }: RouteParams) {
  const { services } = await params;

  if (services !== "services") {
    notFound();
  }

  let servicesList: any[] = [];

  try {
    await dbConnect();
    const rawServices = await Service.find({}).sort({ order: 1, createdAt: 1 }).lean();
    
    servicesList = await Promise.all(
      rawServices.map(async (service: any) => {
        const rawSubs = await SubService.find({ serviceId: service._id })
          .sort({ order: 1, createdAt: 1 })
          .lean();

        return {
          _id: service._id.toString(),
          title: service.title,
          description: service.description,
          image: service.image,
          slug: service.slug,
          order: service.order,
          subservices: rawSubs.map((sub: any) => ({
            _id: sub._id.toString(),
            title: sub.title,
            description: sub.description,
            whatWeOffer: sub.whatWeOffer || [],
            benefits: sub.benefits || [],
            order: sub.order,
          })),
        };
      })
    );
  } catch (error) {
    console.error("Failed to fetch services in Server Component", error);
  }

  // Inject Organization/Service list schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "enteropia Professional Tech Services",
    "description": "Enterprise software engineering, cloud infrastructure solutions, and AI/Machine learning models.",
    "provider": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Technology Solutions Catalog",
      "itemListElement": servicesList.map((service, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description
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
      <ServicesClient services={servicesList} paramServicesName={services} />
    </>
  );
}
