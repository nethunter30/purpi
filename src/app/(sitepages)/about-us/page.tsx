import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About Us | enteropia",
  description:
    "Learn more about enteropia — a Bengaluru-based enterprise technology company founded in 2026. Discover our mission, vision, core values, and the team behind our engineering excellence.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com",
      "logo": "https://enteropia.com/logo.png",
      "description": "enteropia delivers cutting-edge software engineering, custom cloud-native infrastructure, AI pipelines, and zero-trust security integrations for enterprise scale-ups.",
      "foundingDate": "2026",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bengaluru",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560001",
        "addressCountry": "IN"
      },
      "knowsAbout": [
        "Software Engineering",
        "Cloud Native Infrastructure",
        "DevOps",
        "Cybersecurity",
        "Artificial Intelligence & Machine Learning Pipelines"
      ]
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
        "name": "About Us",
        "item": "https://enteropia.com/about-us"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-about-us"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-about-us-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutUsClient />
    </>
  );
}
