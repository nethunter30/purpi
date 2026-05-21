import React from "react";
import Header from "@/sitepages/components/layout/Header";
import Footer from "@/sitepages/components/layout/Footer";
import SmoothScroll from "@/sitepages/components/layout/SmoothScroll";

export default function SitePagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#140620] text-white font-sans overflow-x-hidden selection:bg-fuchsia-500/30">
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}
