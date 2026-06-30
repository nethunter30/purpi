import Hero from "@/sitepages/components/home/Hero";
import KeyBenefits from "@/sitepages/components/home/KeyBenefits";
import WhatWeDo from "@/sitepages/components/home/WhatWeDo";
import Testimonials from "@/sitepages/components/home/Testimonials";
import Contact from "@/sitepages/components/home/Contact";
import Newsletter from "@/sitepages/components/home/Newsletter";
import LetsConnect from "@/sitepages/components/home/LetsConnect";
import Tech from "@/sitepages/components/home/Tech";
import Ourworks from "@/sitepages/components/home/Ourworks";
import Blogs from "@/sitepages/components/home/Blogs";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export const revalidate = 60;

export default async function Home() {
  let aggregateRating = null;
  let reviews: any[] = [];
  try {
    await dbConnect();
    const approvedTestimonials = await Testimonial.find({ status: "approved" }).sort({ createdAt: -1 });
    if (approvedTestimonials.length > 0) {
      const totalStars = approvedTestimonials.reduce((sum, item) => sum + item.stars, 0);
      const ratingValue = Number((totalStars / approvedTestimonials.length).toFixed(1));
      aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": approvedTestimonials.length,
        "bestRating": "5",
        "worstRating": "1"
      };
      reviews = approvedTestimonials.map((t) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": t.stars,
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": t.text
      }));
    }
  } catch (err) {
    console.error("Error loading testimonials for schema:", err);
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "enteropia",
    "url": "https://enteropia.com",
    "logo": "https://enteropia.com/logo.png",
    "description": "enteropia delivers cutting-edge software engineering, custom cloud-native infrastructure, AI pipelines, and zero-trust security integrations for enterprise scale-ups.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bengaluru",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "telephone": "+919900112530",
    "email": "info@enteropia.com",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61590684264837",
      "https://x.com/enteropia__",
      "https://www.instagram.com/enteropia_/",
      "https://www.linkedin.com/company/enteropia/"
    ],
    ...(aggregateRating ? { "aggregateRating": aggregateRating, "review": reviews } : {})
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "enteropia",
    "image": "https://enteropia.com/logo.png",
    "@id": "https://enteropia.com/#localbusiness",
    "url": "https://enteropia.com",
    "telephone": "+919900112530",
    "email": "info@enteropia.com",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bengaluru",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    ...(aggregateRating ? { "aggregateRating": aggregateRating, "review": reviews } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-organization"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-local-business"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <Tech />
      <WhatWeDo />
      <Blogs />
      <KeyBenefits />
      <Ourworks />
      <LetsConnect />
      <Testimonials />
      <Contact />
      <Newsletter />
    </>
  );
}


