import React from "react";

export default function KeyBenefits() {
  const benefits = [
    {
      title: "Effortless Task Management",
      description:
        "Organize projects, assign tasks, and track progress with intuitive tools designed to keep everyone.",
    },
    {
      title: "Seamless Communication",
      description:
        "Centralize your chats, files, and updates. Our real-time communication tools.",
    },
    {
      title: "Insightful Analytics",
      description:
        "Gain a comprehensive view of your team's performance with customizable dashboards",
    },
  ];

  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center z-10">
      {/* Pill Badge */}
      <div className="mb-16">
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-purple-500/40 text-gray-100 font-serif text-lg tracking-wide bg-black/20 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          Key Benefits
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] w-full px-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col p-10 rounded-[28px] bg-gradient-to-br from-[#1a0a29] via-[#3d1363] to-[#7924a3] border border-white/5 shadow-2xl overflow-hidden relative group transition-transform hover:-translate-y-1 duration-300"
          >
            {/* Subtle inner highlight to make it look 3D like the image */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Logo */}
            <div className="text-white text-3xl font-black italic tracking-tighter mb-10">
              hy
            </div>

            {/* Content */}
            <div className="mt-auto">
              <h3 className="text-white text-xl font-bold mb-4 tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed pr-4">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
