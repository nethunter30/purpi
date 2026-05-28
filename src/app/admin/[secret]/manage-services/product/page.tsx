"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Loader2, Search,
  ShieldAlert, Layers, Eye, EyeOff, ExternalLink,
} from "lucide-react";

interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  category: { _id: string; name: string; slug: string } | string;
  subcategory: { _id: string; name: string; slug: string } | string;
}

export default function ProductsPage() {
  const params = useParams();
  const secret = params.secret as string;
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services/products");
      const result = await res.json();
      if (result.success) setProducts(result.data);
      else setError(result.message || "Failed to fetch products");
    } catch {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete service "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/services/products/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) fetchProducts();
      else setError(result.message || "Failed to delete");
    } catch { setError("Failed to delete product"); }
  };

  const toggleActive = async (product: IProduct) => {
    try {
      const res = await fetch(`/api/services/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const result = await res.json();
      if (result.success) fetchProducts();
    } catch { setError("Failed to update status"); }
  };

  const getName = (val: { _id: string; name: string } | string) =>
    typeof val === "object" ? val.name : val;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#a356db]" />
          Services
          <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
            {products.length}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search services..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-light"
            />
          </div>
          <button
            onClick={() => router.push(`/admin/${secret}/manage-services/product/new`)}
            className="px-4 py-2.5 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-xs font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0f0418]/60 rounded-xl border border-purple-900/20 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Layers className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-light">No services yet. Click "Add Service" to create one.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f0418] text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Subcategory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/10">
              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-purple-900/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <div className="w-12 h-8 rounded-lg overflow-hidden border border-purple-900/30 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">{product.name}</p>
                        <p className="text-xs text-purple-300 font-mono">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 bg-purple-950/40 text-purple-300 rounded-lg border border-purple-900/30">
                      {getName(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 bg-indigo-950/40 text-indigo-300 rounded-lg border border-indigo-900/30">
                      {getName(product.subcategory)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(product)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                        product.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {product.isActive ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product.isActive && (
                        <a href={`/services/${
                          typeof product.category === "object" ? product.category.slug : product.category
                        }/${typeof product.subcategory === "object" ? product.subcategory.slug : product.subcategory}/${product.slug}`}
                          target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-lg transition-colors cursor-pointer"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => router.push(`/admin/${secret}/manage-services/product/${product._id}/edit`)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id, product.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
