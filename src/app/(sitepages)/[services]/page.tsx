import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicesLayout from "./ServicesLayout";

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
    title: "Our Services & Technology Solutions",
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

  return <ServicesLayout />;
}
