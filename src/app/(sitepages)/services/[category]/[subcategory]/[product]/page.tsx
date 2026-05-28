import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60; // Cache for 60 seconds

interface PageProps {
  params: Promise<{ category: string; subcategory: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product } = await params;
  await dbConnect();
  const productDoc = await Product.findOne({ slug: product, isActive: true });

  if (!productDoc) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${productDoc.name} | enteropia`,
    description: productDoc.description,
    alternates: {
      canonical: `https://enteropia.com/services/${productDoc.slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { category, subcategory, product } = await params;
  await dbConnect();

  // Find Category, Subcategory, and Product documents
  const [categoryDoc, subcategoryDoc, productDoc] = await Promise.all([
    Category.findOne({ slug: category, isActive: true }),
    Subcategory.findOne({ slug: subcategory, isActive: true }),
    Product.findOne({ slug: product, isActive: true }),
  ]);

  if (!categoryDoc || !subcategoryDoc || !productDoc) {
    notFound();
  }

  // Cross-verify structural relationships to prevent access via mismatching slugs
  if (
    productDoc.category.toString() !== categoryDoc._id.toString() ||
    productDoc.subcategory.toString() !== subcategoryDoc._id.toString()
  ) {
    notFound();
  }

  // Serialize to plain JS objects for client transfer
  const serializedProduct = {
    id: productDoc._id.toString(),
    name: productDoc.name || "",
    slug: productDoc.slug || "",
    description: productDoc.description || "",
    image: productDoc.image || "",
    sections: JSON.parse(JSON.stringify(productDoc.sections)), // deep clone Mongoose subdocs to POJO
  };

  const serializedCategory = {
    name: categoryDoc.name || "",
    slug: categoryDoc.slug || "",
  };

  const serializedSubcategory = {
    name: subcategoryDoc.name || "",
    slug: subcategoryDoc.slug || "",
  };

  return (
    <ProductDetailClient
      product={serializedProduct}
      category={serializedCategory}
      subcategory={serializedSubcategory}
    />
  );
}
