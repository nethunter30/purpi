import React from "react";
import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers & Referral Program | enteropia",
  description:
    "Join the enteropia Partner and Referral Program. Refer businesses needing software development, cloud, or cybersecurity solutions and earn 15-day payouts of 10% commission on signed contracts.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
