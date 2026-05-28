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
  BookOpen, 
  X, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  FileText, 
  Sparkles,
  User,
  Calendar,
  Clock,
  Tag
} from "lucide-react";
import { useParams } from "next/navigation";
import ImageUpload from "@/admin/components/common/ImageUpload";
import Image from "next/image";

interface BlogPost {
  _id: string;
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: any;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  tags: string[];
  featured: boolean;
  isActive: boolean;
}

const emptyForm = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  category: "",
  date: "",
  readTime: "5 min read",
  author: {
    name: "",
    role: "Writer",
    avatar: "/illustrations/newsletter-person.png",
  },
  image: "",
  tags: "",
  featured: false,
  isActive: true,
};

// Preset categories removed - dynamically loaded from DB

export default function BlogAdminPage() {
  const params = useParams();
  const secret = params.secret as string;
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [manualSlug, setManualSlug] = useState(false);

  const displayCategoryName = React.useMemo(() => {
    const matched = categoriesList.find((cat) => cat._id === formData.category);
    return matched ? matched.name : "Select Category";
  }, [formData.category, categoriesList]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog?all=true");
      const result = await res.json();
      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.message || "Failed to fetch blog posts");
      }
    } catch {
      setError("An unexpected error occurred while loading blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/services/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategoriesList(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories for blog admin:", err);
    }
  };


  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);



  const openCreateModal = () => {
    setEditingId(null);
    setManualSlug(false);
    setActiveTab("write");
    
    // Default current date
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    setFormData({
      ...emptyForm,
      category: categoriesList.length > 0 ? categoriesList[0]._id : "",
      date: today,
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingId(post._id);
    setManualSlug(true);
    setActiveTab("write");
    setFormData({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category ? (typeof post.category === "object" ? (post.category._id || post.category.id) : post.category) : "",
      date: post.date,
      readTime: post.readTime || "5 min read",
      author: {
        name: post.author?.name || "",
        role: post.author?.role || "Writer",
        avatar: post.author?.avatar || "/illustrations/newsletter-person.png",
      },
      image: post.image || "",
      tags: post.tags ? post.tags.join(", ") : "",
      featured: post.featured || false,
      isActive: post.isActive,
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
    setFormData(prev => {
      const updated = { ...prev, title };
      if (!manualSlug && !editingId) {
        // Auto-generate slug from title
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
    setFormData(prev => ({ ...prev, id: slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Prepare tags array
    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submitData = {
      ...formData,
      tags: tagsArray,
      // If author name is blank, default to "Admin"
      author: {
        ...formData.author,
        name: formData.author.name.trim() || "enteropia Contributor"
      }
    };

    const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const result = await res.json();
      if (result.success) {
        fetchPosts();
        closeModal();
      } else {
        setError(result.message || "Failed to save blog post");
      }
    } catch {
      setError("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete the blog post "${title}"? This action is permanent and cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchPosts();
      } else {
        setError(result.message || "Failed to delete blog post");
      }
    } catch {
      setError("An unexpected error occurred while deleting the post");
    }
  };

  const toggleFeaturedStatus = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          featured: !post.featured,
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchPosts();
      } else {
        setError(result.message || "Failed to toggle featured status");
      }
    } catch {
      setError("Failed to update status");
    }
  };

  const toggleActiveStatus = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          isActive: !post.isActive,
        }),
      });
      const result = await res.json();
      if (result.success) {
        fetchPosts();
      } else {
        setError(result.message || "Failed to toggle visibility");
      }
    } catch {
      setError("Failed to update status");
    }
  };



  const filteredPosts = posts.filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const catName = typeof p.category === "object" && p.category ? p.category.name : (p.category || "");
    const categoryMatch = catName.toLowerCase().includes(searchTerm.toLowerCase());
    const excerptMatch = p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || categoryMatch || excerptMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-[#a356db]" />
              Blog Manager
            </h1>
            <p className="text-sm text-gray-300 max-w-xl font-light">
              Create, edit, and publish technical insights, system briefs, and engineering articles visible on the public Blog site.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 flex items-center gap-2 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-sm font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Write Blog Post
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Listing Panel */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden">
        {/* Panel controls */}
        <div className="p-5 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Articles & Drafts
            <span className="flex items-center justify-center bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6">
              {posts.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, summary, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0f0418] border border-purple-900/30 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-light"
            />
          </div>
        </div>

        {/* Database List Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <BookOpen className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-light">No blog posts found. Click "Write Blog Post" to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f0418]/50 text-xs uppercase tracking-wider text-gray-400 border-b border-purple-900/20">
                  <th className="px-6 py-4">Article Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-purple-900/5 transition-colors">
                    <td className="px-6 py-4 max-w-xs md:max-w-md">
                      <div className="flex items-center gap-4">
                        {/* cover preview */}
                        <div className="w-16 h-10 rounded-lg relative overflow-hidden bg-purple-950/20 border border-purple-900/30 flex-shrink-0">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <FileText className="w-4 h-4 absolute inset-0 m-auto text-purple-400/40" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-white truncate" title={post.title}>
                            {post.title}
                          </p>
                          <p className="text-xs text-purple-300 font-mono mt-0.5 truncate">
                            /{post.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 bg-purple-950/40 text-purple-300 rounded-lg border border-purple-900/30">
                        {typeof post.category === "object" && post.category ? post.category.name : (post.category || "Uncategorized")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full relative overflow-hidden border border-purple-900/40 bg-purple-950 flex items-center justify-center">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} alt="avatar" className="object-cover w-full h-full" />
                          ) : (
                            <User className="w-3 h-3 text-purple-400" />
                          )}
                        </div>
                        <span className="text-xs text-gray-300 font-medium">{post.author?.name || "Contributor"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeaturedStatus(post)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                          post.featured
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-transparent text-gray-500 border-gray-800"
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {post.featured ? "Featured" : "Regular"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActiveStatus(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors hover:opacity-85 border cursor-pointer ${
                          post.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {post.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.isActive && (
                          <a
                            href={`/blog/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 rounded-lg transition-colors cursor-pointer"
                            title="View Live Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Post"
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

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#150a21] border border-purple-900/30 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/20 bg-[#1c0f2b]/40 flex-shrink-0">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  {editingId ? "Edit Blog Post" : "Write Blog Post"}
                </h3>
                <p className="text-xs text-gray-400 font-light">
                  Complete metadata and compose the post body using standard Markdown layout.
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Controls */}
            <div className="flex border-b border-purple-900/20 bg-[#0e0416] px-6">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "write"
                    ? "border-[#a356db] text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Write Post
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "border-[#a356db] text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Live Preview
              </button>
            </div>

            {/* Form & Workspace Container */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
              {activeTab === "write" ? (
                <div className="p-6 space-y-6 flex-1">
                  {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-xs">
                      {error}
                    </div>
                  )}

                  {/* Top Metadata Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Scaling Next.js 15 Applications"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">URL Slug (Path ID) *</label>
                      <input
                        type="text"
                        required
                        value={formData.id}
                        onChange={handleSlugChange}
                        placeholder="e.g. scaling-nextjs-15-applications"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium">Excerpt (Summary) *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                      placeholder="Enter a brief description that appears in list grids and search results..."
                      className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light resize-none"
                    />
                  </div>

                  {/* Media uploads row */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData((p) => ({ ...p, image: url }))}
                      folder="blogs"
                      secret={secret}
                      label="Cover Banner Image (Cloudinary)*"
                    />
                  </div>

                  {/* Classification Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm cursor-pointer"
                      >
                        {categoriesList.length === 0 ? (
                          <option value="" disabled className="bg-[#150a21] text-white">
                            Loading categories...
                          </option>
                        ) : (
                          categoriesList.map((cat) => (
                            <option key={cat._id} value={cat._id} className="bg-[#150a21] text-white">
                              {cat.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                        placeholder="Next.js, Edge, Serverless"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Read Time</label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData((p) => ({ ...p, readTime: e.target.value }))}
                        placeholder="e.g. 5 min read"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-white text-xs font-medium">Date Display</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                        placeholder="May 25, 2026"
                        className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                      />
                    </div>
                  </div>

                  {/* Author Details grid */}
                  <div className="border-t border-purple-900/20 pt-5 space-y-4">
                    <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                      Author Attribution
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.author.name}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              author: { ...p.author, name: e.target.value },
                            }))
                          }
                          placeholder="e.g. Vikram Dev"
                          className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Role *</label>
                        <input
                          type="text"
                          required
                          value={formData.author.role}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              author: { ...p.author, role: e.target.value },
                            }))
                          }
                          placeholder="e.g. Systems Engineer"
                          className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-white text-xs font-medium">Avatar Image URL</label>
                        <input
                          type="text"
                          value={formData.author.avatar}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              author: { ...p.author, avatar: e.target.value },
                            }))
                          }
                          placeholder="/illustrations/newsletter-person.png"
                          className="w-full bg-[#1c0f2b]/50 border border-purple-900/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-light"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Editor Textarea */}
                  <div className="flex flex-col gap-2 border-t border-purple-900/20 pt-5">
                    <div className="flex justify-between items-center">
                      <label className="text-white text-xs font-medium">
                        Content (Markdown) *
                      </label>
                      <span className="text-[10px] text-gray-500 font-light font-mono">
                        Markdown supported: # h1, ## h2, ### h3, **bold**, *italic*, &gt; blockquote, ```code blocks```
                      </span>
                    </div>
                    <textarea
                      required
                      rows={14}
                      value={formData.content}
                      onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                      placeholder="# Write your blog header here&#10;&#10;Compose the text body..."
                      className="w-full bg-[#0f0418] border border-purple-900/30 rounded-xl p-4 text-purple-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-mono leading-relaxed"
                    />
                  </div>

                  {/* Toggles row */}
                  <div className="flex flex-wrap gap-6 border-t border-purple-900/20 pt-5">
                    <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                        className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                      />
                      Featured post (Show in highlight banner)
                    </label>

                    <label className="flex items-center gap-2.5 text-white text-xs font-medium cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded border-purple-900/30 bg-[#1c0f2b]/50 text-[#a356db] focus:ring-purple-500"
                      />
                      Publish immediately (Active)
                    </label>
                  </div>
                </div>
              ) : (
                /* Live Preview Tab rendering exactly what will show up on frontend single pages */
                <div className="p-8 bg-black flex-1 overflow-y-auto">
                  <div className="max-w-3xl mx-auto space-y-8 text-white">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-light">
                      <span className="px-3 py-1 rounded-full bg-purple-900/20 text-[#c455e3] border border-purple-800/30 text-xs font-semibold uppercase tracking-wider">
                        {displayCategoryName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-500/70" /> {formData.date || "Date Drafted"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-500/70" /> {formData.readTime || "5 min read"}
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {formData.title || "Untitled Blog Post"}
                    </h1>

                    {/* Author Attribution */}
                    <div className="flex items-center gap-3 border-b border-purple-950/40 pb-5">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-800/30 bg-purple-950 flex items-center justify-center">
                        {formData.author.avatar ? (
                          <img src={formData.author.avatar} alt="avatar" className="object-cover w-full h-full" />
                        ) : (
                          <User className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">
                          {formData.author.name || "enteropia Contributor"}
                        </p>
                        <p className="text-[10px] text-gray-500 font-light mt-1">
                          {formData.author.role || "Writer"}
                        </p>
                      </div>
                    </div>

                    {/* Cover Banner Preview */}
                    {formData.image ? (
                      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-purple-900/20">
                        <img
                          src={formData.image}
                          alt="Banner Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-[#1c0f2b]/40 rounded-2xl border border-dashed border-purple-900/30 flex flex-col items-center justify-center text-gray-500 text-sm">
                        <FileText className="w-8 h-8 mb-2 opacity-30 text-purple-400" />
                        Upload a cover banner image to see it here.
                      </div>
                    )}

                    {/* Tag list preview */}
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-950/20">
                        {formData.tags.split(",").map(t => t.trim()).filter(Boolean).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2.5 py-1 bg-purple-950/30 text-purple-300 rounded-lg border border-purple-900/20 flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5" /> #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Content Markdown render */}
                    <div className="pt-6 border-t border-purple-950/20">
                      {formData.content ? (
                        <div className="space-y-4">
                          {formData.content.split("\n\n").filter(Boolean).map((para: string, i: number) => (
                            <p key={i} className="text-gray-300 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
                              {para.trim()}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm font-mono italic">
                          Write some Markdown in the "Write Post" tab to see it render here.
                        </p>
                      )}
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
                    <>
                      <Plus className="w-4 h-4" />
                      Create Blog
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
