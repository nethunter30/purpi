"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LayoutGrid, Layers, ArrowRight, Tag } from "lucide-react";

export default function ServicesHubPage() {
  const params = useParams();
  const secret = params.secret as string;

  const sections = [
    {
      icon: LayoutGrid,
      title: "Services Manager",
      description:
        "Manage top-level service categories displayed on the homepage and the services listing page. Add, edit, or remove service cards.",
      href: `/admin/${secret}/services-all/services`,
      label: "Manage Services",
      color: "from-purple-600/20 to-violet-700/10",
      border: "border-purple-600/30",
      iconBg: "bg-purple-600/20",
      iconColor: "text-purple-400",
      badge: "Categories",
    },
    {
      icon: Layers,
      title: "Sub-services Manager",
      description:
        "Manage detailed sub-service offerings nested under each parent service. Define what you offer, key benefits, and ordering.",
      href: `/admin/${secret}/services-all/sub-services`,
      label: "Manage Sub-services",
      color: "from-indigo-600/20 to-blue-700/10",
      border: "border-indigo-600/30",
      iconBg: "bg-indigo-600/20",
      iconColor: "text-indigo-400",
      badge: "Offerings",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20">
              <Tag className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Services Hub
            </h1>
          </div>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            Your central control panel for managing all service-related content.
            Use <span className="text-purple-300 font-medium">Services</span> to
            define top-level categories, and{" "}
            <span className="text-indigo-300 font-medium">Sub-services</span> to
            add detailed offerings nested under each category.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              href={section.href}
              className={`group relative overflow-hidden rounded-2xl border ${section.border} bg-gradient-to-br ${section.color} bg-[#0e0416] p-8 hover:scale-[1.01] transition-all duration-200 shadow-xl hover:shadow-purple-900/20 block`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/2 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-5">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${section.iconBg}`}>
                    <Icon className={`w-7 h-7 ${section.iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${section.iconBg} ${section.iconColor} tracking-wide`}>
                    {section.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className={`flex items-center gap-2 text-sm font-semibold ${section.iconColor} group-hover:gap-3 transition-all`}>
                  {section.label}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-purple-900/20 bg-[#140624]/60 p-5">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-purple-400 font-semibold">Tip:</span> Create
          your top-level <span className="text-gray-300">Services</span> first,
          then add <span className="text-gray-300">Sub-services</span> linked to
          each parent. Sub-services appear on the individual service detail
          page.
        </p>
      </div>
    </div>
  );
}
