import React from "react";
import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About Us | enteropia",
  description:
    "Learn more about enteropia — a Bengaluru-based enterprise technology company founded in 2026. Discover our mission, vision, core values, and the team behind our engineering excellence.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
