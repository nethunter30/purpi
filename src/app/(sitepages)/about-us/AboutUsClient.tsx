"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import OurTeam from "@/sitepages/components/home/OurTeam";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Zap,
  Shield,
  Users,
  Lightbulb,
  MessageSquare,
  Server,
  Cloud,
  RefreshCw,
} from "lucide-react";

// — Data ——————————————————————————————————————————————————————————

const coreValues = [
  {
    icon: <Zap className="w-5 h-5 text-fuchsia-400" />,
    title: "Engineering Excellence",
    description:
      "We hold our code, our systems, and our processes to the highest standards.",
  },
  {
    icon: <Shield className="w-5 h-5 text-indigo-400" />,
    title: "Reliability First",
    description:
      "Our clients can trust that what we build works — consistently, at scale, under pressure.",
  },
  {
    icon: <Users className="w-5 h-5 text-purple-400" />,
    title: "Client-Centric Thinking",
    description:
      "Every solution starts with a deep understanding of the client's real business problem.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-cyan-400" />,
    title: "Continuous Innovation",
    description: "Technology never stops evolving, and neither do we.",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
    title: "Transparency",
    description:
      "No jargon. No hidden costs. Just honest, clear communication at every step.",
  },
];

const services = [
  {
    icon: <Server className="w-6 h-6 text-fuchsia-400" />,
    title: "Software Development",
    description:
      "Custom, high-quality software tailored to your workflows and growth goals.",
  },
  {
    icon: <Cloud className="w-6 h-6 text-cyan-400" />,
    title: "IT Infrastructure",
    description:
      "Enterprise-grade server, cloud, and network systems engineered for zero-interruption operations.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
    title: "Digital Transformation",
    description:
      "End-to-end guidance helping businesses modernize operations and stay competitive.",
  },
];

// — Animation Variants ————————————————————————————————————————————

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// — Client Component ——————————————————————————————————————————————

export default function AboutUsClient() {
  return (
    <div className="relative flex flex-col w-full overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-fuchsia-700/20 rounded-sm blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-purple-700/15 rounded-sm blur-[100px] pointer-events-none" />



        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
        >
          Who We{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
            Are
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-gray-300 max-w-5xl text-base md:text-lg leading-relaxed"
        >
          enteropia is a Bengaluru-based enterprise technology company founded
          in 2026. We exist to make cutting-edge software engineering, cloud
          infrastructure, and digital transformation accessible to businesses
          that are ready to scale — without the complexity that usually comes
          with it.
        </motion.p>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────── */}
      <section className="relative w-full py-20 md:py-28 px-6 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left – decorative card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="relative rounded-sm border border-purple-900/30 bg-[#0c0414]/80 backdrop-blur-sm p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-fuchsia-900/40 border border-fuchsia-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-fuchsia-400" />
                </div>
                <span className="text-fuchsia-300 text-sm font-semibold tracking-wide uppercase">
                  Founded 2026
                </span>
              </div>

              <blockquote className="text-gray-200 text-lg md:text-xl font-serif italic leading-relaxed border-l-2 border-fuchsia-500/40 pl-6">
                &ldquo;Too many growing businesses were held back by outdated IT
                systems, fragmented software, and costly infrastructure that
                couldn&apos;t keep up with their ambitions.&rdquo;
              </blockquote>

              <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                We set out to change that — building a team of engineers,
                architects, and digital strategists who believe great technology
                should be reliable, scalable, and built to last.
              </p>

              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-700/20 rounded-sm blur-[60px] pointer-events-none" />
            </div>
          </motion.div>

          {/* Right – story text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 self-start rounded-sm border border-purple-500/20 bg-purple-950/20 text-purple-300 text-[11px] font-semibold tracking-widest uppercase">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
              Born from a simple{" "}
              <span className="text-fuchsia-400">frustration</span>
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Founded in 2026 in the heart of India&apos;s tech capital,
              enteropia was born from a simple frustration: too many growing
              businesses were held back by outdated IT systems, fragmented
              software, and costly infrastructure that couldn&apos;t keep up
              with their ambitions.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              From day one, our focus has been on sustainable, future-ready
              solutions that deliver real value — not just impressive demos. We
              build for businesses that want technology to be a growth engine,
              not a bottleneck.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── VISION & MISSION ─────────────────────────────────────── */}
      <section className="relative w-full py-20 md:py-28 px-6 overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.07),transparent_70%)]" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Vision */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="group relative rounded-sm border border-purple-900/30 bg-[#0c0414]/70 backdrop-blur-sm p-8 overflow-hidden hover:border-purple-500/30 transition-all duration-500 shadow-lg"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-800/15 rounded-sm blur-[50px] pointer-events-none" />

              <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/30">
                Our Vision
              </span>
              <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">
                To be the most trusted technology partner for enterprise
                scale-ups across the globe — enabling every ambitious business
                to build on infrastructure that grows with them.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              variants={fadeUp}
              custom={0.12}
              className="group relative rounded-sm border border-fuchsia-900/30 bg-[#0c0414]/70 backdrop-blur-sm p-8 overflow-hidden hover:border-fuchsia-500/30 transition-all duration-500 shadow-lg"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuchsia-800/15 rounded-sm blur-[50px] pointer-events-none" />

              <span className="inline-block text-fuchsia-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-fuchsia-500/20 bg-fuchsia-950/30">
                Our Mission
              </span>
              <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">
                To deliver innovative, secure, and scalable tech solutions —
                through expert software development, robust IT infrastructure,
                and end-to-end digital transformation — that empower businesses
                to operate smarter and grow faster.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────── */}
      <section className="relative w-full py-20 md:py-28 px-6 z-10 bg-purple-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-sm border border-purple-500/20 bg-purple-950/20 text-purple-300 text-[11px] font-semibold tracking-widest uppercase mb-6">
              Our Core Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              What drives everything we{" "}
              <span className="text-fuchsia-400">build</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.08}
                className="group relative flex flex-col p-6 rounded-sm bg-[#0c0414]/90 border border-purple-900/15 hover:border-purple-500/25 shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-4 w-10 h-10 rounded-sm bg-purple-950/30 border border-purple-900/20 flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-950/50 transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-white text-sm font-bold tracking-tight mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHAT WE DO ───────────────────────────────────────────── */}
      <section className="relative w-full py-20 md:py-28 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-sm border border-purple-500/20 bg-purple-950/20 text-purple-300 text-[11px] font-semibold tracking-widest uppercase mb-6">
              What We Do
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Three core{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
                specialisations
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {services.map((svc, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.1}
                className="group relative flex flex-col items-start gap-5 p-8 rounded-sm border border-purple-900/20 bg-[#0c0414]/80 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-700/10 rounded-sm blur-[40px] pointer-events-none" />
                <div className="w-12 h-12 rounded-sm bg-purple-950/40 border border-purple-900/25 flex items-center justify-center group-hover:border-purple-500/40 transition-all duration-300">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-purple-200 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── OUR TEAM SECTION ─────────────────────────────────────── */}
      <OurTeam />

      {/* ── CLOSING CTA ──────────────────────────────────────────── */}
      <section className="relative w-full py-24 md:py-36 px-6 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12),transparent_65%)]" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-fuchsia-700/15 rounded-sm blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="max-w-3xl mx-auto text-center flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-white">
            Let&apos;s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
              Lasting
            </span>
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
            Whether you&apos;re a scale-up looking for your first tech partner
            or an enterprise ready to modernize, we&apos;d love to understand
            your challenges and show you how enteropia can help.
          </p>

          <Link
            href="/#contact"
            id="about-cta-contact"
            className="group flex items-center gap-3 px-8 py-3.5 rounded-sm border border-purple-500/50 bg-[#3b1764]/50 hover:bg-[#3b1764]/80 transition-all duration-300 text-white text-base font-medium backdrop-blur-sm shadow-lg"
          >
            Get in Touch
            <div className="bg-[#a855f7] rounded-sm p-1.5 group-hover:bg-[#c084fc] transition-colors duration-300">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
