"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Inbox,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  Check,
  CheckCircle2,
  TrendingUp,
  Award,
  DollarSign,
  HelpCircle,
  Coins
} from "lucide-react";

interface ReferralSubmission {
  _id: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  referrerUpiOrBank: string;
  clientBusinessName: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone?: string;
  projectScope: string;
  status: 'Pending' | 'In Progress' | 'Signed' | 'Paid' | 'Rejected';
  isRead: boolean;
  createdAt: string;
}

export default function CareersAdminPage() {
  const params = useParams();
  const secret = params.secret as string;

  const [submissions, setSubmissions] = useState<ReferralSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<ReferralSubmission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/referrals");
      const result = await res.json();
      if (result.success) {
        setSubmissions(result.data || []);
      } else {
        setError(result.message || "Failed to fetch referral submissions");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred while fetching submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        // Update local list
        setSubmissions((prev) =>
          prev.map((sub) => (sub._id === id ? { ...sub, status: newStatus as any } : sub))
        );
        // If modal is open for this message, update modal details
        if (selectedSubmission?._id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        alert(result.message || "Failed to update lead status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentReadStatus }),
      });
      const result = await res.json();
      if (result.success) {
        // Update local list
        setSubmissions((prev) =>
          prev.map((sub) => (sub._id === id ? { ...sub, isRead: !currentReadStatus } : sub))
        );
        // If modal is open for this message, update modal details
        if (selectedSubmission?._id === id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, isRead: !currentReadStatus } : null));
        }
      } else {
        alert(result.message || "Failed to update read status");
      }
    } catch (err) {
      console.error("Toggle read error:", err);
      alert("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the referral from "${name}"? This action is permanent.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/referrals/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setSubmissions((prev) => prev.filter((sub) => sub._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
      } else {
        alert(result.message || "Failed to delete submission");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting message");
    }
  };

  // Metrics calculations
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "Pending").length;
  const inProgressCount = submissions.filter((s) => s.status === "In Progress").length;
  const closedCount = submissions.filter((s) => s.status === "Signed" || s.status === "Paid").length;

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    const referrer = sub.referrerName.toLowerCase();
    const referrerEmail = sub.referrerEmail.toLowerCase();
    const clientName = sub.clientBusinessName.toLowerCase();
    const clientContact = sub.clientContactName.toLowerCase();
    const scope = sub.projectScope.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      referrer.includes(searchLower) ||
      referrerEmail.includes(searchLower) ||
      clientName.includes(searchLower) ||
      clientContact.includes(searchLower) ||
      scope.includes(searchLower);

    if (statusFilter !== "all") {
      return matchesSearch && sub.status === statusFilter;
    }
    return matchesSearch;
  });

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "In Progress":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "Signed":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold";
      case "Paid":
        return "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 font-extrabold";
      case "Rejected":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Coins className="w-8 h-8 text-[#a356db]" />
              Referrals & Partners
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Track submitted referral business leads, monitor client statuses, and update payout progressions for referring partners.
            </p>
          </div>
          
          <button
            onClick={fetchSubmissions}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
          >
            Refresh Referrals
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Metric 1: Total */}
        <div className="relative overflow-hidden rounded-xl border border-purple-900/20 bg-[#140624]/60 p-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Total Leads</span>
            <div className="p-2 rounded-lg bg-purple-950/50 text-purple-400 border border-purple-500/10">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{totalCount}</span>
            <span className="text-xs text-gray-400">submitted</span>
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="relative overflow-hidden rounded-xl border border-purple-900/20 bg-[#140624]/60 p-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Pending Review</span>
            <div className="p-2 rounded-lg bg-amber-950/50 text-amber-400 border border-amber-500/10">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">{pendingCount}</span>
            <span className="text-xs text-gray-400">new leads</span>
          </div>
        </div>

        {/* Metric 3: Active */}
        <div className="relative overflow-hidden rounded-xl border border-purple-900/20 bg-[#140624]/60 p-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">In Negotiation</span>
            <div className="p-2 rounded-lg bg-blue-950/50 text-blue-400 border border-blue-500/10">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400">{inProgressCount}</span>
            <span className="text-xs text-gray-400">in discussion</span>
          </div>
        </div>

        {/* Metric 4: Closed */}
        <div className="relative overflow-hidden rounded-xl border border-purple-900/20 bg-[#140624]/60 p-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Closed / Signed</span>
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/10">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">{closedCount}</span>
            <span className="text-xs text-gray-400">contracts signed</span>
          </div>
        </div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#140624]/40 border border-purple-900/20 p-4 rounded-xl backdrop-blur-sm">
        
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search referrer, client company, scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#3c294d]/40 text-white text-xs border border-purple-900/20 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap rounded-lg bg-[#3c294d]/30 border border-purple-900/20 p-1 w-full lg:w-auto gap-1">
          {["all", "Pending", "In Progress", "Signed", "Paid", "Rejected"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-[#a356db] text-white shadow-md shadow-purple-500/10"
                  : "text-gray-400 hover:text-white hover:bg-purple-950/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Database Error Banner */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Submissions List Container */}
      <div className="relative overflow-hidden rounded-xl border border-purple-900/20 bg-[#140624]/30 backdrop-blur-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col justify-center items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#a356db]" />
            <p className="text-xs text-gray-400">Loading referral submissions from database...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-20 flex flex-col justify-center items-center gap-2.5">
            <Inbox className="w-10 h-10 text-purple-500/30" />
            <h4 className="text-white font-medium text-sm">No referrals found</h4>
            <p className="text-xs text-gray-400 max-w-xs text-center">
              {searchTerm
                ? "No records match your active search filter query."
                : `There are currently no referrals matching the status filter.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="border-b border-purple-900/20 bg-purple-950/15">
                  <th className="px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">Referrer (Partner)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">Referred Business</th>
                  <th className="px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">Submitted On</th>
                  <th className="px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider">Lead Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-purple-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub._id}
                    className={`hover:bg-purple-950/10 transition-colors group cursor-pointer ${
                      !sub.isRead ? "bg-purple-950/5" : ""
                    }`}
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    {/* Referrer info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/10">
                          {getInitials(sub.referrerName)}
                        </div>
                        <div>
                          <div className={`text-xs font-semibold text-white group-hover:text-[#c455e3] transition-colors ${
                            !sub.isRead ? "font-bold" : ""
                          }`}>
                            {sub.referrerName}
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-1 max-w-[200px] mt-0.5">
                            {sub.referrerEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client info */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-200">
                          {sub.clientBusinessName}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Contact: {sub.clientContactName}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-[11px] text-gray-400">
                        {new Date(sub.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </td>

                    {/* Lead Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Eye Button */}
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          title="Read Details"
                          className="p-2 rounded-lg bg-[#3c294d]/40 border border-purple-500/10 hover:border-[#a855f7] hover:text-white text-gray-400 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Toggle Read */}
                        <button
                          onClick={() => handleToggleRead(sub._id, sub.isRead)}
                          disabled={isUpdating}
                          title={sub.isRead ? "Mark Unread" : "Mark Read"}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            sub.isRead
                              ? "bg-purple-950/20 border-purple-500/10 text-purple-400 hover:bg-[#a855f7]/20 hover:text-white"
                              : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-white"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(sub._id, sub.referrerName)}
                          title="Delete Lead"
                          className="p-2 rounded-lg bg-red-950/20 border border-red-500/10 hover:border-red-500 hover:text-white text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Stacked Card View */}
            <div className="grid grid-cols-1 divide-y divide-purple-900/10 md:hidden">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-5 flex flex-col gap-3.5 hover:bg-purple-950/5 transition-colors relative cursor-pointer ${
                    !sub.isRead ? "bg-purple-950/5 border-l-2 border-purple-500" : ""
                  }`}
                  onClick={() => setSelectedSubmission(sub)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {getInitials(sub.referrerName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">
                          {sub.referrerName}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 select-all">
                          {sub.referrerEmail}
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] text-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 leading-relaxed bg-[#3c294d]/10 border border-purple-500/5 p-3 rounded-lg space-y-1.5">
                    <div>
                      <strong className="text-purple-300">Client:</strong> {sub.clientBusinessName} ({sub.clientContactName})
                    </div>
                    <div className="line-clamp-2">
                      <strong className="text-purple-300">Scope:</strong> {sub.projectScope}
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4 pt-1" onClick={(e) => e.stopPropagation()}>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRead(sub._id, sub.isRead)}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                          sub.isRead
                            ? "bg-purple-950/20 border-purple-500/10 text-purple-400 hover:text-white"
                            : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:text-white"
                        }`}
                      >
                        {sub.isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => handleDelete(sub._id, sub.referrerName)}
                        className="p-1.5 rounded-lg bg-red-950/20 border border-red-500/10 text-red-400 hover:border-red-500 hover:text-white cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Premium Detail Modal Overlay */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="w-full max-w-2xl bg-[#0f041b] border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Radial Accent inside Modal */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-purple-900/20 pb-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-extrabold text-white shadow-lg">
                  {getInitials(selectedSubmission.referrerName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Referral from {selectedSubmission.referrerName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 select-all">
                    Partner Email: {selectedSubmission.referrerEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg bg-[#3c294d]/40 text-gray-400 hover:text-white hover:bg-[#3c294d]/80 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              
              {/* Submission Date Field */}
              <div className="flex justify-between items-center bg-[#1c0f2b] p-3 rounded-lg border border-purple-950">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Submitted Time</span>
                <span className="text-xs text-gray-300 font-medium">
                  {new Date(selectedSubmission.createdAt).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "medium",
                  })}
                </span>
              </div>

              {/* Grid: Referrer and Client details side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Referrer Details */}
                <div className="bg-[#140624]/60 border border-purple-900/10 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider border-b border-purple-950 pb-1">
                    1. Partner (Referrer)
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <p><strong>Name:</strong> {selectedSubmission.referrerName}</p>
                    <p><strong>Email:</strong> {selectedSubmission.referrerEmail}</p>
                    <p><strong>Phone:</strong> {selectedSubmission.referrerPhone || "Not provided"}</p>
                    <p className="bg-[#1c0f2b] p-2 rounded border border-purple-900/20 text-[#c455e3] select-all mt-2 break-all">
                      <strong>Payout Details:</strong><br/>
                      {selectedSubmission.referrerUpiOrBank}
                    </p>
                  </div>
                </div>

                {/* Client Details */}
                <div className="bg-[#140624]/60 border border-purple-900/10 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider border-b border-purple-950 pb-1">
                    2. Referred Client
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <p><strong>Business:</strong> {selectedSubmission.clientBusinessName}</p>
                    <p><strong>Contact:</strong> {selectedSubmission.clientContactName}</p>
                    <p><strong>Email:</strong> {selectedSubmission.clientEmail}</p>
                    <p><strong>Phone:</strong> {selectedSubmission.clientPhone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Project Requirements Block */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Project Requirements & Scope</label>
                <div className="bg-[#140624] border border-purple-900/20 rounded-xl p-4 text-sm text-gray-200 leading-relaxed white-space-pre-wrap whitespace-pre-wrap select-text min-h-[100px]">
                  {selectedSubmission.projectScope}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="bg-[#1c0f2b] border border-purple-950 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Lead Deal Status</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Move this lead through the negotiation timeline.</p>
                </div>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => handleUpdateStatus(selectedSubmission._id, e.target.value)}
                  className="bg-[#0f041b] border border-purple-900/40 rounded-lg text-xs font-semibold px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#a356db]"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="In Progress">In Negotiation</option>
                  <option value="Signed">Contract Signed (10% due)</option>
                  <option value="Paid">Commission Paid</option>
                  <option value="Rejected">Rejected / Ineligible</option>
                </select>
              </div>
            </div>

            {/* Modal Controls / Footer */}
            <div className="border-t border-purple-900/20 pt-5 mt-5 flex flex-wrap gap-3 justify-between items-center">
              
              {/* Read Status Checkbox Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedSubmission._id, selectedSubmission.isRead)}
                  disabled={isUpdating}
                  className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedSubmission.isRead
                      ? "bg-purple-950/20 border-purple-500/20 text-purple-400 hover:text-white"
                      : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:text-white"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {selectedSubmission.isRead ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  onClick={() => handleDelete(selectedSubmission._id, selectedSubmission.referrerName)}
                  className="p-1.5 rounded-lg bg-red-950/20 border border-red-500/10 text-red-400 hover:border-red-500 hover:text-white cursor-pointer transition-all"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action: Reply */}
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedSubmission.referrerEmail}?subject=Re: Your referral to enteropia`}
                  className="px-4 py-2 rounded-xl bg-purple-950 border border-purple-500/30 text-[11px] font-semibold text-purple-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Reply to Referrer
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`mailto:${selectedSubmission.clientEmail}?subject=IT & Software Solutions inquiry - enteropia`}
                  className="px-4 py-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-[11px] font-bold text-white tracking-wide transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  Contact Referred Client
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
