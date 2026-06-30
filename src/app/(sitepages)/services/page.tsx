import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";
import ServicesClient from "./ServicesClient";
import type { Metadata } from "next";

export const revalidate = 60; // Cache for 60 seconds

export const metadata: Metadata = {
  title: "Services & Solutions | enteropia",
  description: "Browse our expert services catalog: DevOps, Cloud infrastructure design, software development, cybersecurity solutions, and IT management.",
  alternates: {
    canonical: "https://enteropia.com/services",
  },
};

export default async function ServicesPage() {
  await dbConnect();

  // Load all active categories, subcategories, and products
  const [categories, subcategories, products] = await Promise.all([
    Category.find({ isActive: true }).sort({ order: 1, name: 1 }),
    Subcategory.find({ isActive: true }).sort({ order: 1, name: 1 }),
    Product.find({ isActive: true })
      .select("name slug category subcategory description")
      .sort({ order: 1, name: 1 }),
  ]);

  // Serialize Mongoose docs to plain JS objects for Server-to-Client transmission
  const serializedCategories = categories.map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      image: obj.image || "",
    };
  });

  const serializedSubcategories = subcategories.map((s) => {
    const obj = s.toObject ? s.toObject() : s;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      image: obj.image || "",
      category: obj.category.toString(),
    };
  });

  const serializedProducts = products.map((p) => {
    const obj = p.toObject ? p.toObject() : p;
    return {
      id: obj._id.toString(),
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      category: obj.category.toString(),
      subcategory: obj.subcategory.toString(),
    };
  });

  const subcategorySlugMap: Record<string, string> = {};
  serializedSubcategories.forEach((sub) => {
    subcategorySlugMap[sub.id] = sub.slug;
  });

  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "enteropia Engineering Services",
    "description": "Browse our expert services catalog: DevOps, Cloud infrastructure design, software development, cybersecurity solutions, and IT management.",
    "provider": {
      "@type": "Organization",
      "name": "enteropia",
      "url": "https://enteropia.com",
      "logo": "https://enteropia.com/logo.png"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "enteropia Services Catalog",
      "itemListElement": serializedCategories.map((cat) => ({
        "@type": "OfferCatalog",
        "name": cat.name,
        "description": cat.description,
        "itemListElement": serializedProducts
          .filter((p) => p.category === cat.id)
          .map((p) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": p.name,
              "description": p.description,
              "url": `https://enteropia.com/services/${cat.slug}/${subcategorySlugMap[p.subcategory] || ""}/${p.slug}`
            }
          }))
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
        "name": "Services",
        "item": "https://enteropia.com/services"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-services"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogSchema) }}
      />
      <script
        type="application/ld+json"
        id="schema-services-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesClient
        categories={serializedCategories}
        subcategories={serializedSubcategories}
        products={serializedProducts}
      />
    </>
  );
}
