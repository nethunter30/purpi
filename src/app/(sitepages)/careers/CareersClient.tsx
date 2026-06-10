"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Handshake,
  FileText,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ShieldCheck,
  Cpu,
  Cloud
} from "lucide-react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

// --- FAQ Data ---
const faqs = [
  {
    question: "Who is eligible to participate in the Referral Program?",
    answer: "Anyone! Whether you are an existing client, a freelance consultant, an IT professional, or simply someone who knows a business needing high-quality technology solutions, you can submit referrals and earn commissions.",
  },
  {
    question: "How is the 10% commission calculated?",
    answer: "You receive exactly 10% of the total signed contract value for the client's initial contract. For example, if a referred business signs a software development contract worth ₹5,00,000, your commission will be ₹50,000.",
  },
  {
    question: "When and how do I get paid?",
    answer: "Commissions are paid within 15 days of when the referred client completes their first payment. Payments are sent directly to your registered UPI ID or Bank Account as specified in the referral form.",
  },
  {
    question: "Is there a limit to how many clients I can refer?",
    answer: "No, there are absolutely no referral limits or caps on your earnings. You can refer as many qualified businesses as you like, and you will earn a 10% commission on every single one that signs a contract with us.",
  },
  {
    question: "What qualifies as a 'Qualified Client'?",
    answer: "A qualified client is any registered business or startup that has active requirements for software development, IT infrastructure engineering, cloud services, or digital transformation, and proceeds to sign a project contract with enteropia.",
  },
];

export default function CareersClient() {
  // Slider states for commission estimator
  const [projectValue, setProjectValue] = useState(250000); // Default value

  // FAQ Accordion active index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    referrerUpiOrBank: "",
    clientBusinessName: "",
    clientContactName: "",
    clientEmail: "",
    clientPhone: "",
    projectScope: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Reference for scrolling to the form
  const formSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Strict typing validation to prevent typing invalid characters
    if (name === "referrerName" || name === "clientContactName") {
      // Only allow letters and spaces
      const cleanValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else if (name === "referrerPhone" || name === "clientPhone") {
      // Only allow digits, spaces, plus sign, dashes, and parentheses
      const cleanValue = value.replace(/[^0-9+\s()-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: null, message: "" });

    // Strict Validation Checks
    const nameRegex = /^[a-zA-Z\s]{2,100}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.referrerName.trim())) {
      setFormStatus({
        type: "error",
        message: "Your name must contain only letters and spaces (minimum 2 characters).",
      });
      return;
    }

    if (!emailRegex.test(formData.referrerEmail.trim())) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid referrer email address.",
      });
      return;
    }

    if (formData.referrerPhone.trim()) {
      const numericDigits = formData.referrerPhone.replace(/[^0-9]/g, "");
      if (numericDigits.length < 10 || numericDigits.length > 15) {
        setFormStatus({
          type: "error",
          message: "Referrer phone number must contain between 10 and 15 digits.",
        });
        return;
      }
    }

    if (!formData.referrerUpiOrBank.trim()) {
      setFormStatus({
        type: "error",
        message: "UPI ID or Bank Details is required.",
      });
      return;
    }

    if (!formData.clientBusinessName.trim()) {
      setFormStatus({
        type: "error",
        message: "Referred client company name is required.",
      });
      return;
    }

    if (!nameRegex.test(formData.clientContactName.trim())) {
      setFormStatus({
        type: "error",
        message: "Client contact person's name must contain only letters and spaces (minimum 2 characters).",
      });
      return;
    }

    if (!emailRegex.test(formData.clientEmail.trim())) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid client email address.",
      });
      return;
    }

    if (formData.clientPhone.trim()) {
      const numericDigits = formData.clientPhone.replace(/[^0-9]/g, "");
      if (numericDigits.length < 10 || numericDigits.length > 15) {
        setFormStatus({
          type: "error",
          message: "Client phone number must contain between 10 and 15 digits.",
        });
        return;
      }
    }

    if (!formData.projectScope.trim()) {
      setFormStatus({
        type: "error",
        message: "Project scope & requirements are required.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setFormStatus({
          type: "success",
          message: data.message || "Referral submitted successfully!",
        });
        setFormData({
          referrerName: "",
          referrerEmail: "",
          referrerPhone: "",
          referrerUpiOrBank: "",
          clientBusinessName: "",
          clientContactName: "",
          clientEmail: "",
          clientPhone: "",
          projectScope: "",
        });
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Failed to submit referral. Please check all fields.",
        });
      }
    } catch (err) {
      console.error("Referral form submit error:", err);
      setFormStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="relative flex flex-col w-full overflow-hidden text-white bg-[#0c0414]">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (High-Fidelity Replica with radial purple brand theme) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden z-10 bg-[radial-gradient(circle_at_center,_#2b0d4f_0%,_#0c0414_75%,_#05010a_100%)] border-b border-purple-950/20">

        {/* Soft background purple/fuchsia light blooms */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-fuchsia-700/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center relative z-10 pt-12 md:pt-16">

          {/* Main Title Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.15] max-w-4xl"
          >
            Earn Up to 10% Commission for Every Qualified Client You Refer
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-300 max-w-3xl text-sm sm:text-base md:text-lg mt-6 leading-relaxed"
          >
            Know a business that needs reliable IT, cloud, or cybersecurity solutions? Refer them
            to us, and we&apos;ll handle the rest. You earn when they pay. No caps. No hidden fees.
          </motion.p>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={handleScrollToForm}
              className="bg-[#a356db] hover:bg-[#b066e6] hover:scale-[1.03] active:scale-[0.98] transition-all text-white font-semibold rounded-lg px-8 py-3.5 text-base shadow-lg shadow-purple-500/10 cursor-pointer"
            >
              Submit a Referral
            </button>
          </motion.div>

          {/* Interactive Responsive Pills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-4 mt-12 md:mt-16 w-full max-w-5xl"
          >
            {[
              "Paid within 15 days",
              "Bank/UPI transfers",
              "No referral limits",
              "Transparent tracking"
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center bg-white hover:bg-gray-50 border border-gray-100/90 rounded-full px-5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="text-[#8b5cf6] text-xs sm:text-sm font-semibold tracking-wide">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SERVICES WE COVER SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-6 z-10 bg-[#0c0414] border-b border-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/20">
              Services Catalog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Services We Cover
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
              We offer 10% commission on all contract services we deliver. Explore our core technical competencies.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Terminal className="w-6 h-6 text-purple-400" />,
                title: "Software Development",
                desc: "Custom applications, high-performance web systems, mobile apps, and robust API architectures.",
              },
              {
                icon: <Cloud className="w-6 h-6 text-fuchsia-400" />,
                title: "Cloud & IT Infrastructure",
                desc: "Server administration, automated DevOps pipelines, high-availability setups, and cloud migrations.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                title: "Cybersecurity & Compliance",
                desc: "Vulnerability assessments, network defense configurations, security audits, and firewall designs.",
              },
              {
                icon: <Cpu className="w-6 h-6 text-cyan-400" />,
                title: "Digital Transformation",
                desc: "IT consulting, business workflow automation, database migrations, and legacy system modernization.",
              },
            ].map((service, idx) => (
              <FadeUp
                key={idx}
                delay={idx * 0.1}
                className="group relative flex flex-col p-6 rounded-xl bg-purple-950/10 border border-purple-900/15 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden"
              >
                {/* Ambient purple glow on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="mb-4 w-11 h-11 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center group-hover:border-purple-500/20 transition-all duration-300">
                  {service.icon}
                </div>

                <h3 className="text-white text-base font-bold tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {service.desc}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-6 z-10 bg-[#09020e] border-b border-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/20">
              Simple Three-Step Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              How the Referral Program Works
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-6 h-6 text-purple-400" />,
                title: "1. Submit Details",
                desc: "Fill out the referral form below with your details and basic info about the business that needs IT or software solutions.",
              },
              {
                icon: <Handshake className="w-6 h-6 text-fuchsia-400" />,
                title: "2. We Connect & Pitch",
                desc: "Our engineering and accounts team will contact them to design a custom proposal. We handle all discussions and agreements.",
              },
              {
                icon: <Coins className="w-6 h-6 text-emerald-400" />,
                title: "3. Receive 10% Payout",
                desc: "When the client signs the contract and makes their first payment, your 10% commission is transferred to you within 15 days.",
              },
            ].map((step, idx) => (
              <FadeUp
                key={idx}
                delay={idx * 0.15}
                className="group relative flex flex-col p-8 rounded-xl bg-purple-950/10 border border-purple-900/20 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 shadow-xl overflow-hidden"
              >
                {/* Glow border overlay */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="mb-5 w-12 h-12 rounded-lg bg-purple-900/30 border border-purple-900/40 flex items-center justify-center group-hover:border-purple-500/30 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-white text-lg font-bold tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      =========================================================================
      {/* 4. INTERACTIVE COMMISSION ESTIMATOR */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-6 z-10 bg-[#0c0414] border-b border-purple-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.04),transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-emerald-500/20 bg-emerald-950/20">
              Earnings Calculator
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Estimate Your Referral Earnings
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
              Drag the slider to choose the potential contract size of your referral and see how much you could earn instantly.
            </p>
          </FadeUp>

          <FadeUp className="relative rounded-2xl border border-purple-900/25 bg-[#140620]/30 backdrop-blur-md p-8 md:p-12 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

              {/* Left – Slider controls */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Contract Value</span>
                  <span className="text-white font-bold text-lg">{formatCurrency(projectValue)}</span>
                </div>

                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="25000"
                  value={projectValue}
                  onChange={(e) => setProjectValue(Number(e.target.value))}
                  className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                />

                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2 font-semibold">
                  <span>₹50,000</span>
                  <span>₹7,50,000</span>
                  <span>₹15,000,00</span>
                </div>

                <div className="mt-8 bg-purple-950/40 border border-purple-900/20 rounded-lg p-4">
                  <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">Typical Project Examples</h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• ₹1L - ₹3L: Cloud Migrations & System Setups</li>
                    <li>• ₹3L - ₹8L: Custom Web Applications & API Portals</li>
                    <li>• ₹8L - ₹15L+: Full Enterprise Software Suite & Infra</li>
                  </ul>
                </div>
              </div>

              {/* Right – Dynamic Earnings Display */}
              <div className="flex flex-col items-center text-center bg-[#0c0414]/80 border border-purple-900/30 rounded-xl p-8 relative">
                <div className="absolute top-2 right-2 flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/20">
                  10% Payout
                </div>

                <span className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Your Commission</span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={projectValue}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight"
                  >
                    {formatCurrency(projectValue * 0.1)}
                  </motion.div>
                </AnimatePresence>

                <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                  Calculated based on first invoice payment. Paid directly to your bank account or UPI ID.
                </p>

                <button
                  onClick={handleScrollToForm}
                  className="mt-6 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-slate-950 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-md cursor-pointer"
                >
                  Claim This Payout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PARTNER GUIDELINES SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-6 z-10 bg-[#0c0414] border-b border-purple-950/10">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/20">
              Rules & Guidelines
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Partner Guidelines
            </h2>
          </FadeUp>

          <FadeUp className="relative rounded-2xl border border-purple-900/20 bg-purple-950/10 p-6 md:p-10 shadow-2xl overflow-hidden max-w-3xl mx-auto">
            {/* Subtle glow backdrop */}
            <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />

            <ul className="flex flex-col gap-5 list-disc pl-5 text-gray-300 text-sm md:text-base leading-relaxed">
              {[
                <>Referrals must be <strong className="text-white font-semibold">new clients</strong> who haven&apos;t engaged with us in the past 12 months.</>,
                <>Commission is paid <strong className="text-white font-semibold">only after we receive full/partial payment</strong> from the client.</>,
                <><strong className="text-white font-semibold">Duplicate referrals</strong> or self-referrals are not eligible.</>,
                <>We reserve the right to <strong className="text-white font-semibold">validate and approve</strong> all submissions.</>,
                <>Payouts processed via <strong className="text-white font-semibold">Bank Transfer or UPI</strong>.</>,
                <>Partners are responsible for their own <strong className="text-white font-semibold">tax compliance</strong>. We do not deduct TDS unless legally required.</>
              ].map((item, idx) => (
                <li key={idx} className="marker:text-purple-400">
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REFERRAL SUBMISSION FORM SECTION */}
      {/* ========================================================================= */}
      <section ref={formSectionRef} className="relative w-full py-20 px-6 z-10 bg-[#09020e] border-b border-purple-950/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-fuchsia-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/20">
              Application Form
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Submit Your Referral Details
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Fill out this form with your information and the referred company&apos;s details. Our accounts team will handle the rest.
            </p>
          </FadeUp>

          <FadeUp className="bg-purple-950/10 border border-purple-900/20 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">

              {/* Partner Details (Referrer) */}
              <div>
                <h3 className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-purple-900/20">
                  1. Your Information (Referrer Partner)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Your Full Name *</label>
                    <input
                      type="text"
                      name="referrerName"
                      value={formData.referrerName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Your Email Address *</label>
                    <input
                      type="email"
                      name="referrerEmail"
                      value={formData.referrerEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. johndoe@gmail.com"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Your Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="referrerPhone"
                      value={formData.referrerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Your UPI ID or Bank Account Details *</label>
                    <input
                      type="text"
                      name="referrerUpiOrBank"
                      value={formData.referrerUpiOrBank}
                      onChange={handleInputChange}
                      placeholder="e.g. UPI ID (johndoe@okaxis) or Bank AC + IFSC"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Referred Client Details */}
              <div>
                <h3 className="text-fuchsia-400 text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-purple-900/20">
                  2. Referred Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Client Company / Business Name *</label>
                    <input
                      type="text"
                      name="clientBusinessName"
                      value={formData.clientBusinessName}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Corporation"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Client Contact Person Name *</label>
                    <input
                      type="text"
                      name="clientContactName"
                      value={formData.clientContactName}
                      onChange={handleInputChange}
                      placeholder="e.g. Jane Smith"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Client Email Address *</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. janesmith@acme.com"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-semibold">Client Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 99999 88888"
                      className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <label className="text-white mb-1.5 text-xs font-semibold">Project Scope & Requirements *</label>
                  <textarea
                    name="projectScope"
                    value={formData.projectScope}
                    onChange={handleInputChange}
                    placeholder="Provide details about their needs (e.g. software development, custom ERP, cloud migration, website rebuilding, cybersecurity setups, etc.)"
                    rows={4}
                    className="bg-purple-950/20 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all resize-none"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Status Messages */}
              {formStatus.type && (
                <div className={`p-4 rounded-lg border flex gap-3 text-xs md:text-sm ${formStatus.type === "success"
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                    : "bg-red-950/30 border-red-500/30 text-red-400"
                  }`}>
                  {formStatus.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{formStatus.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#a356db] hover:bg-[#b066e6] disabled:bg-purple-900/50 disabled:cursor-not-allowed transition-all text-white text-sm md:text-base font-bold rounded-lg py-3 mt-2 shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Referral Portal...
                  </>
                ) : (
                  "Submit Referral Form"
                )}
              </button>

            </form>
          </FadeUp>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQs SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 px-6 z-10 bg-[#0c0414]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="inline-block text-purple-400 text-[11px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-sm border border-purple-500/20 bg-purple-950/20">
              Questions & Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Referral Program FAQs
            </h2>
          </FadeUp>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <FadeUp
                  key={idx}
                  delay={idx * 0.1}
                  className="rounded-lg border border-purple-900/20 bg-purple-950/5 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-5 text-sm md:text-base font-semibold text-white hover:text-purple-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? "rotate-180 text-purple-400" : ""
                      }`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-xs md:text-sm text-gray-400 leading-relaxed border-t border-purple-900/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
