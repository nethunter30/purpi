import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";
import CategoryClient from "./CategoryClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
  await dbConnect();
  const categories = await Category.find({ isActive: true });
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  await dbConnect();
  const categoryDoc = await Category.findOne({ slug: category, isActive: true });
  
  if (!categoryDoc) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryDoc.name} | enteropia`,
    description: categoryDoc.description,
    alternates: {
      canonical: `https://enteropia.com/services/${categoryDoc.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  await dbConnect();

  // Find the category
  const categoryDoc = await Category.findOne({ slug: category, isActive: true });
  if (!categoryDoc) {
    notFound();
  }

  // Find active subcategories and products in this category
  const [subcategories, products] = await Promise.all([
    Subcategory.find({ category: categoryDoc._id, isActive: true }).sort({ order: 1, name: 1 }),
    Product.find({ category: categoryDoc._id, isActive: true })
      .select("name slug subcategory description")
      .sort({ order: 1, name: 1 }),
  ]);

  // Serialize models
  const serializedCategory = {
    id: categoryDoc._id.toString(),
    name: categoryDoc.name || "",
    slug: categoryDoc.slug || "",
    description: categoryDoc.description || "",
    image: categoryDoc.image || "",
  };

  const serializedSubcategories = subcategories.map((s) => {
    const obj = s.toObject ? s.toObject() : s;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      image: obj.image || "",
    };
  });

  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      subcategory: obj.subcategory.toString(),
    };
  });

  const subcategorySlugMap: Record<string, string> = {};
  subcategories.forEach((sub) => {
    subcategorySlugMap[sub._id.toString()] = sub.slug || "";
  });

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serializedCategory.name,
    "description": serializedCategory.description,
    "provider": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com",
      "logo": "https://enteropia.com/logo.png"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serializedCategory.name} Services Catalog`,
      "itemListElement": serializedProducts.map((p) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": p.name,
          "description": p.description,
          "url": `https://enteropia.com/services/${serializedCategory.slug}/${subcategorySlugMap[p.subcategory] || ""}/${p.slug}`
        }
      }))
    }
  };

  const categoryFaqs: Record<string, { question: string; answer: string }[]> = {
    "software-development": [
      {
        question: "What software development methodologies do you use?",
        answer: "We primarily employ Agile and DevOps methodologies, enabling rapid iterations, continuous integration, and transparent client collaboration throughout the lifecycle."
      },
      {
        question: "Do you build cross-platform mobile apps?",
        answer: "Yes, we build performant cross-platform mobile applications using React Native and Flutter, as well as native iOS (Swift) and Android (Kotlin) apps tailored to business needs."
      },
      {
        question: "Can you integrate third-party APIs and legacy systems?",
        answer: "Absolutely. We have extensive experience building custom middleware and integrating complex third-party SaaS APIs, payment gateways, and legacy enterprise databases."
      }
    ],
    "it-services": [
      {
        question: "Do you provide 24/7 system monitoring and support?",
        answer: "Yes, we offer SLA-backed 24/7 proactive monitoring, real-time alerting, and remote support services to identify and resolve server and network bottlenecks before they affect business operations."
      },
      {
        question: "What cloud platforms do you support?",
        answer: "We support all major cloud provider platforms, including Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure, focusing on security and cost optimization."
      },
      {
        question: "How do you handle disaster recovery and backup?",
        answer: "We design robust backup strategies with multi-region automated replication, point-in-time recovery, and documented disaster recovery protocols to ensure business continuity."
      }
    ],
    "caas": [
      {
        question: "What is Container as a Service (CaaS) and how does it benefit my business?",
        answer: "CaaS is a cloud service model that allows businesses to upload, organize, run, scale, and manage containers. It streamlines DevOps pipelines, improves resource utilization, and ensures application portability across different environments."
      },
      {
        question: "Do you support Kubernetes cluster orchestration?",
        answer: "Yes, we specialize in building and managing secure, production-ready Kubernetes clusters on AWS (EKS), GCP (GKE), Azure (AKS), as well as custom self-hosted Kubernetes setups."
      },
      {
        question: "How do you secure containerized applications?",
        answer: "We implement container security best practices, including image scanning for vulnerabilities, restricted IAM roles, network policies, namespace isolation, and secrets management."
      }
    ]
  };

  const faqs = categoryFaqs[serializedCategory.slug] || [
    {
      question: "How do I choose the right technology solution for my business?",
      answer: "Our systems architects evaluate your scale, current tech stack, operational needs, and budget to design a tailored roadmap that fits your business objectives."
    },
    {
      question: "Do you offer custom pricing and subscription models?",
      answer: "Yes, we provide flexible engagement packages, including fixed-cost project contracts, dedicated developer retainers, and SLA-based ongoing support models."
    },
    {
      question: "How do we get started with enteropia?",
      answer: "Simply use the contact form or hotline to book a consultation. Our team will schedule an architecture scoping session to outline your custom blueprint."
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
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-services-category"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-services-category-faq"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-services-category-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClient
        category={serializedCategory}
        subcategories={serializedSubcategories}
        products={serializedProducts}
      />
    </>
  );
}
