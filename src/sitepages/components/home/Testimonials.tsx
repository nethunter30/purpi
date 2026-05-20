"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [testimonialList, setTestimonialList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);

  const itemsPerPage = 6;

  // Load testimonials from database after mount
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const result = await res.json();
        if (result.success) {
          // Map DB models to match UI fields (e.g. seed = userId)
          const dbTestimonials = result.data.map((t: any) => ({
            name: t.name,
            role: t.role,
            text: t.text,
            seed: t.userId,
            stars: t.stars,
          }));
          setTestimonialList(dbTestimonials);
        }
      } catch (e) {
        console.error("Failed to fetch testimonials:", e);
      }
    };
    loadTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !name.trim() || !role.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit the testimonial to our backend API
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          role: role.trim(), 
          text: text.trim(), 
          userId: userId.trim(), 
          stars 
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setSubmitError(data.message || "Failed to submit review.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      setSubmitError("An error occurred while submitting.");
      setIsSubmitting(false);
      return;
    }
    // Reset Form
    setUserId("");
    setName("");
    setRole("");
    setText("");
    setStars(5);
    setIsModalOpen(false);
    setIsSubmitting(false);

    // Show success message
    window.alert("Testimonial submitted successfully! It will appear once approved by an admin.");
    setSuccessMessage("Testimonial submitted successfully! It will appear once approved by an admin.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const totalPages = Math.ceil(testimonialList.length / itemsPerPage);
  const currentTestimonials = testimonialList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="relative w-full py-12 flex flex-col items-center justify-center z-10 bg-[#0e0416]">
      {/* Header Content */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-3 tracking-tight">
          See what our Clients say about us
        </h2>
        
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-lg mb-5">
          We are proud to work with amazing clients who have seen real results using our platform.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 rounded-full border border-purple-500/50 bg-[#3b1764]/50 hover:bg-[#3b1764]/80 text-white font-medium text-xs transition-all duration-300 shadow-md hover:shadow-purple-500/10 hover:scale-105 active:scale-95 cursor-pointer"
        >
          Submit a Testimonial
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="w-full max-w-[1000px] px-6 mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {currentTestimonials.map((testimonial: any, index: number) => (
            <div
              key={`${testimonial.seed}-${index}`}
              className="break-inside-avoid flex flex-col rounded-xl bg-[#1a0f24] p-5 border border-purple-900/30 shadow-lg hover:border-purple-500/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < testimonial.stars ? "text-yellow-400" : "text-gray-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-200 text-xs md:text-sm leading-relaxed mb-4">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.seed}&backgroundColor=transparent`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium text-xs">
                    {testimonial.name}
                  </span>
                </div>
                <span className="text-gray-400 text-[10px] text-right max-w-[100px] truncate">
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-full border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
                currentPage === i + 1 
                  ? "bg-[#a356db] text-white"
                  : "border border-purple-900/30 text-gray-300 hover:bg-purple-900/20"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-full border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setIsModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#140624] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-white mb-2">Write a Testimonial</h3>
              <p className="text-gray-400 text-xs mb-6">
                Share your experience! Your User ID will generate your personalized avatar.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* User ID */}
                <div className="flex flex-col">
                  <label className="text-white mb-1.5 text-xs font-medium">User ID *</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. alex_stone"
                    className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-medium">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Stone"
                      className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white mb-1.5 text-xs font-medium">Role *</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Developer"
                      className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-white mb-1.5 text-xs font-medium">Rating *</label>
                  <div className="flex gap-1.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="transition-transform active:scale-95 focus:outline-none cursor-pointer"
                      >
                        <svg
                          className={`w-6 h-6 transition-colors duration-150 ${
                            star <= (hoverStars || stars) ? "text-yellow-400 fill-yellow-400" : "text-gray-600 fill-transparent"
                          }`}
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.176-.436.745-.436.92 0l1.986 4.908a1 1 0 00.758.625l5.249.493c.47.044.658.625.318.96l-3.834 3.738a1 1 0 00-.288.948l1.01 5.215c.09.467-.393.818-.802.576l-4.7-2.617a1 1 0 00-.964 0l-4.7 2.617c-.409.242-.892-.11-.802-.576l1.01-5.215a1 1 0 00-.288-.948l-3.834-3.738c-.34-.336-.15-.917.318-.96l5.249-.493a1 1 0 00.758-.625l1.987-4.908z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-white mb-1.5 text-xs font-medium">Testimonial *</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us what you think..."
                    rows={4}
                    className="w-full bg-[#3c294d]/60 text-white text-sm placeholder:text-gray-500 px-3.5 py-2.5 rounded-lg border border-purple-900/20 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-purple-900/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl bg-purple-900/90 border border-purple-500 text-white font-medium text-sm shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <span className="text-xl">✨</span>
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
