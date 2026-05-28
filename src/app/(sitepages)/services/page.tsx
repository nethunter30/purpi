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
    Subcategory.find({ isActive: true }).sort({ name: 1 }),
    Product.find({ isActive: true })
      .select("name slug category subcategory description")
      .sort({ name: 1 }),
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

  return (
    <ServicesClient
      categories={serializedCategories}
      subcategories={serializedSubcategories}
      products={serializedProducts}
    />
  );
}
