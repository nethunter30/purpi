"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Search, ShieldAlert, LayoutGrid, X } from "lucide-react";
import { useParams } from "next/navigation";
import ImageUpload from "@/admin/components/common/ImageUpload";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  details: string;
  image: string;
  order: number;
}

const emptyForm = { title: "", description: "", details: "", image: "", order: 0 };

export default function ServicesAdminPage() {
  const params = useParams();
  const secret = params.secret as string;
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
      } else {
        setError(result.message || "Failed to fetch services");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      details: service.details || "",
      image: service.image,
      order: service.order,
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        fetchServices();
        closeModal();
      } else {
        setError(result.message || "Failed to save service");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete the service card "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchServices();
      } else {
        setError(result.message || "Failed to delete");
      }
    } catch {
      setError("An unexpected error occurred while deleting");
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <LayoutGrid className="w-8 h-8 text-[#a356db]" />
              Services Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Manage the service cards displayed in the "What We Do" section of the homepage.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Service
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
            All Services
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {services.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
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
              <LayoutGrid className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No services found. Click "Add Service" to create one.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Image Path</th>
                  <th className="px-6 py-4">Slug Path</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-purple-900/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{s.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-purple-400 bg-purple-900/20 px-2 py-1 rounded">{s.image}</code>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-purple-400 bg-purple-900/20 px-2 py-1 rounded">/services/{s.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-300">{s.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete Service"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Cloud Infrastructure"
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description of the service..."
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Details / Deep Dive</label>
                <textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData((p) => ({ ...p, details: e.target.value }))}
                  placeholder="Comprehensive details about the service solutions..."
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm resize-none"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                folder="services"
                secret={secret}
                label="Image *"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))}
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
              </div>

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
                  className="flex-1 py-2.5 px-4 bg-[#a356db] hover:bg-[#b26be3] text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Service
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
