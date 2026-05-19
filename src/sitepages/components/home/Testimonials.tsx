"use client";

import React, { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sophie Moore",
    role: "Head of marketing",
    text: "This calendar app has been a lifesaver! I used to forget important events, but now I'm always on top of my schedule.",
    seed: "sophie",
    stars: 5,
  },
  {
    name: "Adam Gwadyr",
    role: "Entrepreneur",
    text: "This app has saved me so much time and stress! I used to constantly forget important dates, but now I can stay on top of everything. You should test it!",
    seed: "adam",
    stars: 5,
  },
  {
    name: "Annie Deway",
    role: "Designer",
    text: "I've tried a lot of calendar apps, but this one is by far the best! It's so intuitive and customizable, and it has all the features I need. Game changer!",
    seed: "annie",
    stars: 5,
  },
  {
    name: "Michel O Neill",
    role: "Head of Sales",
    text: "I don't know how I ever lived without this app! It's made scheduling appointments and meetings a breeze, and I love how I can sync it across all my devices.",
    seed: "michel",
    stars: 5,
  },
  {
    name: "Bard De Costa",
    role: "Manager",
    text: "As someone with a busy schedule, this app is a lifesaver! It's helped me stay organized and on top of everything, and I couldn't be happier with it.",
    seed: "bard",
    stars: 5,
  },
  {
    name: "Ella Moridin",
    role: "Product designer",
    text: "I've recommended this app to all my friends and colleagues! It's the best calendar app out there, and it's made managing my schedule a breeze.",
    seed: "ella",
    stars: 4,
  },
  {
    name: "Mary Cath",
    role: "Solo-Entrepreneur",
    text: "This app is so simple yet so powerful! I love how I can easily add events and see my entire schedule at a glance.",
    seed: "mary",
    stars: 5,
  },
  {
    name: "Johana Smith",
    role: "Founder",
    text: "I'm not the most organized person, but this app has made it so easy for me to stay on top of things! I love how I can set reminders and get notifications, and it's really helped me.",
    seed: "johana",
    stars: 5,
  },
];

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const currentTestimonials = testimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center z-10 bg-[#0e0416]">
      {/* Header Content */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-6 mb-20">
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-purple-500/30 text-gray-200 font-serif text-sm tracking-wide mb-6">
          They already love our products 😍
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          See what our Clients <br /> say about us
        </h2>
        
        <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
          We are proud to work with amazing clients who have seen real results using our platform.
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="w-full max-w-[1400px] px-6 mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {currentTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="break-inside-avoid flex flex-col rounded-2xl bg-[#1a0f24] p-8 border border-purple-900/20 shadow-lg hover:border-purple-500/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
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
              <p className="text-gray-200 text-sm md:text-[15px] leading-relaxed mb-8">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex-shrink-0 overflow-hidden relative">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.seed}&backgroundColor=transparent`}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-medium text-sm">
                    {testimonial.name}
                  </span>
                </div>
                <span className="text-gray-400 text-xs text-right max-w-[120px] truncate">
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
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
            className="px-4 py-2 rounded-full border border-purple-900/30 text-gray-300 hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
