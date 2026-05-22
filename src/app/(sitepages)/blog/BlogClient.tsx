"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  X,
  Bookmark,
  ThumbsUp,
  User
} from "lucide-react";
import { BlogPost } from "@/lib/blogData";

interface BlogClientProps {
  blogPosts: BlogPost[];
}

export default function BlogClient({ blogPosts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [hasLiked, setHasLiked] = useState<{ [id: string]: boolean }>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasLiked[id]) {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      setHasLiked(prev => ({ ...prev, [id]: false }));
    } else {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setHasLiked(prev => ({ ...prev, [id]: true }));
    }
  };

  // Extraction of unique categories
  const categories = useMemo(() => {
    const set = new Set(blogPosts.map(post => post.category));
    return ["All", ...Array.from(set)];
  }, [blogPosts]);

  // Real-time local search and category filtering
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  // Featured Article extraction (takes the first featured one or defaults to first in index)
  const featuredArticle = useMemo(() => {
    return blogPosts.find(post => post.featured) || blogPosts[0];
  }, [blogPosts]);

  // Remainder articles for grid layout
  const gridArticles = useMemo(() => {
    return filteredPosts.filter(post => post.id !== featuredArticle.id || selectedCategory !== "All");
  }, [filteredPosts, featuredArticle, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-black text-white py-24 z-10 overflow-x-hidden flex flex-col items-center">
      {/* Visual Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0a38_1px,transparent_1px),linear-gradient(to_bottom,#1f0a38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[5%] right-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/4 w-[500px] h-[500px] bg-fuchsia-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] w-full px-6 relative z-20 mt-16 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-[#c455e3]">
              Blogs & Articles
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              Deep engineering explorations, architectural checklists, cloud modernizations, and custom technology briefs built by enteropia engineers.
            </p>
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search topics, tags, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0414]/90 border border-purple-950/60 focus:border-purple-500/50 rounded-2xl py-3 px-11 text-xs text-white placeholder-gray-500 transition-all outline-none focus:shadow-[0_0_15px_rgba(196,85,227,0.15)] font-light"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Navigation Bar */}
        <div className="flex overflow-x-auto scrollbar-none pb-4 mb-12 border-b border-purple-950/20 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:text-white hover:bg-purple-950/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flagship Featured Article Banner */}
        {!searchQuery && selectedCategory === "All" && featuredArticle && (
          <Link
            href={`/blog/${featuredArticle.id}`}
            className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0c0414]/80 border border-purple-900/10 hover:border-purple-500/20 rounded-[32px] p-6 md:p-8 mb-16 transition-all duration-300 shadow-xl hover:shadow-purple-950/50 cursor-pointer overflow-hidden"
          >
            {/* Smooth Top Gradient Strip */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Banner Image */}
            <div className="lg:col-span-6 relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-purple-950/15">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest bg-[#a855f7] text-white px-3 py-1 rounded-full border border-purple-400/20">
                Featured post
              </span>
            </div>

            {/* Post Metadata details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-light">
                <span className="text-purple-400 font-semibold uppercase tracking-wider">{featuredArticle.category}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {featuredArticle.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-purple-200 transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {featuredArticle.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {featuredArticle.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 bg-purple-900/10 text-purple-300 rounded-lg border border-purple-800/15">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author & Button Row */}
              <div className="flex items-center justify-between border-t border-purple-950/40 pt-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-purple-800/30 bg-purple-950/30 flex items-center justify-center">
                    {featuredArticle.author.avatar ? (
                      <Image src={featuredArticle.author.avatar} alt={featuredArticle.author.name} fill className="object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{featuredArticle.author.name}</p>
                    <p className="text-[10px] text-gray-500 font-light mt-0.5">{featuredArticle.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                    className="p-2 rounded-xl bg-purple-950/20 border border-purple-900/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked.includes(featuredArticle.id) ? "fill-purple-500 text-purple-500" : ""}`} />
                  </button>
                  <span className="text-xs font-bold text-[#c455e3] group-hover:text-purple-400 transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                    Read article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-purple-900/10 bg-[#12061f]/10 rounded-[32px] p-8">
            <BookOpen className="w-12 h-12 mb-4 text-purple-500/35" />
            <h3 className="text-white text-lg font-bold">No articles found</h3>
            <p className="text-sm text-gray-400 max-w-sm font-light mt-1">We couldn't find any post matching your current search parameters. Try adjusting your filter tags.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {gridArticles.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group relative flex flex-col bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-purple-950/50 cursor-pointer overflow-hidden"
              >
                {/* Visual Top Glow */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Thumbnail */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-purple-950/15 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 350px"
                    className="object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[9px] uppercase font-bold tracking-wider bg-black/70 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800/30">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-light">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-200 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-light">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Foot toolbar */}
                  <div className="border-t border-purple-950/40 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6.5 h-6.5 rounded-full overflow-hidden border border-purple-800/20 bg-purple-950/30 flex items-center justify-center">
                        {post.author.avatar ? (
                          <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                        ) : (
                          <User className="w-3 h-3 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white leading-none">{post.author.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => toggleBookmark(post.id, e)}
                        className="p-1.5 rounded-lg bg-purple-950/10 border border-purple-900/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked.includes(post.id) ? "fill-purple-500 text-purple-500" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className="p-1.5 rounded-lg bg-purple-950/10 border border-purple-900/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        title="Like"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked[post.id] ? "fill-purple-500 text-purple-500" : ""}`} />
                        {likes[post.id] ? <span className="text-[9px] font-bold font-mono text-purple-300">{likes[post.id]}</span> : null}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
