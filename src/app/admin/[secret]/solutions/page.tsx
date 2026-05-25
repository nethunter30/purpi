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
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Server,
  GraduationCap,
  ShieldAlert as ShieldIcon,
  Store,
  Rocket,
  PlusCircle,
  MinusCircle
} from "lucide-react";
import { useParams } from "next/navigation";
import ImageUpload from "@/admin/components/common/ImageUpload";

interface SolutionItem {
  _id?: string;
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: string;
  features: string[];
  startingPrice: string;
  learnMoreUrl: string;
  isActive: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Server,
  GraduationCap,
  ShieldAlert: ShieldIcon,
  Store,
  Rocket
};

const emptyForm: SolutionItem = {
  id: "",
  title: "",
  description: "",
  image: "",
  iconName: "Server",
  features: [""],
  startingPrice: "₹",
  learnMoreUrl: "/#contact",
  isActive: true,
};

export default function SolutionsAdminPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<SolutionItem>(emptyForm);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [manualSlug, setManualSlug] = useState(false);

  const fetchSolutions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/solutions?all=true");
      const result = await res.json();
      if (result.success) {
        setSolutions(result.data);
      } else {
        setError(result.message || "Failed to fetch solutions");
      }
    } catch {
      setError("An unexpected error occurred while loading solutions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setManualSlug(false);
    setActiveTab("write");
    setFormData(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (sol: SolutionItem) => {
    setEditingId(sol._id || sol.id);
    setManualSlug(true);
    setActiveTab("write");
    setFormData({
      id: sol.id,
      title: sol.title,
      description: sol.description,
      image: sol.image,
      iconName: sol.iconName || "Server",
      features: sol.features && sol.features.length > 0 ? [...sol.features] : [""],
      startingPrice: sol.startingPrice,
      learnMoreUrl: sol.learnMoreUrl || "/#contact",
      isActive: sol.isActive,
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
          .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-")         // Replace spaces with hyphens
          .replace(/-+/g, "-");         // Remove consecutive hyphens
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

  // Dynamic features list helpers
  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const addFeatureInput = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeatureInput = (index: number) => {
    setFormData((prev) => {
      if (prev.features.length <= 1) return prev;
      const features = prev.features.filter((_, idx) => idx !== index);
      return { ...prev, features };
    });
  };

  const toggleActiveStatus = async (sol: SolutionItem) => {
    try {
      const res = await fetch(`/api/solutions/${sol._id || sol.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sol,
          isActive: !sol.isActive,
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchSolutions();
      } else {
        setError(result.message || "Failed to toggle visibility");
      }
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this solutions package? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/solutions/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchSolutions();
      } else {
        setError(result.message || "Failed to delete package");
      }
    } catch {
      setError("An unexpected error occurred while deleting the package");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Filter out blank features
    const cleanFeatures = formData.features.map((f) => f.trim()).filter(Boolean);
    if (cleanFeatures.length === 0) {
      setError("Please add at least one feature point");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      features: cleanFeatures,
    };

    try {
      const url = editingId ? `/api/solutions/${editingId}` : "/api/solutions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        closeModal();
        fetchSolutions();
      } else {
        setError(result.message || "Failed to save solution package");
      }
    } catch {
      setError("An unexpected error occurred while saving the solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSolutions = solutions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PreviewIcon = iconMap[formData.iconName] || Server;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-[#a356db]" />
              Solutions Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Add, configure, and manage pre-packaged IT infrastructure and software solutions visible on the Solutions pricing page.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add IT Package
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Solutions Listing Table */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            IT Packages
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {solutions.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by package name..."
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
          ) : filteredSolutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Briefcase className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-light">No solutions packages found. Click "Add IT Package" to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Package Details</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Features</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filteredSolutions.map((sol) => {
                  const RowIcon = iconMap[sol.iconName] || Server;
                  return (
                    <tr key={sol._id || sol.id} className="hover:bg-purple-900/5 transition-colors">
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 rounded-lg relative overflow-hidden bg-purple-950/20 border border-purple-900/30 flex-shrink-0">
                            {sol.image ? (
                              <img
                                src={sol.image}
                                alt={sol.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#1c0f2b]/40 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-purple-400/40" />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-bold text-white truncate" title={sol.title}>
                              {sol.title}
                            </p>
                            <p className="text-xs text-purple-300 font-mono mt-0.5 truncate">
                              /{sol.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white font-mono">{sol.startingPrice}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-950/30 text-purple-300 border border-purple-900/20 text-xs">
                          <RowIcon className="w-3.5 h-3.5" />
                          {sol.iconName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-300">{sol.features.length} points</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActiveStatus(sol)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                            sol.isActive
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {sol.isActive ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sol)}
                            className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sol._id || sol.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete package"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0314] rounded-2xl border border-purple-900/30 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-900/20 bg-[#0e0416] flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingId ? "Edit IT Package Details" : "Create New IT Package"}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Define description, features, starting price, and select Lucide icons for solutions.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-950/30 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message inside modal */}
            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 flex-shrink-0">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Tabs Selector */}
            <div className="flex border-b border-purple-900/20 px-6 bg-[#0c0314] flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`py-3 px-4 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "write"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Write Package
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`py-3 px-4 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Live Preview
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {activeTab === "write" ? (
                <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#0c0314]">
                  {/* Grid fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Small Business IT Starter"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">URL Slug (Package ID) *</label>
                      <input
                        type="text"
                        required
                        value={formData.id}
                        onChange={handleSlugChange}
                        placeholder="e.g. small-business-it"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light font-mono"
                      />
                    </div>
                  </div>

                  {/* Summary / Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Package Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Explain what vertical this package caters to and key advantages..."
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light leading-relaxed"
                    />
                  </div>

                  {/* Pricing, Icon and Link Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Starting Price *</label>
                      <input
                        type="text"
                        required
                        value={formData.startingPrice}
                        onChange={(e) => setFormData((p) => ({ ...p, startingPrice: e.target.value }))}
                        placeholder="e.g. ₹35,000"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Lucide Icon Name *</label>
                      <select
                        value={formData.iconName}
                        onChange={(e) => setFormData((p) => ({ ...p, iconName: e.target.value }))}
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm cursor-pointer"
                      >
                        {Object.keys(iconMap).map((icon) => (
                          <option key={icon} value={icon} className="bg-[#150a21] text-white">
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Learn More URL</label>
                      <input
                        type="text"
                        value={formData.learnMoreUrl}
                        onChange={(e) => setFormData((p) => ({ ...p, learnMoreUrl: e.target.value }))}
                        placeholder="/#contact"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>
                  </div>

                  {/* Banner Image Upload */}
                  <div className="border-t border-purple-900/20 pt-5 space-y-2">
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                      folder="solutions"
                      secret={secret}
                      label="Package Image *"
                    />
                  </div>

                  {/* Dynamic Features List Manager */}
                  <div className="border-t border-purple-900/20 pt-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                        Bullet Point Features List
                      </h4>
                      <button
                        type="button"
                        onClick={addFeatureInput}
                        className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Point
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-purple-500/80 font-mono w-4">
                            {index + 1}.
                          </span>
                          <input
                            type="text"
                            required
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="e.g. Server setup & management"
                            className="flex-1 bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeatureInput(index)}
                            disabled={formData.features.length <= 1}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visibility Checkbox */}
                  <div className="border-t border-purple-900/20 pt-5">
                    <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                      />
                      Make package active (Visible on web page)
                    </label>
                  </div>
                </div>
              ) : (
                /* Live Preview tab rendering exactly what displays on website */
                <div className="p-8 bg-black flex-1 overflow-y-auto flex items-center justify-center">
                  <div className="relative flex flex-col bg-black/40 backdrop-blur-md shadow-lg border border-white/10 rounded-sm overflow-hidden w-full max-w-[320px]">
                    {/* Cover image illustration */}
                    <div className="relative w-full h-36 sm:h-40 flex-shrink-0 bg-slate-800 overflow-hidden border-b border-white/10">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Banner Preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
                          Upload image to see banner
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Info Content block */}
                    <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Icon & Title Row */}
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-white/10 flex-shrink-0">
                            <PreviewIcon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <h3 className="text-[15px] sm:text-base font-extrabold text-white tracking-tight">
                            {formData.title || "Untitled Package"}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-slate-400 text-[11px] sm:text-xs leading-snug mb-2 font-light line-clamp-2">
                          {formData.description || "Package description details will display here."}
                        </p>

                        {/* Features Bullet List */}
                        <ul className="space-y-1 mb-2">
                          {formData.features.map((feat, fIdx) => {
                            if (!feat.trim()) return null;
                            return (
                              <li key={fIdx} className="flex items-start gap-2 text-slate-400 text-xs sm:text-[13px]">
                                <div className="mt-0.5 w-3 h-3 rounded-full bg-purple-500/20 border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                                  <Check className="w-2 h-2 stroke-[2.5]" />
                                </div>
                                <span className="font-normal text-slate-300 leading-snug">{feat}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Bottom Pricing & Action Section */}
                      <div className="border-t border-white/10 pt-2 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Starting from</span>
                          <span className="text-sm sm:text-base font-black text-purple-400 tracking-tight font-mono mt-0.5">
                            {formData.startingPrice || "₹0"}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                          Learn More
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer actions */}
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
                    "Create Package"
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
