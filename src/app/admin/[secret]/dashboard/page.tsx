"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Star,
  CheckCircle,
  Clock,
  Sparkles,
  Mail,
  RefreshCcw,
  Loader2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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

interface User {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
}

interface ContactSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const secret = (params?.secret as string) || "";

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [resTestimonials, resUsers, resContacts] = await Promise.all([
        fetch("/api/admin/testimonials"),
        fetch("/api/users/admin"),
        fetch("/api/contact")
      ]);

      if (!resTestimonials.ok || !resUsers.ok || !resContacts.ok) {
        throw new Error("Failed to load statistics from API endpoints.");
      }

      const dataTestimonials = await resTestimonials.json();
      const dataUsers = await resUsers.json();
      const dataContacts = await resContacts.json();

      if (dataTestimonials.success) {
        setTestimonials(dataTestimonials.data || []);
      }
      if (dataUsers.success) {
        setUsers(dataUsers.data || []);
      }
      if (dataContacts.success) {
        setContacts(dataContacts.data || []);
      }
    } catch (err: any) {
      console.error("Dashboard fetching error:", err);
      setError(err.message || "An unexpected error occurred while fetching dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#a356db] mb-4" />
        <p className="text-sm font-medium">Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl flex flex-col items-center justify-center min-h-[300px] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm font-semibold">{error}</p>
        <button 
          onClick={fetchData}
          className="px-4 py-2.5 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-lg shadow-purple-500/20"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const totalStars = testimonials.reduce((sum, item) => sum + item.stars, 0);
  const avgStars = testimonials.length > 0 ? (totalStars / testimonials.length).toFixed(1) : "0.0";
  const unreadContacts = contacts.filter(c => !c.isRead).length;

  const statCards = [
    {
      name: "Total Users",
      value: users.length,
      change: `${users.length > 0 ? "Registered users" : "No accounts created yet"}`,
      icon: Users,
      color: "from-indigo-600 to-purple-600"
    },
    {
      name: "Total Reviews",
      value: testimonials.length,
      change: `${testimonials.filter(t => t.status === "pending").length} pending approval`,
      icon: MessageSquare,
      color: "from-pink-600 to-rose-600"
    },
    {
      name: "Avg Rating",
      value: `${avgStars} ★`,
      change: "Stars based on feedback",
      icon: Star,
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Inquiries",
      value: contacts.length,
      change: `${unreadContacts} unread submissions`,
      icon: Mail,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome back, Admin <Sparkles className="h-6 w-6 text-[#a356db]" />
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Monitor user accounts, view submitted testimonials, inspect live platform analytics, and manage application configurations.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-purple-500/30 bg-[#3b1764]/40 hover:bg-[#3b1764]/70 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => router.push(`/admin/${secret}/manage-services`)}
              className="px-4 py-2.5 rounded-xl border border-purple-500/30 bg-[#3b1764]/40 hover:bg-[#3b1764]/70 text-xs font-semibold text-white tracking-wide transition-all shadow-lg hover:shadow-purple-500/5 cursor-pointer"
            >
              Manage Services
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="relative overflow-hidden rounded-xl border border-purple-900/10 bg-[#150a21] p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {card.name}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {card.value}
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">
                  {card.change}
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Columns - Testimonials & Contact submissions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Testimonials List */}
          <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Submitted Testimonials</h2>
                <p className="text-xs text-gray-400">Recent reviews submitted by platform users.</p>
              </div>
              <button 
                onClick={() => router.push(`/admin/${secret}/testimonials`)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 border border-dashed border-purple-950/40 rounded-xl">
                  <MessageSquare className="h-10 w-10 text-purple-900/40 mb-3" />
                  <p className="text-xs font-semibold">No submissions recorded yet.</p>
                  <p className="text-[10px] text-gray-600 mt-1">User-submitted testimonials will appear here.</p>
                </div>
              ) : (
                testimonials.slice(0, 5).map((t) => (
                  <div 
                    key={t._id} 
                    className="p-4 rounded-xl border border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/20 transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-purple-900/50 flex-shrink-0 overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.userId || t.name)}&backgroundColor=transparent`} 
                          alt={t.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{t.name}</span>
                          <span className="text-[10px] text-gray-500">({t.role})</span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            t.status === "approved" 
                              ? "bg-green-500/10 text-green-400 border border-green-500/10" 
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/10"
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-2">
                          "{t.text}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 self-start md:self-auto flex-shrink-0">
                      <span className="text-xs font-bold text-yellow-400">{t.stars}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Submissions List */}
          <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
                <p className="text-xs text-gray-400">Messages sent through the contact form.</p>
              </div>
              <button 
                onClick={() => router.push(`/admin/${secret}/contact`)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider transition-colors cursor-pointer"
              >
                View All Messages <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 border border-dashed border-purple-950/40 rounded-xl">
                  <Mail className="h-10 w-10 text-purple-900/40 mb-3" />
                  <p className="text-xs font-semibold">No inquiries received yet.</p>
                  <p className="text-[10px] text-gray-600 mt-1">Inquiries from the contact page will be listed here.</p>
                </div>
              ) : (
                contacts.slice(0, 5).map((c) => (
                  <div 
                    key={c._id} 
                    className="p-4 rounded-xl border border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/20 transition-all duration-300"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{c.firstName} {c.lastName}</span>
                          <span className="text-[10px] text-purple-400">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          {!c.isRead && (
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10 text-[8px] font-bold uppercase tracking-wider animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                        {c.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status & Recent Users */}
        <div className="space-y-8">
          {/* System Status */}
          <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">System Status</h2>
              <p className="text-xs text-gray-400">Health checks and configuration.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-gray-200">Database Connection</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-gray-200">Storage Service</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-200">Task Scheduler</span>
                </div>
                <span className="text-[10px] font-bold text-yellow-400 uppercase">Idle</span>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Users</h2>
                <p className="text-xs text-gray-400">Latest registered accounts.</p>
              </div>
              <button 
                onClick={() => router.push(`/admin/${secret}/users`)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider transition-colors cursor-pointer"
              >
                All Users <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 border border-dashed border-purple-950/40 rounded-xl">
                  <Users className="h-8 w-8 text-purple-900/40 mb-2" />
                  <p className="text-[10px] font-semibold">No accounts found.</p>
                </div>
              ) : (
                users.slice(0, 5).map((u) => (
                  <div 
                    key={u._id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-purple-900/40 overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.userId)}&backgroundColor=transparent`} 
                          alt={u.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{u.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono">{u.userId}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-500 font-light flex-shrink-0">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
