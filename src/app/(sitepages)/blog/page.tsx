"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  X,
  ChevronRight,
  Sparkles,
  Terminal,
  Bookmark,
  Share2,
  ThumbsUp,
  ArrowLeft,
  User
} from "lucide-react";

// Structure for a Blog Post
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode; // Rich content layout
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  tags: string[];
  featured?: boolean;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = "hidden";
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = "";
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      (window as any).lenis?.start();
    };
  }, [activeArticle]);

  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [hasLiked, setHasLiked] = useState<{ [id: string]: boolean }>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked[id]) {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
      setHasLiked(prev => ({ ...prev, [id]: false }));
    } else {
      setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setHasLiked(prev => ({ ...prev, [id]: true }));
    }
  };

  // Extensive high-fidelity mock dataset with complete article renderings
  const blogPosts: BlogPost[] = useMemo(() => [
    {
      id: "serverless-nextjs15",
      title: "The Future of Serverless Architectures in Next.js 15",
      excerpt: "Explore how Next.js 15 partial pre-rendering (PPR) and edge runtimes are transforming the latency profiles of modern web applications.",
      category: "Tech Insights",
      date: "May 18, 2026",
      readTime: "6 min read",
      author: {
        name: "Vikram Dev",
        role: "Principal Systems Architect",
        avatar: "/illustrations/newsletter-person.png"
      },
      image: "/illustrations/digital-media.png",
      tags: ["Next.js", "Serverless", "Web Dev", "Edge Computing"],
      featured: true,
      content: (
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-light">
          <p>
            The boundary between static and dynamic web delivery is dissolving. With the stable release of <strong>Next.js 15</strong>, a new paradigm named <em>Partial Pre-rendering (PPR)</em> has entered the mainstream, fundamentally shifting how serverless sites deliver content to global users.
          </p>
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/20 text-[#c455e3] italic font-normal">
            "PPR allows you to render a static outer layout shell immediately, while deferring dynamic elements like shopping carts or user profiles to instant, streaming serverless workloads."
          </div>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">How PPR Optimizes Edge Node Distribution</h3>
          <p>
            Traditionally, developers had to choose between static site generation (which delivers instant loads but stale data) and server-side rendering (which fetches fresh data but suffers from initial connection TTFB latencies). By compiling components down to standard suspense zones, Next.js 15 pushes the static assets to edge CDNs while executing fast node hooks on lightweight, close-to-user lambdas.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Writing Clean Serverless Endpoints</h3>
          <p>
            To leverage these architectural gains, keeping endpoints clean and optimized is paramount. Consider this clean layout handler executing safe parameters:
          </p>
          <div className="rounded-xl border border-purple-950/80 bg-black/80 p-4 font-mono text-xs overflow-x-auto text-purple-300">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 border-b border-purple-950/40 pb-2">
              <span>GET /api/user/profile.ts</span>
              <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> TypeScript</span>
            </div>
            <code>
{`import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge"; // Run on fast global edge runtimes

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");
  if (!userId) {
    return NextResponse.json({ error: "Invalid user scope" }, { status: 400 });
  }

  // Stream data immediately from distributed vector/document store
  const profile = await fetch(\`https://api.db.io/users/\${userId}\`, {
    next: { revalidate: 60 } // Smart caching revalidation interval
  }).then(r => r.json());

  return NextResponse.json({ success: true, profile });
}`}
            </code>
          </div>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Architectural Takeaways</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Reduced TTFB:</strong> Static shells resolve in &lt; 50ms worldwide.</li>
            <li><strong>Auto-Scaling Cloud Lambdas:</strong> Cost footprint is calculated per millisecond, eliminating idle server expenses.</li>
            <li><strong>Resilient Clean-Code Baselines:</strong> Keeping route modules modular lets you toggle between Edge runtimes and Node containers smoothly.</li>
          </ul>
        </div>
      )
    },
    {
      id: "zero-trust-networks",
      title: "Mastering Custom Zero-Trust Network Topologies",
      excerpt: "A comprehensive guide to building modern, intrusion-resistant infrastructure overlays using secure WireGuard tunnels and zero-trust gateways.",
      category: "Cloud & Security",
      date: "May 12, 2026",
      readTime: "8 min read",
      author: {
        name: "Sarah Jenkins",
        role: "Lead DevSecOps",
        avatar: "/illustrations/newsletter-person.png"
      },
      image: "/illustrations/networking-security.png",
      tags: ["Cybersecurity", "Zero-Trust", "DevOps", "WireGuard"],
      content: (
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-light">
          <p>
            The traditional network perimeter is dead. With team members distributed worldwide and infrastructure spanning multi-region cloud vendors, the "castle-and-moat" security methodology is no longer adequate. Proactive enterprises must transition to <strong>Zero-Trust Network Access (ZTNA)</strong>.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">The Three Pillars of Zero-Trust Topologies</h3>
          <p>
            Zero-Trust is guided by three simple rules: explicitly verify identity at every step, grant least-privileged access scopes, and assume that breaches have already occurred.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl bg-[#0c0414] border border-purple-900/10">
              <h4 className="font-bold text-white text-sm mb-1">1. Explicit Verification</h4>
              <p className="text-xs text-gray-400">Always authenticate and authorize based on all available data points (IP, device state, certificate keys).</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0414] border border-purple-900/10">
              <h4 className="font-bold text-white text-sm mb-1">2. Least Privilege</h4>
              <p className="text-xs text-gray-400">Limit user access with Just-in-Time (JIT) and Just-Enough-Access (JEA) permissions.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0414] border border-purple-900/10">
              <h4 className="font-bold text-white text-sm mb-1">3. Assume Breach</h4>
              <p className="text-xs text-gray-400">Minimize blast radius by segmenting networks, encrypting all sessions, and logging everything.</p>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Building Tunnels via WireGuard</h3>
          <p>
            WireGuard provides highly performant, encrypted tunnels that surpass legacy IPsec and OpenVPN protocols in throughput and connection speed. By establishing peer-to-peer tunnels among microservice containers, you prevent side-channel inspection completely.
          </p>
          <div className="rounded-xl border border-purple-950/80 bg-black/80 p-4 font-mono text-xs overflow-x-auto text-purple-300">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 border-b border-purple-950/40 pb-2">
              <span>wg0.conf (WireGuard Interface config)</span>
              <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Linux Config</span>
            </div>
            <code>
{`[Interface]
PrivateKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
# Enterprise Gateway Node A
PublicKey = yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy=
AllowedIPs = 10.0.0.2/32
Endpoint = 192.168.1.100:51820`}
            </code>
          </div>
          <p>
            By combining these static configurations with identity gateways, access is dynamically granted only when user credentials pass verification rules, completely isolating databases from direct public access.
          </p>
        </div>
      )
    },
    {
      id: "ai-context-pipelines",
      title: "Context-Retaining AI Agents with Semantic Query Caches",
      excerpt: "How embedding Vector Databases, semantic query caches, and custom agentic loop pipelines yields sub-second natural language response times.",
      category: "AI & Automation",
      date: "April 29, 2026",
      readTime: "7 min read",
      author: {
        name: "Dr. Aris Thorne",
        role: "Director of AI",
        avatar: "/illustrations/newsletter-person.png"
      },
      image: "/illustrations/software-solutions.png",
      tags: ["AI", "Vector DB", "LLM Pipelines", "Automation"],
      content: (
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-light">
          <p>
            Deploying Generative AI applications into production environments presents two main hurdles: <strong>latency</strong> and <strong>context drift</strong>. Users expect responses in under a second, yet routing complex prompts through Large Language Models often takes 3–5 seconds. 
          </p>
          <p>
            At enteropia, we solve this with <strong>Semantic Query Caching</strong>.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">What is Semantic Caching?</h3>
          <p>
            Unlike traditional Redis key-value stores that require string matches, semantic caching embeds incoming user queries into numerical vectors. We then search a fast localized cache using cosine similarity thresholds (e.g. &gt; 0.96). If a similar query has already been resolved, the cache returns the stored response instantly.
          </p>
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/20 text-[#c455e3] font-normal text-xs md:text-sm">
            <strong>Impact:</strong> Over 45% of redundant support and billing queries bypass LLM inference completely, delivering answers in <em>&lt; 35ms</em> and reducing cloud token costs by 40%.
          </div>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Example Agent Pipeline Execution</h3>
          <p>
            When a query misses the cache, it flows through a structured retrieval-augmented generation (RAG) loop to capture system domain context:
          </p>
          <ol className="list-decimal pl-5 space-y-3">
            <li><strong>Vector Embeddings Generation:</strong> Convert query to 1536-dimensional array.</li>
            <li><strong>Vector Search:</strong> Query PGVector or Pinecone index to pull top 3 matching documentation chunks.</li>
            <li><strong>Prompt Construction:</strong> Inject database metadata into the system prompt.</li>
            <li><strong>LLM Generation:</strong> Route to high-throughput endpoints with strict temperature controls (e.g. 0.1 for high factual accuracy).</li>
            <li><strong>Cache Update:</strong> Write the query vector and final response to the semantic cache store.</li>
          </ol>
        </div>
      )
    },
    {
      id: "psychology-of-animations",
      title: "The Psychology of Premium UI/UX: Why Micro-Animations Matter",
      excerpt: "A deep dive into how fluid transitions, glassmorphic UI elements, and tailored HSL palettes create memorable brand engagement.",
      category: "Digital Trends",
      date: "April 15, 2026",
      readTime: "5 min read",
      author: {
        name: "Maya Lin",
        role: "Lead Experience Designer",
        avatar: "/illustrations/newsletter-person.png"
      },
      image: "/illustrations/app-solutions.png",
      tags: ["UI/UX", "Design", "Psychology", "Animations"],
      content: (
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-light">
          <p>
            Why does clicking a button in some web applications feel satisfying, while on other platforms it feels mechanical? The differentiator is emotional feedback. Implementing <strong>micro-interactions and responsive animations</strong> bridges the gap between digital interfaces and tactile reality.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Designing for Spatial Continuity</h3>
          <p>
            When an interactive card expands on hover, or a navigation drawer glides into view, it provides spatial context to the human eye. This signals to the user's brain where they came from and where they are going, lowering cognitive load significantly.
          </p>
          <div className="p-4 rounded-xl bg-[#0c0414] border border-purple-900/10 italic text-center text-xs md:text-sm text-gray-400">
            "Animation should never be decorative; it must be functional. If an animation does not communicate state, timing, or direction, remove it."
          </div>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">Our Premium CSS Design System Guidelines</h3>
          <p>
            Creating premium aesthetics means adhering to strict visual rules:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Smooth Easing:</strong> Use cubic-bezier profiles (e.g. <code>cubic-bezier(0.16, 1, 0.3, 1)</code> for ultra-smooth easing).</li>
            <li><strong>Subtle Gradients:</strong> Ditch raw primaries. Leverage dark, curated HSL ranges such as fuchsias, purples, and deep charcoal violets to create high contrast with low eye strain.</li>
            <li><strong>Glassmorphic Sheets:</strong> Combine low-opacity backdrops with solid borders to establish hierarchy:
              <code className="block bg-black/60 p-2 rounded-lg text-xs mt-1 text-purple-400 font-mono">
                background: rgba(12, 4, 20, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(168, 85, 247, 0.1);
              </code>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "scaling-postgresql-100m",
      title: "Scaling PostgreSQL database performance to 100M+ Records",
      excerpt: "Practical strategies for indexing optimization, vertical vs. horizontal read replicas, and connection pooling configs.",
      category: "Cloud & DevOps",
      date: "March 05, 2026",
      readTime: "11 min read",
      author: {
        name: "Rohan Gupta",
        role: "Database Systems Lead",
        avatar: "/illustrations/newsletter-person.png"
      },
      image: "/illustrations/cloud-infrastructure.png",
      tags: ["Databases", "PostgreSQL", "Scaling", "Big Data"],
      content: (
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-light">
          <p>
            Many projects start experiencing slower query execution times once tables cross 10 million rows. At 100 million rows, database queries can stall entirely if indexes are not optimized.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">1. Table Partitioning: The Ultimate Scale Lever</h3>
          <p>
            Instead of searching one monolithic 100-million-row index, table partitioning breaks data into smaller, manageable chunks based on ranges or keys (e.g. partitioning logs by year or month). The database engine can then prune partitions during compilation, scanning only the relevant subset of records.
          </p>
          <h3 className="text-lg font-bold text-white mt-8 mb-2">2. Optimizing Connection Pools via PgBouncer</h3>
          <p>
            Every active client connection to PostgreSQL spins up a separate process, which consumes substantial RAM. Adding a proxy layer like PgBouncer acts as a connection pooler, allowing thousands of active app requests to share a small, pre-allocated pool of active database connections safely.
          </p>
          <div className="rounded-xl border border-purple-950/80 bg-black/80 p-4 font-mono text-xs overflow-x-auto text-purple-300">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2 border-b border-purple-950/40 pb-2">
              <span>pgbouncer.ini</span>
              <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Config</span>
            </div>
            <code>
{`[databases]
enterprise_db = host=127.0.0.1 port=5432 dbname=enterprise_db

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20`}
            </code>
          </div>
        </div>
      )
    }
  ], []);

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

        {/* Flagship Featured Article Banner (Only visible when no search query or on "All" filter) */}
        {!searchQuery && selectedCategory === "All" && featuredArticle && (
          <div
            onClick={() => setActiveArticle(featuredArticle)}
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

              {/* Tags and bookmark toolbar */}
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
                    className="p-2 rounded-xl bg-purple-950/20 border border-purple-900/10 text-gray-400 hover:text-white transition-colors"
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
          </div>
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
              <div
                key={post.id}
                onClick={() => setActiveArticle(post)}
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
                        className="p-1.5 rounded-lg bg-purple-950/10 border border-purple-900/10 text-gray-400 hover:text-white transition-colors"
                        title="Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked.includes(post.id) ? "fill-purple-500 text-purple-500" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className="p-1.5 rounded-lg bg-purple-950/10 border border-purple-900/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                        title="Like"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked[post.id] ? "fill-purple-500 text-purple-500" : ""}`} />
                        {likes[post.id] ? <span className="text-[9px] font-bold font-mono text-purple-300">{likes[post.id]}</span> : null}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── IMMERSIVE ARTICLE READING MODAL ── */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          {/* Scrollable Container Box */}
          <div
            data-lenis-prevent
            className="bg-[#0c0414] border border-purple-500/20 max-w-4xl w-full max-h-[88vh] rounded-[32px] overflow-y-auto p-6 md:p-10 shadow-2xl relative scrollbar-thin scrollbar-track-[#12061f] scrollbar-thumb-purple-900/40"
          >
            {/* Top Close Header */}
            <div className="sticky top-0 right-0 flex justify-end mb-4 z-30">
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2.5 rounded-full border border-purple-500/20 bg-purple-950/80 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-900 transition-all cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Back to Blog Button for Mobile Navigation inside Modal */}
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
            </button>

            {/* Hero details inside Modal */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 font-light">
                <span className="px-3 py-1 rounded-full bg-purple-900/20 text-[#c455e3] border border-purple-800/30 text-xs font-semibold uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-purple-500/70" /> {activeArticle.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-purple-500/70" /> {activeArticle.readTime}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {activeArticle.title}
              </h1>

              {/* Author banner */}
              <div className="flex items-center gap-4 border-b border-purple-950/40 pb-6">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-500/20 bg-purple-950 flex items-center justify-center">
                  {activeArticle.author.avatar ? (
                    <Image src={activeArticle.author.avatar} alt={activeArticle.author.name} fill className="object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{activeArticle.author.name}</p>
                  <p className="text-xs text-gray-500 font-light mt-1">{activeArticle.author.role}</p>
                </div>
              </div>

              {/* Article Hero Banner inside Modal */}
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-purple-950/10 shadow-lg border border-purple-900/10">
                <Image
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Rendered Full Article Body */}
              <div className="pt-4 border-t border-purple-950/20">
                {activeArticle.content}
              </div>

              {/* Footer Actions */}
              <div className="border-t border-purple-950/40 pt-8 mt-10 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {activeArticle.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 bg-purple-950/30 text-purple-300 rounded-lg border border-purple-900/20">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      handleLike(activeArticle.id, e);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/35 border border-purple-900/20 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
                  >
                    <ThumbsUp className={`w-4 h-4 ${hasLiked[activeArticle.id] ? "fill-purple-500 text-purple-500" : ""}`} />
                    {hasLiked[activeArticle.id] ? "Liked!" : "Helpful?"}
                    {likes[activeArticle.id] ? <span className="font-mono text-purple-300">({likes[activeArticle.id]})</span> : null}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + `/blog?post=${activeArticle.id}`);
                      alert("Article connection link copied to clipboard!");
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
                  >
                    <Share2 className="w-4 h-4 text-purple-400" />
                    Share article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
