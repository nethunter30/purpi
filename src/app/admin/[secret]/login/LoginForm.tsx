"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock } from "lucide-react";

export default function LoginForm({ secret }: { secret: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // After login the cookie is set — redirect into the secret path
        router.push(`/admin/${secret}/dashboard`);
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#140620] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-4 cursor-pointer border border-purple-900/30">
              <Image
                src="/logo.png"
                alt="enteropia Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">
            enteropia Admin
          </h1>
        </div>

        <div className="bg-[#140624] border border-purple-900/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-purple-300/80 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#221035] border border-purple-900/30 text-white rounded placeholder-gray-500 focus:outline-none focus:border-[#a356db] focus:ring-1 focus:ring-[#a356db] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-300/80 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#221035] border border-purple-900/30 text-white rounded placeholder-gray-500 focus:outline-none focus:border-[#a356db] focus:ring-1 focus:ring-[#a356db] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a356db] hover:bg-[#b066e6] text-white py-2.5 rounded text-sm font-bold transition-all disabled:opacity-50 mt-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] cursor-pointer"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
