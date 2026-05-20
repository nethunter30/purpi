"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, LayoutGrid } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const result = await res.json();
        if (result.success) {
          setServices(result.data);
        }
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="relative min-h-screen bg-black py-24 z-10 flex flex-col items-center">
      {/* Background Decorative Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 mb-20 relative z-20">
        <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 font-serif text-sm tracking-wide mb-6">
          Our Expertises
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-[#c455e3] mb-6 tracking-tight">
          Services We Offer
        </h1>
        
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
          From cutting-edge digital creation to scalable enterprise infrastructure, discover our range of industry-leading tech solutions designed to power your vision.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-[1200px] w-full px-6 relative z-20 flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
            <p className="text-sm">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-gray-500 border border-purple-900/20 bg-[#12061f]/40 rounded-3xl p-8">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-25 text-purple-400" />
            <h3 className="text-white text-xl font-bold mb-2">No Services Found</h3>
            <p className="text-sm max-w-md">Our backend is ready. Log in to the master admin console to add and display services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col rounded-3xl bg-[#12061f]/80 border border-purple-950/20 hover:border-purple-500/30 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-purple-500/10 min-h-[400px]"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#c455e3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Image Banner */}
                <div className="relative w-full h-48 overflow-hidden bg-black/40">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#12061f] z-10" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-8 relative z-20">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-3 block">
                    Service 0{index + 1}
                  </span>
                  <h3 className="text-white text-2xl font-bold mb-3 tracking-tight group-hover:text-[#c455e3] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#c455e3] group-hover:text-purple-300 transition-colors">
                    Explore Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
