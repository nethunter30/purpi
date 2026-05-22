import React from "react";
import { Terminal } from "lucide-react";

export interface BlogPost {
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

export const blogPosts: BlogPost[] = [
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
          <pre className="whitespace-pre">
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
          </pre>
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
          <pre className="whitespace-pre">
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
          </pre>
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
          <pre className="whitespace-pre">
            <code>
{`[databases]
enterprise_db = host=127.0.0.1 port=5432 dbname=enterprise_db

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20`}
            </code>
          </pre>
        </div>
      </div>
    )
  }
];
