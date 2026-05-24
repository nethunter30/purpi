import React from "react";
import type { Metadata } from "next";
import IndustriesClient from "./IndustriesClient";

export const metadata: Metadata = {
    title: "Industries | enteropia",
    description: "Learn about the industries we serve and how we tailor software, cloud infrastructure, and security solutions for specific business verticals.",
    alternates: {
        canonical: "https://enteropia.com/industries",
    },
};

export default function IndustriesPage() {
    return <IndustriesClient />;
}