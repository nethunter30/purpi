"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCcw, UserCircle2, ShieldAlert, Loader2, Search, X, Pencil, Trash2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [randomSuffix, setRandomSuffix] = useState("");

  const generateSuffix = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 8; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return suffix;
  };

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/admin");
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const initialSuffix = generateSuffix();
    setRandomSuffix(initialSuffix);
    setFormData((prev) => ({ ...prev, userId: `etrpia-${initialSuffix}` }));
  }, []);

  const openModal = () => {
    setEditingUserId(null);
    const newSuffix = generateSuffix();
    setRandomSuffix(newSuffix);
    setFormData({ name: "", userId: `etrpia-${newSuffix}` });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user._id);
    setFormData({ name: user.name, userId: user.userId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setError("");
  };

  const generateUserId = () => {
    const newSuffix = generateSuffix();
    setRandomSuffix(newSuffix);
    const cleanName = formData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      userId: cleanName ? `etrpia-${cleanName}-${newSuffix}` : `etrpia-${newSuffix}`,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      const cleanName = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        name: value,
        userId: cleanName ? `etrpia-${cleanName}-${randomSuffix}` : `etrpia-${randomSuffix}`
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.userId) {
      setError("Name and User ID are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const url = editingUserId ? `/api/users/admin/${editingUserId}` : "/api/users/admin";
      const method = editingUserId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        fetchUsers(); // refresh list
        closeModal();
      } else {
        setError(result.message || (editingUserId ? "Failed to update user" : "Failed to create user"));
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the user "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/admin/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        fetchUsers();
      } else {
        setError(result.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <UserCircle2 className="w-8 h-8 text-[#a356db]" />
              User Management
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Create and manage access IDs for your platform users.
            </p>
          </div>
          <button
            onClick={openModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Generate New User
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Active Users
              <span className="bg-purple-900/50 text-purple-300 py-0.5 px-2.5 rounded-full text-[10px] font-bold border border-purple-500/20">
                {users.length}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Users authorized to access the system.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1c0f2b]/40 border border-purple-900/20 rounded-xl text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#a356db]" />
              <p className="text-sm text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-purple-950/40 rounded-xl">
              <UserCircle2 className="h-10 w-10 text-purple-900/40 mb-3" />
              <p className="text-xs font-semibold text-gray-400">No users found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#1c0f2b]/60 border-b border-purple-900/20">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">User</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date Added</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#1c0f2b]/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm shadow-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono bg-purple-900/20 border border-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs">
                        {user.userId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete User"
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40">
              <h3 className="text-lg font-bold text-white">
                {editingUserId ? "Edit User" : "Generate New User"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1c0f2b]/40 border border-purple-900/30 text-white placeholder-gray-500 focus:border-[#a356db] focus:ring-1 focus:ring-[#a356db] transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase tracking-wider flex justify-between">
                  <span>User ID</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="e.g. USR-XYZ123"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1c0f2b]/40 border border-purple-900/30 text-purple-300 font-mono focus:border-[#a356db] focus:ring-1 focus:ring-[#a356db] transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateUserId}
                    className="p-2.5 bg-purple-900/20 border border-purple-900/30 text-[#a356db] hover:bg-purple-900/40 rounded-xl transition-colors flex items-center justify-center group"
                    title="Regenerate ID"
                  >
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">
                  This unique ID will be used by the user to access the platform.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
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
                  className="flex-1 py-2.5 px-4 bg-[#a356db] hover:bg-[#b26be3] text-white rounded-xl text-sm font-medium transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingUserId ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create User
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
