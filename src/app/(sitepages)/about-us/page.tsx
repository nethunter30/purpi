import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about enteropia, our mission, our principles, and how we deliver engineering excellence for scaling businesses globally.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">About Us</h1>
    </div>
  );
}
