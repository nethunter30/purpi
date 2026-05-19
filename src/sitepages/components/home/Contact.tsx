"use client";

import React from "react";

export default function Contact() {
  const contactDetails = [
    {
      title: "Email",
      desc: "Contact us by email, and we respond shortly.",
      value: "hey@uiblox.com",
    },
    {
      title: "Phone",
      desc: "Call us on weekdays from 9 to 5 PM.",
      value: "+1 (222) 333 444",
    },
    {
      title: "Office",
      desc: "Visit us at our headquarters.",
      value: "8425 Coastal Commerce Blvd,\nSuite 310, Tampa, FL 33619",
    }
  ];

  return (
    <section className="w-full py-16 bg-black flex justify-center items-center z-10 relative">
      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Side: Contact Info */}
        <div className="flex flex-col">
          <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-gray-500/50 text-gray-200 font-serif text-sm tracking-wide mb-6 w-max">
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
              <div key={index} className="flex flex-col">
                <h4 className="text-white font-medium text-base mb-1.5">{detail.title}</h4>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed max-w-[180px]">
                  {detail.desc}
                </p>
                <p className="text-gray-300 text-xs whitespace-pre-line leading-relaxed">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="flex flex-col bg-[#140624] rounded-[24px] p-6 md:p-8 shadow-2xl h-fit border border-purple-900/20 max-w-md ml-auto w-full">
          <h3 className="text-white text-xl font-medium mb-6">Write us a message</h3>
          
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-white mb-1.5 text-xs font-medium">First name *</label>
                <input 
                  type="text" 
                  placeholder="Jane" 
                  className="w-full bg-[#3c294d] text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-white mb-1.5 text-xs font-medium">Last name *</label>
                <input 
                  type="text" 
                  placeholder="Smith" 
                  className="w-full bg-[#3c294d] text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-shadow"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-1.5 text-xs font-medium">Email *</label>
              <input 
                type="email" 
                placeholder="jane@email.com" 
                className="w-full bg-[#3c294d] text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-shadow"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-1.5 text-xs font-medium">Message *</label>
              <textarea 
                placeholder="Leave us a message..." 
                rows={3}
                className="w-full bg-[#3c294d] text-white text-sm placeholder:text-gray-400 px-3 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-shadow resize-none"
                required
              />
            </div>

            <div className="flex items-center gap-2.5 mt-2 mb-1">
              <input 
                type="checkbox" 
                id="privacy" 
                className="w-4 h-4 appearance-none rounded-full bg-[#3c294d] checked:bg-[#a855f7] checked:border-transparent focus:outline-none cursor-pointer"
                required 
              />
              <label htmlFor="privacy" className="text-gray-300 text-[11px] cursor-pointer">
                I agree the Privacy Policy.
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#a356db] hover:bg-[#b066e6] transition-colors text-white text-sm font-medium rounded-full px-4 py-3 mt-1 shadow-sm"
            >
              Subscribe
            </button>
            
          </form>
        </div>

      </div>
    </section>
  );
}
