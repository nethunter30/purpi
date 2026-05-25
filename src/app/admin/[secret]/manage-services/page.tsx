"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Folder,
  Tag,
  ShoppingBag,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  RefreshCcw,
  X,
  ExternalLink,
  PlusCircle,
  MinusCircle
} from "lucide-react";
import ImageUpload from "@/admin/components/common/ImageUpload";

// Type definitions
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface BulletList {
  heading: string;
  points: string[];
}

interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  faqs?: FAQ[];
  subcategoriesCount?: number;
}

interface SubCategory {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  categorySlug: string;
  bulletList?: BulletList;
  faqs?: FAQ[];
  images?: string[];
}

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  title: string;
}

function ManageServicesContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const secret = (params.secret as string) || "";

  // Tabs state
  const activeTabParam = searchParams.get("tab") || "categories";
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);

  // Sync state with URL parameter if it changes
  useEffect(() => {
    if (activeTabParam && activeTabParam !== activeTab) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.replace(`/admin/${secret}/manage-services?tab=${tab}`);
  };

  // Data lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search terms
  const [catSearch, setCatSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);

  // Form states
  const [catForm, setCatForm] = useState<{
    name: string;
    slug: string;
    description: string;
    image: string;
    faqs: FAQ[];
  }>({ name: "", slug: "", description: "", image: "", faqs: [] });

  const [subForm, setSubForm] = useState<{
    name: string;
    slug: string;
    categorySlug: string;
    bulletList: BulletList;
    faqs: FAQ[];
    images: string[];
  }>({
    name: "",
    slug: "",
    categorySlug: "",
    bulletList: { heading: "", points: [] },
    faqs: [],
    images: []
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [catRes, subRes, prodRes] = await Promise.all([
        fetch("/api/manage-services/category"),
        fetch("/api/manage-services/subcat"),
        fetch("/api/manage-services/product")
      ]);

      const catData = await catRes.json();
      const subData = await subRes.json();
      const prodData = await prodRes.json();

      if (catData.success) setCategories(catData.data);
      if (subData.success) setSubcategories(subData.data);
      if (prodData.success) setProducts(prodData.data);

      if (!catData.success || !subData.success || !prodData.success) {
        setError("Some data failed to load. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while fetching services data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: Auto slug generation
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Open Category Modal
  const openCategoryModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image: cat.image,
        faqs: cat.faqs || []
      });
    } else {
      setEditingCategory(null);
      setCatForm({ name: "", slug: "", description: "", image: "", faqs: [] });
    }
    setIsCategoryModalOpen(true);
  };

  // Open Subcategory Modal
  const openSubcategoryModal = (sub: SubCategory | null = null) => {
    if (sub) {
      setEditingSubcategory(sub);
      setSubForm({
        name: sub.name,
        slug: sub.slug,
        categorySlug: sub.categorySlug,
        bulletList: sub.bulletList || { heading: "", points: [] },
        faqs: sub.faqs || [],
        images: sub.images || []
      });
    } else {
      setEditingSubcategory(null);
      setSubForm({
        name: "",
        slug: "",
        categorySlug: categories[0]?.slug || "",
        bulletList: { heading: "", points: [] },
        faqs: [],
        images: []
      });
    }
    setIsSubcategoryModalOpen(true);
  };

  // CRUD handlers - Category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.slug || !catForm.image) {
      alert("Name, Slug, and Image are required.");
      return;
    }
    setSubmitting(true);
    try {
      const url = editingCategory
        ? `/api/manage-services/category/${editingCategory.id || editingCategory._id}`
        : "/api/manage-services/category";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catForm)
      });
      const data = await res.json();

      if (data.success) {
        setIsCategoryModalOpen(false);
        fetchData();
      } else {
        alert(data.message || "Failed to save category");
      }
    } catch (err) {
      alert("Error saving category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"? This might break subcategories referencing it.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/manage-services/category/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to delete category");
        setLoading(false);
      }
    } catch (err) {
      alert("Error deleting category");
      setLoading(false);
    }
  };

  // CRUD handlers - Subcategory
  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.name || !subForm.slug || !subForm.categorySlug) {
      alert("Name, Slug, and Category are required.");
      return;
    }
    setSubmitting(true);
    try {
      const url = editingSubcategory
        ? `/api/manage-services/subcat/${editingSubcategory.id || editingSubcategory._id}`
        : "/api/manage-services/subcat";
      const method = editingSubcategory ? "PUT" : "POST";

      const payload = {
        ...subForm,
        bulletList: subForm.bulletList && subForm.bulletList.heading.trim() ? subForm.bulletList : undefined
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsSubcategoryModalOpen(false);
        fetchData();
      } else {
        alert(data.message || "Failed to save subcategory");
      }
    } catch (err) {
      alert("Error saving subcategory");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubcategoryDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the subcategory "${name}"?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/manage-services/subcat/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to delete subcategory");
        setLoading(false);
      }
    } catch (err) {
      alert("Error deleting subcategory");
      setLoading(false);
    }
  };

  // CRUD handlers - Product Delete
  const handleProductDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the product "${name}"?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/manage-services/product/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || "Failed to delete product");
        setLoading(false);
      }
    } catch (err) {
      alert("Error deleting product");
      setLoading(false);
    }
  };

  // Filter listings
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(catSearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter(
    (s) =>
      s.name.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.slug.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.categorySlug.toLowerCase().includes(subSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.title.toLowerCase().includes(prodSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#a356db]" />
              Manage Services
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Configure categories, sub-categories, and deep product details representing enteropia services catalog.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#2a133d] hover:bg-[#391a54] text-sm font-semibold text-gray-300 transition-all border border-purple-900/40 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <X className="w-5 h-5 flex-shrink-0 cursor-pointer" onClick={() => setError("")} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Tabs Switch */}
      <div className="flex border-b border-purple-900/30 gap-1.5 p-1 bg-[#10031d] rounded-xl max-w-md">
        <button
          onClick={() => handleTabChange("categories")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-[#a356db] text-white shadow-lg shadow-purple-500/10"
              : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/20"
          }`}
        >
          <Folder className="w-4 h-4" />
          Categories
        </button>
        <button
          onClick={() => handleTabChange("subcategories")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
            activeTab === "subcategories"
              ? "bg-[#a356db] text-white shadow-lg shadow-purple-500/10"
              : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/20"
          }`}
        >
          <Tag className="w-4 h-4" />
          Sub-Categories
        </button>
        <button
          onClick={() => handleTabChange("products")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-[#a356db] text-white shadow-lg shadow-purple-500/10"
              : "text-gray-400 hover:text-gray-200 hover:bg-purple-950/20"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Detailed Content
        </button>
      </div>

      {/* Categories Content */}
      {activeTab === "categories" && (
        <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden flex flex-col transition-all">
          <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Categories List
              <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                {categories.length}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={() => openCategoryModal()}
                className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-all shadow-md shadow-purple-500/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                <p className="text-sm font-medium">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Folder className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">No categories found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                    <th className="px-6 py-4 font-semibold">Image</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">FAQs Count</th>
                    <th className="px-6 py-4 font-semibold">Subcategories</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/10">
                  {filteredCategories.map((c) => (
                    <tr key={c.id || c._id} className="hover:bg-purple-900/5 transition-colors">
                      <td className="px-6 py-4">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-12 h-8 object-cover rounded-lg border border-purple-900/20"
                          />
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center text-xs text-purple-400 font-bold">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">{c.name}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">
                        {c.slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {c.faqs?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {c.subcategoriesCount || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openCategoryModal(c)}
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(c.id || c._id || "", c.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Sub-categories Content */}
      {activeTab === "subcategories" && (
        <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden flex flex-col transition-all">
          <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Sub-categories List
              <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                {subcategories.length}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={() => openSubcategoryModal()}
                disabled={categories.length === 0}
                className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-all shadow-md shadow-purple-500/10 disabled:opacity-50 cursor-pointer"
                title={categories.length === 0 ? "Create a category first" : ""}
              >
                <Plus className="w-4 h-4" /> Add Sub-Category
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                <p className="text-sm font-medium">Loading subcategories...</p>
              </div>
            ) : filteredSubcategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Tag className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">No subcategories found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Parent Category</th>
                    <th className="px-6 py-4 font-semibold">FAQs</th>
                    <th className="px-6 py-4 font-semibold">Images</th>
                    <th className="px-6 py-4 font-semibold">Detailed Content</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/10">
                  {filteredSubcategories.map((s) => (
                    <tr key={s.id || s._id} className="hover:bg-purple-900/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">{s.name}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">
                        {s.slug}
                      </td>
                      <td className="px-6 py-4 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                        {s.categorySlug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {s.faqs?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {s.images?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(() => {
                          const matchedProduct = products.find((p) => p.subcategorySlug === s.slug);
                          if (matchedProduct) {
                            return (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                  Configured
                                </span>
                                <button
                                  onClick={() => router.push(`/admin/${secret}/manage-services/product/${matchedProduct.id || matchedProduct._id}`)}
                                  className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/10 text-gray-405 border border-gray-500/20">
                                  Not Configured
                                </span>
                                <button
                                  onClick={() => router.push(`/admin/${secret}/manage-services/product/new?subcat=${s.slug}`)}
                                  className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>
                            );
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openSubcategoryModal(s)}
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleSubcategoryDelete(s.id || s._id || "", s.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Products Content */}
      {activeTab === "products" && (
        <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden flex flex-col transition-all">
          <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Detailed Content List
              <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                {products.length}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search detailed content..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={() => router.push(`/admin/${secret}/manage-services/product/new`)}
                disabled={subcategories.length === 0}
                className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-all shadow-md shadow-purple-500/10 disabled:opacity-50 cursor-pointer"
                title={subcategories.length === 0 ? "Create a sub-category first" : ""}
              >
                <Plus className="w-4 h-4" /> Add Detailed Content
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                <p className="text-sm font-medium">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">No products found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Sub-Category</th>
                    <th className="px-6 py-4 font-semibold">Hero Title</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/10">
                  {filteredProducts.map((p) => (
                    <tr key={p.id || p._id} className="hover:bg-purple-900/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">{p.name}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">
                        {p.slug}
                      </td>
                      <td className="px-6 py-4 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                        {p.categorySlug}
                      </td>
                      <td className="px-6 py-4 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                        {p.subcategorySlug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-xs" title={p.title}>
                        {p.title}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/${secret}/manage-services/product/${p.id || p._id}`)}
                            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleProductDelete(p.id || p._id || "", p.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: Category Edit/Add
          ======================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#140620] border border-purple-900/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 pr-6">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Category"}
            </h2>

            <form onSubmit={handleCategorySubmit} className="space-y-5 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCatForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: editingCategory ? prev.slug : generateSlug(val)
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g. Software Solutions"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={catForm.slug}
                  onChange={(e) =>
                    setCatForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                  }
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g. software-solutions"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  SEO / Category Description
                </label>
                <textarea
                  value={catForm.description}
                  onChange={(e) =>
                    setCatForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="Brief SEO/category description..."
                />
              </div>

              <ImageUpload
                value={catForm.image}
                onChange={(url) => setCatForm((prev) => ({ ...prev, image: url }))}
                folder="categories"
                secret={secret}
                label="Category Illustration / Icon Image"
              />

              {/* FAQs Section */}
              <div className="space-y-3 pt-3 border-t border-purple-900/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider">
                    Frequently Asked Questions ({catForm.faqs.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setCatForm((prev) => ({
                        ...prev,
                        faqs: [...prev.faqs, { id: Date.now().toString(), question: "", answer: "" }]
                      }))
                    }
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add FAQ
                  </button>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {catForm.faqs.map((faq, index) => (
                    <div key={faq.id} className="p-3 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-2 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setCatForm((prev) => ({
                            ...prev,
                            faqs: prev.faqs.filter((f) => f.id !== faq.id)
                          }))
                        }
                        className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <input
                        type="text"
                        required
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...catForm.faqs];
                          updated[index].question = e.target.value;
                          setCatForm((prev) => ({ ...prev, faqs: updated }));
                        }}
                        placeholder="FAQ Question"
                        className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <textarea
                        required
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...catForm.faqs];
                          updated[index].answer = e.target.value;
                          setCatForm((prev) => ({ ...prev, faqs: updated }));
                        }}
                        placeholder="FAQ Answer"
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-purple-900/20">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-purple-900/30 hover:bg-purple-900/10 text-sm font-semibold text-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingCategory ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: Subcategory Edit/Add
          ======================================================== */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#140620] border border-purple-900/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsSubcategoryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 pr-6">
              {editingSubcategory ? `Edit Sub-Category: ${editingSubcategory.name}` : "Create Sub-Category"}
            </h2>

            <form onSubmit={handleSubcategorySubmit} className="space-y-5 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  Parent Category
                </label>
                <select
                  value={subForm.categorySlug}
                  required
                  onChange={(e) => setSubForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {categories.map((c) => (
                    <option key={c.id || c._id} value={c.slug}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  required
                  value={subForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSubForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: editingSubcategory ? prev.slug : generateSlug(val)
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g. Custom Web Apps"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={subForm.slug}
                  onChange={(e) =>
                    setSubForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                  }
                  className="w-full px-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g. custom-web-apps"
                />
              </div>

              {/* Bullet List */}
              <div className="p-4 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Bullet Checklist (For Client Details)
                </label>
                <div>
                  <input
                    type="text"
                    value={subForm.bulletList.heading}
                    onChange={(e) =>
                      setSubForm((prev) => ({
                        ...prev,
                        bulletList: { ...prev.bulletList, heading: e.target.value }
                      }))
                    }
                    placeholder="Checklist Heading (e.g. Deliverables)"
                    className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Points ({subForm.bulletList.points.length})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSubForm((prev) => ({
                          ...prev,
                          bulletList: {
                            ...prev.bulletList,
                            points: [...prev.bulletList.points, ""]
                          }
                        }))
                      }
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                    >
                      <PlusCircle size={12} /> Add Point
                    </button>
                  </div>
                  {subForm.bulletList.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={pt}
                        onChange={(e) => {
                          const pts = [...subForm.bulletList.points];
                          pts[idx] = e.target.value;
                          setSubForm((prev) => ({
                            ...prev,
                            bulletList: { ...prev.bulletList, points: pts }
                          }));
                        }}
                        placeholder="Point text"
                        className="flex-1 px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const pts = subForm.bulletList.points.filter((_, pIdx) => pIdx !== idx);
                          setSubForm((prev) => ({
                            ...prev,
                            bulletList: { ...prev.bulletList, points: pts }
                          }));
                        }}
                        className="text-red-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subcat Images */}
              <div className="p-4 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Showcase Images ({subForm.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSubForm((prev) => ({
                        ...prev,
                        images: [...prev.images, ""]
                      }))
                    }
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <PlusCircle size={12} /> Add Image Link
                  </button>
                </div>
                {subForm.images.map((img, idx) => (
                  <div key={idx} className="space-y-1 relative bg-[#140620] p-2 rounded-lg border border-purple-900/25">
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = subForm.images.filter((_, iIdx) => iIdx !== idx);
                        setSubForm((prev) => ({ ...prev, images: imgs }));
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                    <ImageUpload
                      value={img}
                      onChange={(url) => {
                        const imgs = [...subForm.images];
                        imgs[idx] = url;
                        setSubForm((prev) => ({ ...prev, images: imgs }));
                      }}
                      folder="subcategories"
                      secret={secret}
                      label={`Image ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* FAQs Section */}
              <div className="space-y-3 pt-3 border-t border-purple-900/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-300/80 uppercase tracking-wider">
                    Frequently Asked Questions ({subForm.faqs.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSubForm((prev) => ({
                        ...prev,
                        faqs: [...prev.faqs, { id: Date.now().toString(), question: "", answer: "" }]
                      }))
                    }
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add FAQ
                  </button>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {subForm.faqs.map((faq, index) => (
                    <div key={faq.id} className="p-3 bg-[#0d0315] border border-purple-950/40 rounded-xl space-y-2 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setSubForm((prev) => ({
                            ...prev,
                            faqs: prev.faqs.filter((f) => f.id !== faq.id)
                          }))
                        }
                        className="absolute top-2 right-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <input
                        type="text"
                        required
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...subForm.faqs];
                          updated[index].question = e.target.value;
                          setSubForm((prev) => ({ ...prev, faqs: updated }));
                        }}
                        placeholder="FAQ Question"
                        className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <textarea
                        required
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...subForm.faqs];
                          updated[index].answer = e.target.value;
                          setSubForm((prev) => ({ ...prev, faqs: updated }));
                        }}
                        placeholder="FAQ Answer"
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0f0418] border border-purple-900/20 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-purple-900/20">
                <button
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-purple-900/30 hover:bg-purple-900/10 text-sm font-semibold text-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingSubcategory ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageServicesAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-40 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
          <p className="text-sm font-semibold">Initializing Manage Services dashboard...</p>
        </div>
      }
    >
      <ManageServicesContent />
    </Suspense>
  );
}
