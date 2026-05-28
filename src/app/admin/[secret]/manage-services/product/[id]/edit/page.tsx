"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import ProductForm from "../../new/ProductForm";
import type { ProductSections } from "@/models/services/Product";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  category: string;
  subcategory: string;
  sections: ProductSections;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const secret = params.secret as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProductFormData | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/services/products/${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          const product = result.data;
          
          // Map to ProductFormData interface where category/subcategory are strings
          const mapped: ProductFormData = {
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            image: product.image || "",
            isActive: product.isActive !== undefined ? product.isActive : true,
            category: typeof product.category === "object" && product.category ? product.category._id : (product.category || ""),
            subcategory: typeof product.subcategory === "object" && product.subcategory ? product.subcategory._id : (product.subcategory || ""),
            sections: product.sections || {
              productDetails: { title: "", description: "", points: [], codeBlocks: [] },
            },
          };
          
          setFormData(mapped);
        } else {
          setError(result.message || "Failed to load service details.");
        }
      } catch (err) {
        setError("An unexpected error occurred while loading service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-sm text-gray-400 font-light">Loading service details...</p>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error || "Product not found."}</p>
        </div>
        <button
          onClick={() => router.push(`/admin/${secret}/manage-services`)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 hover:bg-purple-900/40 text-xs font-semibold text-white rounded-xl border border-purple-900/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>
      </div>
    );
  }

  return <ProductForm initialData={formData} productId={id} />;
}
