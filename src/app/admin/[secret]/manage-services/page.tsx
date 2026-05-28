"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layers, Tag, FolderTree, ChevronRight, Settings2 } from "lucide-react";
import CategoriesPage from "./categories/page";
import SubcategoriesPage from "./subcategories/page";
import ProductsPage from "./product/page";

type Tab = "categories" | "subcategories" | "products";

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "categories",
    label: "Categories",
    icon: FolderTree,
    description: "Top-level service groupings",
  },
  {
    id: "subcategories",
    label: "Subcategories",
    icon: Tag,
    description: "Sub-groups within categories",
  },
  {
    id: "products",
    label: "Products / Services",
    icon: Layers,
    description: "Individual service offerings",
  },
];

export default function ManageServicesPage() {
  const params = useParams();
  const secret = params.secret as string;
  const [activeTab, setActiveTab] = useState<Tab>("categories");

  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings2 className="w-8 h-8 text-[#a356db]" />
            Manage Services
          </h1>
          <p className="text-sm text-gray-300 max-w-xl font-light">
            Configure the full service catalogue — categories, subcategories, and individual product pages with rich content sections.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#140624] rounded-2xl border border-purple-900/20 shadow-xl overflow-hidden">
        <div className="flex border-b border-purple-900/20 bg-[#0e0416] px-2 pt-2 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-[#a356db] text-white bg-[#140624]"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-purple-900/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Breadcrumb / tab context bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-purple-900/10 bg-[#1c0f2b]/20">
          <span className="text-xs text-gray-500 font-light">Manage Services</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-xs text-purple-300 font-semibold">{active.label}</span>
          <span className="ml-auto text-[10px] text-gray-600 font-light italic">{active.description}</span>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "categories" && <CategoriesPage />}
          {activeTab === "subcategories" && <SubcategoriesPage />}
          {activeTab === "products" && <ProductsPage />}
        </div>
      </div>
    </div>
  );
}
