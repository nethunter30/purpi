import React from "react";
import {
  Laptop,
  Cloud,
  ShieldCheck,
  Clock,
  TrendingUp,
  CircleDollarSign,
  Sparkles
} from "lucide-react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

export default function KeyBenefits() {
  const benefits = [
    {
      icon: <Laptop className="w-5 h-5 text-purple-400" />,
      title: "Reliable IT Solutions",
      description:
        "Engineered for maximum stability, our enterprise-grade IT systems guarantee zero-interruption operational continuity for your business."
    },
    {
      icon: <Cloud className="w-5 h-5 text-cyan-400" />,
      title: "Modern Cloud Infrastructure",
      description:
        "Leverage serverless architectures, auto-scaling container configurations, and multi-region database setups built to handle massive scale."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      title: "Professional Cybersecurity Practices",
      description:
        "Implement custom zero-trust networks, active threat detection, and robust data encryption models safeguarding critical transactional tunnels."
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      title: "Fast Response & Support",
      description:
        "Enjoy absolute peace of mind with our 24/7 system health monitoring and SLA-backed rapid support to resolve server bottlenecks instantly."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-fuchsia-400" />,
      title: "Scalable Business Solutions",
      description:
        "Build modular system blueprints engineered to expand seamlessly alongside your organization's growing traffic and user base."
    },
    {
      icon: <CircleDollarSign className="w-5 h-5 text-yellow-400" />,
      title: "Affordable Service Packages",
      description:
        "Get tailored development budgets and optimized FinOps parameters designed to maximize your ROI without unnecessary hosting waste."
    }
  ];

  return (
    <section className="relative w-full py-10 flex flex-col items-center justify-center z-10 bg-purple-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <FadeUp className="flex flex-col items-center justify-center w-full relative z-20">
        {/* Pill Badge & Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-6 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-6 py-1 rounded-full border border-purple-500/20 bg-purple-950/20 text-[#c455e3] text-[10px] font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <h2 className="text-xl md:text-xl font-semibold text-white uppercase tracking-tight">
              Why Choose enteropia
            </h2>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-lg font-light">
            We combine cutting-edge technology stacks with industry-tested architecture practices to deliver reliable, highly performant products.
          </p>
        </div>

        {/* Cards Grid - 3 Columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1200px] w-full px-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative flex flex-col p-5 rounded-2xl bg-[#0c0414]/90 border border-purple-900/10 hover:border-purple-500/20 shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle inner highlight */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a356db] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Benefit Icon Wrapper */}
              <div className="mb-4 w-10 h-10 rounded-xl bg-purple-950/25 border border-purple-900/20 flex items-center justify-center shadow-md group-hover:border-purple-500/30 group-hover:bg-purple-950/40 transition-colors duration-300">
                {benefit.icon}
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <h3 className="text-white text-sm font-bold tracking-tight group-hover:text-purple-200 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
