"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/admin/components/layout/AdminHeader";
import AdminFooter from "@/admin/components/layout/AdminFooter";
import Sidebar from "@/admin/components/layout/AdminSidebar";
import AdminMobileMenu from "@/admin/components/layout/AdminMobileMenu";

interface AdminLayoutClientProps {
  children: ReactNode;
  secret: string;
}

export default function AdminLayoutClient({ children, secret }: AdminLayoutClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        const saved = localStorage.getItem("admin-sidebar-open");
        setSidebarOpen(saved !== null ? saved === "true" : true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobile, sidebarOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push(`/admin/${secret}/login`);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    if (!isMobile) {
      localStorage.setItem("admin-sidebar-open", String(next));
    }
  };

  return (
    <div className="min-h-screen bg-[#140620] text-white">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      <AdminMobileMenu
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        onLogout={handleLogout}
      />

      <div
        className={`
          flex min-h-screen flex-col
          transition-all duration-200 ease-in-out
          ${!isMobile && sidebarOpen ? "lg:pl-64" : "lg:pl-0"}
        `}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
