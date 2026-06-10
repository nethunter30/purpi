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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <CategoryClient
        category={serializedCategory}
        subcategories={serializedSubcategories}
        products={serializedProducts}
      />
    </>
  );
}
