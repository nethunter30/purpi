import React from "react";
import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs & Engineering Articles",
  description:
    "Deep engineering explorations, architectural checklists, cloud modernizations, and custom technology briefs built by enteropia systems architects and engineers.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  await dbConnect();
  
  // Fetch active blog posts
  const posts = await BlogPost.find({ isActive: true }).populate("category").sort({ createdAt: -1 });

  // Map to plain objects suitable for client components
  const plainPosts = posts.map((post) => {
    const obj = post.toObject ? post.toObject() : post;
    return {
      id: obj.id || "",
      title: obj.title || "",
      excerpt: obj.excerpt || "",
      category: typeof obj.category === "object" && obj.category ? obj.category.name : (obj.category || "Uncategorized"),
      date: obj.date || "",
      readTime: obj.readTime || "",
      author: {
        name: obj.author?.name || "",
        role: obj.author?.role || "",
        avatar: obj.author?.avatar || "",
      },
      image: obj.image || "",
      tags: obj.tags || [],
      featured: obj.featured || false,
      content: obj.content || "",
    };
  });

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
    "blogPost": plainPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "image": post.image.startsWith("http") ? post.image : `https://enteropia.com${post.image.startsWith("/") ? post.image : "/" + post.image}`,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "url": `https://enteropia.com/blog/${post.id}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://enteropia.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://enteropia.com/blog"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="schema-blog-list"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        id="schema-blog-list-breadcrumb"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogClient blogPosts={plainPosts} />
    </>
  );
}
