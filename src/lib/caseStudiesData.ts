export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  subCategory: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  impactLabel: string;
  image: string;
  techStack: string[];
  results: {
    metric: string;
    before: string;
    after: string;
  }[];
  milestones: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "pulsefit-global",
    title: "PulseFit Global Cross-Platform Ecosystem",
    client: "PulseFit Global Inc.",
    category: "Software Engineering",
    subCategory: "App Solutions",
    description: "Built a high-performance cross-platform health application with real-time Bluetooth sensor connections and local database encryption on iOS and Android.",
    challenge: "PulseFit's legacy app suffered from severe frame drops during sensor syncing, data disconnects on older iOS/Android devices, and high local database query latency which caused poor App Store reviews.",
    solution: "We re-architected the app core using a custom native bridges library. By establishing light, optimized background sync queues in C++ compiled to Swift/Kotlin and setting up encrypted SQLCipher storage, we streamlined Bluetooth polling intervals.",
    impact: "4.8 App Rating",
    impactLabel: "App Store Review Average",
    image: "/illustrations/app-solutions.png",
    techStack: ["React Native SDK", "Flutter Cross-Platform", "Swift Native", "Kotlin Core", "Firebase Backend", "Expo CLI"],
    results: [
      { metric: "App Frame Rate", before: "34 FPS (Laggy)", after: "60 FPS (Butter Smooth)" },
      { metric: "Sensor Sync Time", before: "18.2 Seconds", after: "1.4 Seconds" },
      { metric: "Local Query Latency", before: "450ms Average", after: "12ms Average" }
    ],
    milestones: [
      "Audit existing Bluetooth bridge drivers and profiling frames.",
      "Implement background C++ event-loop thread for low-level packet processing.",
      "Design modular SQLCipher local databases with composite indexes.",
      "Execute cross-device beta stress runs via TestFlight and Google Console."
    ]
  },
  {
    id: "apex-financial",
    title: "Apex Financial SOC2 Compliant Overlays",
    client: "Apex Financial Group",
    category: "Cloud & Security",
    subCategory: "Networking & Security",
    description: "Re-engineered network routes with zero-trust gateways, custom firewalls, and active intrusion prevention scripts safeguarding client monetary transactions.",
    challenge: "Apex needed to transition from traditional virtual private networks (VPNs) to SOC2 compliant microsegmentation models to secure critical financial endpoints without hurting global transaction speeds.",
    solution: "We deployed highly secure peer-to-peer WireGuard tunnels among transaction nodes. By wrapping ingress routers with Cloudflare WAF protections and locking down node permission profiles using AWS IAM strict constraints, security risks were minimized.",
    impact: "SOC2 Compliance",
    impactLabel: "Verified Ready & Audited",
    image: "/illustrations/networking-security.png",
    techStack: ["Cisco Networking", "Fortinet Firewalls", "WireGuard Encryption", "Cloudflare WAF Shield", "AWS IAM Security", "Linux System Hardening"],
    results: [
      { metric: "Zero-Trust Latency Overhead", before: "78ms VPN Tunneling", after: "< 1.5ms WireGuard Overlay" },
      { metric: "Unauthorized Access Attempts", before: "32 logged monthly", after: "0 successful attempts logged" },
      { metric: "Compliance Readiness Audit", before: "Failed (Insecure endpoints)", after: "100% Audit Passed" }
    ],
    milestones: [
      "Audit server network paths and run intrusion assessments.",
      "Design multi-peer tunnel topology with automated key rotations.",
      "Integrate Cloudflare WAF endpoint filters for layer 7 traffic protection.",
      "Pass independent SOC2 external audits with zero compliance deficiencies."
    ]
  },
  {
    id: "horizon-ecommerce",
    title: "Horizon Jamstack Catalog Modernization",
    client: "Horizon E-commerce Hub",
    category: "Software Engineering",
    subCategory: "Digital Solutions",
    description: "We completely redesigned Horizon's digital catalog, shifting to a Next.js static generation setup with integrated headless CMS, boosting overall site speed and search rankings globally.",
    challenge: "Horizon's server-rendered e-commerce website was slow during peak marketing campaigns, with average server response times exceeding 3 seconds, leading to a high 35% cart abandonment rate.",
    solution: "We converted the database monolith into a high-speed headless CMS model. Utilizing Next.js App Router, Partial Pre-rendering, and Edge caching on Vercel CDNs, content loading resolved in milliseconds.",
    impact: "+180% Conversions",
    impactLabel: "Cart Conversions Increase",
    image: "/illustrations/digital-media.png",
    techStack: ["Next.js", "Figma Design", "TailwindCSS", "SEO Audits", "WordPress Headless", "Vercel Analytics"],
    results: [
      { metric: "Time to First Byte (TTFB)", before: "1.4 Seconds average", after: "35ms Edge Node Cached" },
      { metric: "Bounce Rate", before: "35% (Abandoned)", after: "11% (Highly Engaged)" },
      { metric: "Lighthouse Performance Score", before: "42/100 (Unoptimized)", after: "98/100 (Optimized)" }
    ],
    milestones: [
      "Structure static layout modules utilizing Tailwind utility rules.",
      "Migrate product relational tables to content hooks in Headless API systems.",
      "Configure CDN caching policies with stale-while-revalidate headers.",
      "Establish web vitals testing pipelines to safeguard performance metrics."
    ]
  },
  {
    id: "vanguard-logistics",
    title: "Vanguard Real-time Fleet Optimization",
    client: "Vanguard Logistics Systems",
    category: "Software Engineering",
    subCategory: "Software Solutions",
    description: "Designed and implemented a custom warehouse routing engine that integrated legacy inventory schedules with live APIs, eliminating manual sheets entirely.",
    challenge: "Vanguard handled over 10,000 active dispatch routes manually via legacy Excel models. This led to fuel waste, inaccurate delivery times, and dispatcher fatigue during seasonal demand spikes.",
    solution: "We engineered a microservices routing engine. Written in high-throughput Go Lang and Node.js backend services, the algorithm evaluates road traffic, driver hours, and fuel efficiency in real-time.",
    impact: "90% Efficiency",
    impactLabel: "Operational Dispatch Speedup",
    image: "/illustrations/software-solutions.png",
    techStack: ["Node.js (API)", "Go Lang Microservices", "TypeScript Core", "PostgreSQL DBMS", "MongoDB Atlas", "Docker Scheduling"],
    results: [
      { metric: "Route Dispatch Processing Time", before: "4 Hours (Manual mapping)", after: "< 3 Seconds (Automated)" },
      { metric: "Fuel Fleet Overhead Costs", before: "$124K monthly average", after: "$89K monthly average" },
      { metric: "Dispatcher Operator Capacity", before: "15 routes per agent", after: "120 routes per agent" }
    ],
    milestones: [
      "Formulate Go Lang scheduling queues and microservices schemas.",
      "Integrate geospatial mapping and real-time traffic feed APIs.",
      "Construct responsive dispatch dashboards for field managers.",
      "Deploy Docker container configurations to production host stacks."
    ]
  },
  {
    id: "mednet-health",
    title: "MedNet Cloud Monolith Containerization",
    client: "MedNet Health Solutions",
    category: "Cloud & Security",
    subCategory: "Cloud Infrastructure",
    description: "Migrated a legacy monolith into serverless container systems managed on Kubernetes, reducing manual oversight and cloud hosting bills significantly.",
    challenge: "MedNet's medical applications ran on outdated, single-host virtual machines. Scale spikes crashed the database, and server billing was massive because resources could not scale down automatically.",
    solution: "We split the monolith codebase into isolated Docker microservices. We then orchestrated them using scalable Kubernetes containers and built automated infrastructure deployment scripts using Terraform.",
    impact: "-55% Cloud Costs",
    impactLabel: "Infrastructure Cost Savings",
    image: "/illustrations/networking-security.png",
    techStack: ["Amazon Web Services (AWS)", "Google Cloud (GCP)", "Kubernetes Containers", "Terraform IaC Plans", "GitHub Actions CI/CD", "Prometheus Monitoring"],
    results: [
      { metric: "Monthly Infrastructure Hosting Bills", before: "$14,500 average", after: "$6,500 average" },
      { metric: "System Scale Up Timing", before: "25 Minutes (Manual VM boot)", after: "12 Seconds (Kubernetes pod scaling)" },
      { metric: "Core Service Uptime Guarantee", before: "98.4% (Frequent downtime)", after: "99.99% High Availability" }
    ],
    milestones: [
      "Draft Terraform configuration scripts for multi-region AWS stacks.",
      "Isolate monolith segments into structured, clean Docker images.",
      "Configure Kubernetes pod scaling rules and health check checks.",
      "Set up GitHub Actions automatic workflows to deploy master edits cleanly."
    ]
  },
  {
    id: "intellect-analytics",
    title: "Intellect AI Stock Prediction Engine",
    client: "Intellect Analytics Ltd.",
    category: "AI & Automation",
    subCategory: "Machine Learning Solutions",
    description: "Constructed intelligent regression models and recommendation systems parsing large transaction datasets to suggest stock allocation automatically.",
    challenge: "Intellect wanted to automate high-volume retail warehouse allocations, but standard time-series projections yielded error rates above 15%, causing stock-outs and inventory bloat.",
    solution: "We built a customized prediction engine in Python and PyTorch. Incorporating dynamic variables like local weather models and regional search trends, the engine outputs exact procurement numbers daily.",
    impact: "99% Accuracy",
    impactLabel: "Stock Prediction Precision",
    image: "/illustrations/software-solutions.png",
    techStack: ["Python Systems", "PyTorch Framework", "TensorFlow AI", "OpenAI Engine Integration", "FastAPI Pipelines", "Hugging Face Models"],
    results: [
      { metric: "Inventory Prediction Error", before: "18.4% average error", after: "0.8% average error" },
      { metric: "Product Warehousing Duration", before: "42 Days average storage", after: "18 Days average storage" },
      { metric: "Stockout Scenarios Logged", before: "45 cases quarterly", after: "0 cases logged quarterly" }
    ],
    milestones: [
      "Clean, catalog, and normalize five years of historical transaction logs.",
      "Construct PyTorch multi-variable regression models.",
      "Build secure, fast FastAPI pipelines to serve inference calculations.",
      "Establish automated training pipelines based on incoming sales queues."
    ]
  }
];
