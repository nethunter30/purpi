import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";
import SubcategoryClient from "./SubcategoryClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
  await dbConnect();
  const subcategories = await Subcategory.find({ isActive: true }).populate("category");
  return subcategories
    .filter((sub) => {
      const cat = sub.category as any;
      return cat && cat.isActive;
    })
    .map((sub) => {
      const cat = sub.category as any;
      return {
        category: cat.slug,
        subcategory: sub.slug,
      };
    });
}

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory } = await params;
  await dbConnect();
  const subcategoryDoc = await Subcategory.findOne({ slug: subcategory, isActive: true });

  if (!subcategoryDoc) {
    return {
      title: "Subcategory Not Found",
    };
  }

  return {
    title: `${subcategoryDoc.name} | enteropia`,
    description: subcategoryDoc.description,
    alternates: {
      canonical: `https://enteropia.com/services/${subcategoryDoc.slug}`,
    },
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  await dbConnect();

  // Find category and subcategory
  const [categoryDoc, subcategoryDoc] = await Promise.all([
    Category.findOne({ slug: category, isActive: true }),
    Subcategory.findOne({ slug: subcategory, isActive: true }),
  ]);

  if (!categoryDoc || !subcategoryDoc) {
    notFound();
  }

  // Find all active products under this subcategory
  const products = await Product.find({
    subcategory: subcategoryDoc._id,
    isActive: true,
  }).sort({ order: 1, name: 1 });

  // Serialize models
  const serializedCategory = {
    id: categoryDoc._id.toString(),
    name: categoryDoc.name || "",
    slug: categoryDoc.slug || "",
  };

  const serializedSubcategory = {
    id: subcategoryDoc._id.toString(),
    name: subcategoryDoc.name || "",
    slug: subcategoryDoc.slug || "",
    description: subcategoryDoc.description || "",
    image: subcategoryDoc.image || "",
  };

  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      image: obj.image || "",
    };
  });

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serializedSubcategory.name,
    "description": serializedSubcategory.description,
    "provider": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com",
      "logo": "https://enteropia.com/logo.png"
    },
    "category": serializedCategory.name,
    "image": serializedSubcategory.image || "https://enteropia.com/logo.png"
  };

  const subcategoryFaqs: Record<string, { question: string; answer: string }[]> = {
    "server-management": [
      {
        question: "What does your server management service include?",
        answer: "Our server management service includes 24/7 server health monitoring, security patching, OS updates, log analysis, firewall administration, database optimization, and automated backups."
      },
      {
        question: "How do you handle server downtime?",
        answer: "We configure real-time monitoring agents that alert our systems engineers instantly. We follow a strict SLA response protocol to investigate and reboot or recover services immediately."
      }
    ],
    "web-application-development": [
      {
        question: "What frontend and backend technologies do you use for web apps?",
        answer: "We specialize in modern stacks, including React, Next.js, and TypeScript on the frontend, and Node.js, Python, Go, PostgreSQL, and MongoDB on the backend."
      },
      {
        question: "Are the web applications SEO-friendly and responsive?",
        answer: "Yes, all our web applications are designed with mobile-first responsiveness and engineered using server-side rendering (SSR) or static site generation (SSG) to ensure optimal SEO performance and speed."
      }
    ],
    "mobile-app-development": [
      {
        question: "Do you publish the apps to Apple App Store and Google Play Store?",
        answer: "Yes, we manage the entire publishing process, including developer account configuration, metadata preparation, store guidelines compliance reviews, and final binary submissions."
      },
      {
        question: "Do you offer post-launch maintenance for mobile apps?",
        answer: "Absolutely. We offer maintenance packages to cover OS upgrades, SDK updates, bug fixes, and feature expansions to ensure your app runs smoothly on newer device models."
      }
    ]
  };

  const faqs = subcategoryFaqs[serializedSubcategory.slug] || [
    {
      question: "What is the delivery timeline for a typical project in this category?",
      answer: "Scoping and timelines vary depending on features, but a typical subcategory service takes anywhere between 4 to 12 weeks from initial scoping to production deployment."
    },
    {
      question: "Do you sign Non-Disclosure Agreements (NDAs)?",
      answer: "Yes, we sign standard mutual NDAs before sharing any technical architectures, project specs, or custom database credentials to protect your intellectual property."
    },
    {
      question: "Can we scale our engagement as the project grows?",
      answer: "Definitely. We build modular, future-proof infrastructures and offer scalable developer contracts, enabling you to add resources as user traffic and feature scope expand."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
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
        "name": "Services",
        "item": "https://enteropia.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": serializedCategory.name,
        "item": `https://enteropia.com/services/${serializedCategory.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": serializedSubcategory.name,
        "item": `https://enteropia.com/services/${serializedCategory.slug}/${serializedSubcategory.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-services-subcategory"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-services-subcategory-faq"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-services-subcategory-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SubcategoryClient
        category={serializedCategory}
        subcategory={serializedSubcategory}
        products={serializedProducts}
      />
    </>
  );
}
