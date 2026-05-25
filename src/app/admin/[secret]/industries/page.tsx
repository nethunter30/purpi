"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ShieldAlert,
  X,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldPlus,
  ShoppingCart,
  Rocket,
  Factory,
  Landmark,
  Briefcase,
  Truck,
  Utensils,
} from "lucide-react";
import { useParams } from "next/navigation";

interface IndustryItem {
  _id?: string;
  id: string; // Slug
  title: string;
  description: string;
  iconName: string;
  link: string;
  isActive: boolean;
}

const SUPPORTED_ICONS = [
  { name: "Building2", label: "Business (Building)" },
  { name: "GraduationCap", label: "Education (Graduation Cap)" },
  { name: "ShieldPlus", label: "Healthcare (Shield Plus)" },
  { name: "ShoppingCart", label: "Retail (Cart)" },
  { name: "Rocket", label: "Startups (Rocket)" },
  { name: "Factory", label: "Manufacturing (Factory)" },
  { name: "Landmark", label: "Finance (Landmark)" },
  { name: "Briefcase", label: "Professional Services (Briefcase)" },
  { name: "Truck", label: "Logistics (Truck)" },
  { name: "Utensils", label: "Hospitality (Utensils)" },
];

const emptyForm: IndustryItem = {
  id: "",
  title: "",
  description: "",
  iconName: "Building2",
  link: "/solutions",
  isActive: true,
};

export default function IndustriesAdminPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IndustryItem>(emptyForm);
  const [manualSlug, setManualSlug] = useState(false);

  const fetchIndustries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/industries?all=true");
      const result = await res.json();
      if (result.success) {
        setIndustries(result.data);
      } else {
        setError(result.message || "Failed to fetch industries");
      }
    } catch {
      setError("An unexpected error occurred while loading industries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setManualSlug(false);
    setFormData(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (ind: IndustryItem) => {
    setEditingId(ind._id || ind.id);
    setManualSlug(true);
    setFormData({
      id: ind.id,
      title: ind.title,
      description: ind.description,
      iconName: ind.iconName,
      link: ind.link || "/solutions",
      isActive: ind.isActive,
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title };
      if (!manualSlug && !editingId) {
        updated.id = title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(true);
    const slug = e.target.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, id: slug }));
  };

  const toggleActiveStatus = async (ind: IndustryItem) => {
    try {
      const res = await fetch(`/api/industries/${ind._id || ind.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ind, isActive: !ind.isActive }),
      });
      const result = await res.json();
      if (result.success) {
        fetchIndustries();
      } else {
        setError(result.message || "Failed to toggle visibility");
      }
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this industry vertical? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/industries/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchIndustries();
      } else {
        setError(result.message || "Failed to delete industry");
      }
    } catch {
      setError("An unexpected error occurred while deleting the industry");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.id || !formData.title || !formData.description || !formData.iconName) {
      setError("Title, Slug, Description, and Icon Name are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = editingId ? `/api/industries/${editingId}` : "/api/industries";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        closeModal();
        fetchIndustries();
      } else {
        setError(result.message || "Failed to save industry");
      }
    } catch {
      setError("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconComponent = (name: string) => {
    switch (name) {
      case "Building2":
        return Building2;
      case "GraduationCap":
        return GraduationCap;
      case "ShieldPlus":
        return ShieldPlus;
      case "ShoppingCart":
        return ShoppingCart;
      case "Rocket":
        return Rocket;
      case "Factory":
        return Factory;
      case "Landmark":
        return Landmark;
      case "Briefcase":
        return Briefcase;
      case "Truck":
        return Truck;
      case "Utensils":
        return Utensils;
      default:
        return Building2;
    }
  };

  const filtered = industries.filter(
    (ind) =>
      ind.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#a356db]" />
              Industries Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Manage the industry verticals and custom pre-configured solution sectors served by enteropia.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Industry Vertical
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Industry Verticals
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {industries.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-light"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Building2 className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-light">No industry verticals found. Click "Add Industry Vertical" to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Industry Sector</th>
                  <th className="px-6 py-4">Link Redirect</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filtered.map((ind) => {
                  const Icon = getIconComponent(ind.iconName);
                  return (
                    <tr key={ind._id || ind.id} className="hover:bg-purple-900/5 transition-colors">
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-snug">{ind.title}</p>
                            <p className="text-xs text-purple-300 font-mono mt-0.5">/{ind.id}</p>
                            <p className="text-xs text-gray-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                              {ind.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono bg-purple-950/20 text-purple-300 border border-purple-900/10 px-2.5 py-1 rounded-lg">
                          {ind.link || "/solutions"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActiveStatus(ind)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                            ind.isActive
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {ind.isActive ? (
                            <><Eye className="w-3 h-3" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Hidden</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(ind)}
                            className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ind._id || ind.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0c0314] rounded-2xl border border-purple-900/30 flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-900/20 bg-[#0e0416] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingId ? "Edit Industry Sector" : "Create New Industry Sector"}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Add or edit the industries details and standard Lucide navigation icons.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-950/30 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 flex-shrink-0">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#0c0314]">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Industry Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Logistics & Transport"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={handleSlugChange}
                    placeholder="e.g. logistics-transport"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-mono font-light"
                  />
                </div>

                {/* Icon Selection Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Lucide Icon Preview *</label>
                  <div className="flex gap-3 items-center">
                    <select
                      value={formData.iconName}
                      onChange={(e) => setFormData((p) => ({ ...p, iconName: e.target.value }))}
                      className="flex-1 bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm cursor-pointer"
                    >
                      {SUPPORTED_ICONS.map((ico) => (
                        <option key={ico.name} value={ico.name} className="bg-[#150a21] text-white">
                          {ico.label}
                        </option>
                      ))}
                    </select>
                    {/* Real-time icon preview box */}
                    <div className="w-11 h-11 rounded-xl bg-purple-950/30 border border-purple-900/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                      {React.createElement(getIconComponent(formData.iconName), { className: "w-5 h-5" })}
                    </div>
                  </div>
                </div>

                {/* Link Redirect */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Redirect URL Link *</label>
                  <input
                    type="text"
                    required
                    value={formData.link}
                    onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))}
                    placeholder="e.g. /solutions"
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-mono"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Vertical Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Explain the custom hardware, networking solutions, or SaaS portals designed for this industry..."
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light leading-relaxed"
                  />
                </div>

                {/* Active Switch */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                    />
                    Make vertical active (Visible on dynamic listings page)
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t border-purple-900/20 bg-[#0e0416] flex-shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-[#a356db] hover:bg-[#b26be3] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Industry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
