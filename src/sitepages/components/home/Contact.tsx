"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    agree: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const contactDetails = [
    {
      title: "Email",
      desc: "Contact us by email, and we respond shortly.",
      value: "enteropia.dev@gmail.com",
    },
    {
      title: "Phone",
      desc: "Call us on weekdays from 9 to 6 PM.",
      value: "+91 9900112530",
    },

  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agree) {
      setStatus({
        type: "error",
        message: "You must agree to the Privacy Policy.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          agree: false,
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submit error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-16 bg-black flex justify-center items-center z-10 relative">
      {/* Background radial soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 relative z-10">

        {/* Left Side: Contact Info */}
        <div className="flex flex-col">
          <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/10 text-purple-200 font-serif text-sm tracking-wide mb-6 w-max">
            We're Here to Help
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#c455e3] mb-4 tracking-tight">
            Contact us
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-12">
            We'd love to hear from you. Please fill out this form, and we'll reply soon.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {contactDetails.map((detail, index) => (
              <div key={index} className="flex flex-col group">
                <h4 className="text-white font-medium text-base mb-1.5 transition-colors group-hover:text-purple-400">
                  {detail.title}
                </h4>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed max-w-[180px]">
                  {detail.desc}
                </p>
                <p className="text-gray-300 text-xs whitespace-pre-line leading-relaxed selection:bg-purple-500/30">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="flex flex-col bg-[#140624]/80 backdrop-blur-md rounded-[24px] p-6 md:p-8 shadow-2xl h-fit border border-purple-900/30 max-w-md ml-auto w-full">
          <h3 className="text-white text-xl font-medium mb-6">Write us a message</h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-white mb-1.5 text-xs font-medium">First name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="[FIRST_NAME]"
                  className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-lg border border-purple-900/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-white mb-1.5 text-xs font-medium">Last name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="[LAST_NAME]"
                  className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-lg border border-purple-900/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-1.5 text-xs font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="[EMAIL_ADDRESS]"
                className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-lg border border-purple-900/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-1.5 text-xs font-medium">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave us a message..."
                rows={3}
                className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-lg border border-purple-900/10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                required
                disabled={submitting}
              />
            </div>

            <div className="flex items-center gap-2.5 mt-2 mb-1">
              <input
                type="checkbox"
                name="agree"
                id="privacy"
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4 rounded-full border border-purple-500/30 bg-[#3c294d] checked:bg-[#a855f7] checked:border-transparent focus:outline-none cursor-pointer accent-purple-600"
                required
                disabled={submitting}
              />
              <label htmlFor="privacy" className="text-gray-300 text-[11px] cursor-pointer hover:text-white transition-colors">
                I agree to the Privacy Policy.
              </label>
            </div>

            {status.type && (
              <div className={`p-3.5 rounded-lg border flex gap-2.5 text-xs ${status.type === "success"
                  ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                  : "bg-red-950/30 border-red-500/30 text-red-400"
                }`}>
                {status.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#a356db] hover:bg-[#b066e6] disabled:bg-[#a356db]/50 disabled:cursor-not-allowed transition-all text-white text-sm font-semibold rounded-full px-4 py-3 mt-1 shadow-lg shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Inquiry...
                </>
              ) : (
                "Send Message"
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
