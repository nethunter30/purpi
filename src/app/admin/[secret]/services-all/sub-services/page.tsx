"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ShieldAlert,
  Layers,
  X,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Service {
  _id: string;
  title: string;
  slug: string;
}

interface SubService {
  _id: string;
  serviceId: { _id: string; title: string; slug: string } | string;
  title: string;
  slug: string;
  description: string;
  whatWeOffer: string[];
  benefits: string[];
  order: number;
}

const emptyForm = {
  serviceId: "",
  title: "",
  description: "",
  whatWeOffer: [] as string[],
  benefits: [] as string[],
  order: 0,
};

export default function SubServicesAdminPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [services, setServices] = useState<Service[]>([]);
  const [subservices, setSubservices] = useState<SubService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterServiceId, setFilterServiceId] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [offerInput, setOfferInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      const result = await res.json();
      if (result.success) setServices(result.data);
    } catch {
      /* silent */
    }
  }, []);

  const fetchSubServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = filterServiceId
        ? `/api/admin/subservices?serviceId=${filterServiceId}`
        : "/api/admin/subservices";
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setSubservices(result.data);
      } else {
        setError(result.message || "Failed to fetch sub-services");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filterServiceId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOfferInput("");
    setBenefitInput("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (ss: SubService) => {
    setEditingId(ss._id);
    const svcId =
      typeof ss.serviceId === "object" ? ss.serviceId._id : ss.serviceId;
    setFormData({
      serviceId: svcId,
      title: ss.title,
      description: ss.description,
      whatWeOffer: ss.whatWeOffer || [],
      benefits: ss.benefits || [],
      order: ss.order,
    });
    setOfferInput("");
    setBenefitInput("");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError("");
  };

  const addOffer = () => {
    const val = offerInput.trim();
    if (!val) return;
    setFormData((p) => ({ ...p, whatWeOffer: [...p.whatWeOffer, val] }));
    setOfferInput("");
  };

  const removeOffer = (i: number) =>
    setFormData((p) => ({
      ...p,
      whatWeOffer: p.whatWeOffer.filter((_, idx) => idx !== i),
    }));

  const addBenefit = () => {
    const val = benefitInput.trim();
    if (!val) return;
    setFormData((p) => ({ ...p, benefits: [...p.benefits, val] }));
    setBenefitInput("");
  };

  const removeBenefit = (i: number) =>
    setFormData((p) => ({
      ...p,
      benefits: p.benefits.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const url = editingId
      ? `/api/admin/subservices/${editingId}`
      : "/api/admin/subservices";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        fetchSubServices();
        closeModal();
      } else {
        setError(result.message || "Failed to save sub-service");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Delete the sub-service "${title}"? This cannot be undone.`
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/subservices/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchSubServices();
      } else {
        setError(result.message || "Failed to delete");
      }
    } catch {
      setError("An unexpected error occurred while deleting");
    }
  };

  const getServiceTitle = (ss: SubService) => {
    if (typeof ss.serviceId === "object") return ss.serviceId.title;
    return services.find((s) => s._id === ss.serviceId)?.title ?? "Unknown";
  };

  const filtered = subservices.filter(
    (ss) =>
      ss.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ss.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Back breadcrumb */}
      <Link
        href={`/admin/${secret}/services-all`}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Services Hub
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-900/30 bg-gradient-to-r from-[#0d0720] to-[#1a1040] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-8 h-8 text-indigo-400" />
              Sub-services Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Manage detailed offerings nested under each parent service
              category.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-indigo-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Sub-service
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
            All Sub-services
            <span className="flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {subservices.length}
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Filter by parent service */}
            <div className="relative">
              <select
                value={filterServiceId}
                onChange={(e) => setFilterServiceId(e.target.value)}
                className="appearance-none w-full sm:w-52 pl-3 pr-8 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sub-services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Layers className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">
                No sub-services found. Click "Add Sub-service" to create one.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Sub-service</th>
                  <th className="px-6 py-4">Parent Service</th>
                  <th className="px-6 py-4">Offers</th>
                  <th className="px-6 py-4">Benefits</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filtered.map((ss) => (
                  <tr
                    key={ss._id}
                    className="hover:bg-purple-900/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{ss.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                        {ss.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-purple-300 bg-purple-900/20 px-2 py-1 rounded font-medium">
                        {getServiceTitle(ss)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400">
                        {ss.whatWeOffer?.length ?? 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400">
                        {ss.benefits?.length ?? 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-300">{ss.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ss)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit Sub-service"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ss._id, ss.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete Sub-service"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Sub-service" : "Add New Sub-service"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {/* Parent Service */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  Parent Service *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, serviceId: e.target.value }))
                    }
                    className="appearance-none w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm cursor-pointer pr-8"
                  >
                    <option value="">Select a parent service...</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. AWS Cloud Migration"
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Brief description of this sub-service..."
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm resize-none"
                />
              </div>

              {/* What We Offer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  What We Offer
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={offerInput}
                    onChange={(e) => setOfferInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOffer();
                      }
                    }}
                    placeholder="Add an offering and press Enter..."
                    className="flex-1 bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addOffer}
                    className="px-3 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-600/40 text-indigo-300 rounded-xl text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.whatWeOffer.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.whatWeOffer.map((item, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-indigo-900/30 text-indigo-300 rounded-lg border border-indigo-800/40"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeOffer(i)}
                          className="text-indigo-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  Benefits
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                    placeholder="Add a benefit and press Enter..."
                    className="flex-1 bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-3 py-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-600/40 text-purple-300 rounded-xl text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.benefits.map((item, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-purple-900/30 text-purple-300 rounded-lg border border-purple-800/40"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeBenefit(i)}
                          className="text-purple-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      order: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-purple-900/20">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Sub-service
                    </>
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
