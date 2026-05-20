"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { RefreshCcw, ShieldAlert, Loader2, Search, Check, Trash2, MessageSquareQuote } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  userId: string;
  stars: number;
  status: "pending" | "approved";
  createdAt: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const result = await res.json();
      if (result.success) {
        setTestimonials(result.data);
      } else {
        setError(result.message || "Failed to fetch testimonials");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "pending") => {
    setProcessingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        fetchTestimonials();
      } else {
        setError(result.message || "Failed to update status");
      }
    } catch (err) {
      setError("An unexpected error occurred while updating status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) {
      return;
    }
    setProcessingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchTestimonials();
      } else {
        setError(result.message || "Failed to delete testimonial");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MessageSquareQuote className="w-8 h-8 text-[#a356db]" />
              Testimonials Approval
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Review and approve user testimonials before they are published on the website.
            </p>
          </div>
          <button
            onClick={fetchTestimonials}
            disabled={isLoading}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#2a133d] hover:bg-[#391a54] text-sm font-semibold text-gray-300 transition-all border border-purple-900/40 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Submissions
              <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
                {testimonials.length}
              </span>
            </h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm font-medium">Loading testimonials...</p>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <MessageSquareQuote className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No testimonials found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4 font-semibold">User Info</th>
                  <th className="px-6 py-4 font-semibold">Review</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filteredTestimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-purple-900/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.role}</p>
                          <p className="text-[10px] text-purple-400 mt-0.5">{t.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < t.stars ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2" title={t.text}>
                        "{t.text}"
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.status === "approved" 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === "pending" && (
                          <button
                            onClick={() => updateStatus(t._id, "approved")}
                            disabled={processingId === t._id}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve Testimonial"
                          >
                            {processingId === t._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(t._id, t.name)}
                          disabled={processingId === t._id}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Testimonial"
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
    </div>
  );
}
