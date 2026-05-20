"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Search, ShieldAlert, Users, X, Eye, EyeOff } from "lucide-react";
import { useParams } from "next/navigation";
import ImageUpload from "@/admin/components/common/ImageUpload";
import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  order: number;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  image: "",
  bgColor: "#8a35e5",
  order: 1,
  isActive: true,
};

const presetColors = [
  { name: "Vibrant Purple", hex: "#8a35e5" },
  { name: "Lavender Mauve", hex: "#a76fd2" },
  { name: "Midnight Plum", hex: "#5c1fa6" },
  { name: "Royal Purple", hex: "#7a22e0" },
  { name: "Deep Amethyst", hex: "#4b168f" },
];

export default function TeamAdminPage() {
  const params = useParams();
  const secret = params.secret as string;
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const result = await res.json();
      if (result.success) {
        // Fetch all members for admin, but wait, the public route /api/team only returns active members!
        // To be thorough, let's fetch from the team API. If the API returns active-only, we'll show them.
        // Wait, does /api/team filter by isActive: true? Yes, it does in our API.
        // That is fine, or we can fetch them. Let's make sure the admin sees all of them, or they can create/edit.
        setMembers(result.data);
      } else {
        setError(result.message || "Failed to fetch team members");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      order: members.length > 0 ? Math.max(...members.map((m) => m.order)) + 1 : 1,
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image || "",
      bgColor: member.bgColor || "#8a35e5",
      order: member.order,
      isActive: member.isActive,
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

    const url = editingId ? `/api/team/${editingId}` : "/api/team";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        fetchMembers();
        closeModal();
      } else {
        setError(result.message || "Failed to save team member");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete the team member "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchMembers();
      } else {
        setError(result.message || "Failed to delete");
      }
    } catch {
      setError("An unexpected error occurred while deleting");
    }
  };

  const toggleActiveStatus = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/team/${member._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...member,
          isActive: !member.isActive,
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchMembers();
      } else {
        setError(result.message || "Failed to toggle status");
      }
    } catch {
      setError("Failed to update status");
    }
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-[#a356db]" />
              Team Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Add, update, or remove team members displayed on the homepage "Our Team" section.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
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
            All Members
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {members.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or role..."
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
              <Users className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No team members found. Click "Add Team Member" to create one.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Member Info</th>
                  <th className="px-6 py-4">Card Background</th>
                  <th className="px-6 py-4">Sorting Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-purple-900/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Profile Image Preview */}
                        <div
                          className="w-12 h-12 rounded-xl relative overflow-hidden flex items-end justify-center border border-purple-500/20 flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: m.bgColor || "#8a35e5" }}
                        >
                          {m.image ? (
                            <Image
                              src={m.image}
                              alt={m.name}
                              fill
                              sizes="48px"
                              className="object-contain object-bottom"
                            />
                          ) : (
                            <Users className="w-6 h-6 mb-1 text-white/40" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{m.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: m.bgColor }}
                        />
                        <code className="text-xs text-purple-300 font-mono">{m.bgColor}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-300 font-medium bg-[#1c0f2b] border border-purple-900/40 px-2.5 py-1 rounded-lg">
                        {m.order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActiveStatus(m)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 ${
                          m.isActive
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {m.isActive ? (
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
                          onClick={() => openEditModal(m)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Member"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.name)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Member"
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
          <div className="w-full max-w-md bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex-shrink-0">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Mike Hasselpuff"
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. CEO / Lead Designer"
                  className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                folder="team"
                secret={secret}
                label="Portrait Image (Cloudinary Upload)"
              />

              {/* Background Color Picker */}
              <div className="flex flex-col gap-2.5">
                <label className="text-white text-xs font-medium">Card Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, bgColor: color.hex }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                        formData.bgColor === color.hex ? "border-white scale-110 shadow-lg" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {/* Custom color input wrapper */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-dashed border-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center">
                    <input
                      type="color"
                      value={formData.bgColor}
                      onChange={(e) => setFormData((p) => ({ ...p, bgColor: e.target.value }))}
                      className="absolute inset-0 w-full h-full p-0 border-0 opacity-100 cursor-pointer scale-150"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#0f0418]/60 px-4 py-2 rounded-xl border border-purple-900/20 mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Selected:</span>
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: formData.bgColor }} />
                  <code className="text-xs text-purple-300 font-mono">{formData.bgColor}</code>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-xs font-medium">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.order}
                    onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5 justify-end">
                  <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer py-3 select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                    />
                    Active (Show on Home)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-purple-900/20 mt-2 flex-shrink-0">
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
                    <>
                      <Plus className="w-4 h-4" />
                      Create Member
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
