import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogActions from "./BlogActions";

export const revalidate = 60;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  await dbConnect();
  const posts = await BlogPost.find({ isActive: true });
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const post = await BlogPost.findOne({ id: slug });

  if (!post) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://enteropia.com/blog/${post.id}`,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  await dbConnect();
  const post = await BlogPost.findOne({ id: slug }).populate("category");

  if (!post) {
    notFound();
  }

  // Inject BlogPosting schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "image": `https://enteropia.com${post.image}`,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "enteropia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://enteropia.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://enteropia.com/blog/${post.id}`
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden flex flex-col items-center">
      {/* Script tag for search engine indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[5%] right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/4 w-[500px] h-[500px] bg-fuchsia-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full px-6 relative z-20 mt-16 flex-1 flex flex-col">
        {/* Navigation Link back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to blog listings
        </Link>

        {/* Article main container */}
        <article className="space-y-8 bg-[#0c0414]/90 border border-purple-500/10 rounded-[32px] p-6 md:p-10 shadow-2xl">
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 font-light">
              <span className="px-3 py-1 rounded-full bg-purple-900/20 text-[#c455e3] border border-purple-800/30 text-xs font-semibold uppercase tracking-wider">
                {typeof post.category === "object" && post.category ? post.category.name : (post.category || "Uncategorized")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-purple-500/70" /> {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500/70" /> {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Author profile banner */}
            <div className="flex items-center gap-4 border-b border-purple-950/40 pb-6">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-500/20 bg-purple-950 flex items-center justify-center">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500 font-light mt-1">
                  {post.author.role}
                </p>
              </div>
            </div>

            {/* Core Image Banner */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-purple-950/10 shadow-lg border border-purple-900/10">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
                priority
              />
            </div>

            {/* Full text content */}
            <div className="pt-4 border-t border-purple-950/20 space-y-4">
              {post.content.split("\n\n").filter(Boolean).map((para: string, i: number) => (
                <p key={i} className="text-gray-300 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Footer row with tag listing & share action */}
            <div className="border-t border-purple-950/40 pt-8 mt-10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-purple-950/30 text-purple-300 rounded-lg border border-purple-900/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <BlogActions postId={post.id} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
