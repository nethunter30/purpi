"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, Loader2, Search,
  ShieldAlert, Tag, X, Eye, EyeOff, Upload,
} from "lucide-react";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  category: ICategory | string;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
  category: "",
};

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [manualSlug, setManualSlug] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError("");
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("subfolder", "subcategories");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      if (result.success && result.imageUrl) {
        setFormData((p) => ({ ...p, image: result.imageUrl }));
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch {
      setError("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        fetch("/api/services/subcategories"),
        fetch("/api/services/categories"),
      ]);
      const [subResult, catResult] = await Promise.all([subRes.json(), catRes.json()]);
      if (subResult.success) setSubcategories(subResult.data);
      if (catResult.success) setCategories(catResult.data);
      if (!subResult.success) setError(subResult.message || "Failed to fetch subcategories");
    } catch {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setManualSlug(false);
    setFormData({ ...emptyForm, category: categories[0]?._id || "" });
    setUploadMode("upload");
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (sub: ISubcategory) => {
    setEditingId(sub._id);
    setManualSlug(true);
    setFormData({
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      image: sub.image,
      isActive: sub.isActive,
      category: typeof sub.category === "object" ? sub.category._id : sub.category,
    });
    setUploadMode(sub.image && sub.image.startsWith("http") ? "url" : "upload");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setError(""); };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name };
      if (!manualSlug && !editingId) {
        updated.slug = name.toLowerCase().trim()
          .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(true);
    const slug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const url = editingId ? `/api/services/subcategories/${editingId}` : "/api/services/subcategories";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) { fetchAll(); closeModal(); }
      else setError(result.message || "Failed to save");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    try {
      const res = await fetch(`/api/services/subcategories/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) fetchAll();
      else setError(result.message || "Failed to delete");
    } catch { setError("Failed to delete"); }
  };

  const toggleActive = async (sub: ISubcategory) => {
    try {
      const res = await fetch(`/api/services/subcategories/${sub._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sub,
          category: typeof sub.category === "object" ? sub.category._id : sub.category,
          isActive: !sub.isActive,
        }),
      });
      const result = await res.json();
      if (result.success) fetchAll();
    } catch { setError("Failed to update status"); }
  };

  const getCategoryName = (cat: ICategory | string) =>
    typeof cat === "object" ? cat.name : (categories.find((c) => c._id === cat)?.name ?? "—");

  const filtered = subcategories.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#a356db]" />
          Subcategories
          <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
            {subcategories.length}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search subcategories..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-light"
            />
          </div>
          <button onClick={openCreate}
            className="px-4 py-2.5 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-xs font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Subcategory
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
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
            <Tag className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-light">No subcategories yet. Click "Add Subcategory" to start.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f0418] text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                <th className="px-6 py-4">Subcategory</th>
                <th className="px-6 py-4">Parent Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/10">
              {filtered.map((sub) => (
                <tr key={sub._id} className="hover:bg-purple-900/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {sub.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-900/30 flex-shrink-0">
                          <img src={sub.image} alt={sub.name} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">{sub.name}</p>
                        <p className="text-xs text-gray-400 font-light line-clamp-1">{sub.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 bg-purple-950/40 text-purple-300 rounded-lg border border-purple-900/30">
                      {getCategoryName(sub.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-purple-300 font-mono bg-purple-950/30 px-2 py-1 rounded-lg">
                      /{sub.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(sub)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                        sub.isActive
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {sub.isActive ? <><Eye className="w-3 h-3" /> Active</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(sub)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(sub._id, sub.name)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40">
              <h3 className="text-lg font-bold text-white">{editingId ? "Edit Subcategory" : "New Subcategory"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-xs">{error}</div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Parent Category *</label>
                <select required value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm cursor-pointer"
                >
                  <option value="" disabled className="bg-[#150a21] text-white">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-[#150a21] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Name *</label>
                  <input type="text" required value={formData.name} onChange={handleNameChange}
                    placeholder="e.g. DevOps Services"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Slug *</label>
                  <input type="text" required value={formData.slug} onChange={handleSlugChange}
                    placeholder="e.g. devops-services"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-mono"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Description *</label>
                <textarea required rows={3} value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description..."
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white text-xs font-medium">Subcategory Image</label>
                <div className="flex gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode("upload")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      uploadMode === "upload"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "border-purple-900/30 text-gray-400 hover:text-white"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      uploadMode === "url"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "border-purple-900/30 text-gray-400 hover:text-white"
                    }`}
                  >
                    URL Link
                  </button>
                </div>

                {uploadMode === "upload" ? (
                  <div className="flex flex-col gap-2">
                    <div className="relative flex items-center justify-center border border-dashed border-purple-900/40 rounded-xl p-4 bg-[#1c0f2b]/20 hover:bg-[#1c0f2b]/40 transition-colors">
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-xs text-purple-400 py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading to Cloudinary...</span>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-1.5 cursor-pointer text-xs text-gray-400 hover:text-white font-light">
                          <span className="font-semibold text-purple-400 hover:underline flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" /> Click to upload
                          </span>
                          <span>SVG, PNG, JPG or GIF (max. 5MB)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                    {formData.image && (
                      <div className="flex items-center gap-3 p-2 bg-[#1c0f2b]/40 border border-purple-900/20 rounded-xl">
                        <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-purple-900/30" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 truncate font-light">Uploaded Image URL:</p>
                          <p className="text-xs text-purple-300 font-mono truncate">{formData.image}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                    placeholder="https://... or /path/to/image.png"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                  />
                )}
              </div>
              <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                <input type="checkbox" checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                />
                Active (visible on site)
              </label>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white border border-purple-900/30 hover:border-purple-600 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-xs font-semibold text-white transition-all shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
