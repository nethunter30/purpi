import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";
import SubcategoryClient from "./SubcategoryClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60; // Cache for 60 seconds

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
  }).sort({ name: 1 });

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

  return (
    <SubcategoryClient
      category={serializedCategory}
      subcategory={serializedSubcategory}
      products={serializedProducts}
    />
  );
}
