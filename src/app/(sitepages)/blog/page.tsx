import React from "react";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { blogPosts } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "Blogs & Engineering Articles",
  description:
    "Deep engineering explorations, architectural checklists, cloud modernizations, and custom technology briefs built by enteropia systems architects and engineers.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  // Inject structured JSON-LD schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "enteropia Engineering Blog",
    "url": "https://enteropia.com/blog",
    "description": "Deep engineering explorations, architectural checklists, cloud modernizations, and custom technology briefs built by enteropia engineers.",
    "publisher": {
      "@type": "Organization",
      "name": "enteropia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://enteropia.com/logo.png"
      }
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "image": `https://enteropia.com${post.image}`,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "url": `https://enteropia.com/blog/${post.id}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogClient blogPosts={blogPosts} />
    </>
  );
}
