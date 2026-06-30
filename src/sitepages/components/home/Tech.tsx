"use client";

import React from "react";
import FadeUp from "@/sitepages/components/layout/FadeUp";

interface Partner {
  name: string;
  logo: React.ReactNode;
}

import {
  SiFigma,
  SiNextdotjs,
  SiPython,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiGooglecloud,
  SiDocker,
  SiGraphql,
  SiTypescript,
  SiJavascript,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiJira,
  SiSlack,
  SiLinux,
  SiNginx,
  SiCisco,
  SiFortinet,
  SiVmware,
} from "react-icons/si";

import { FaWindows, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";

const iconClass =
  "w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300";

const defaultPartners: Partner[] = [
  { name: "Figma", logo: <SiFigma className={iconClass} /> },
  { name: "Next.js", logo: <SiNextdotjs className={iconClass} /> },
  { name: "Python", logo: <SiPython className={iconClass} /> },
  { name: "Node.js", logo: <SiNodedotjs className={iconClass} /> },
  { name: "React", logo: <SiReact className={iconClass} /> },
  { name: "Tailwind CSS", logo: <SiTailwindcss className={iconClass} /> },
  { name: "PostgreSQL", logo: <SiPostgresql className={iconClass} /> },
  { name: "MongoDB", logo: <SiMongodb className={iconClass} /> },
  { name: "AWS", logo: <FaAws className={iconClass} /> },
  { name: "Google Cloud", logo: <SiGooglecloud className={iconClass} /> },
  { name: "Azure", logo: <VscAzure className={iconClass} /> },
  { name: "Docker", logo: <SiDocker className={iconClass} /> },
  { name: "GraphQL", logo: <SiGraphql className={iconClass} /> },
  { name: "REST API", logo: <span className={iconClass}>API</span> }, // No official icon
  { name: "TypeScript", logo: <SiTypescript className={iconClass} /> },
  { name: "JavaScript", logo: <SiJavascript className={iconClass} /> },
  { name: "Git", logo: <SiGit className={iconClass} /> },
  { name: "GitHub", logo: <SiGithub className={iconClass} /> },
  { name: "GitLab", logo: <SiGitlab className={iconClass} /> },
  { name: "Bitbucket", logo: <SiBitbucket className={iconClass} /> },
  { name: "Jira", logo: <SiJira className={iconClass} /> },
  { name: "Slack", logo: <SiSlack className={iconClass} /> },
  { name: "Linux", logo: <SiLinux className={iconClass} /> },
  { name: "Nginx", logo: <SiNginx className={iconClass} /> },
  { name: "Windows", logo: <FaWindows className={iconClass} /> },
  { name: "Cisco", logo: <SiCisco className={iconClass} /> },
  { name: "Fortinet", logo: <SiFortinet className={iconClass} /> },
  { name: "VMware", logo: <SiVmware className={iconClass} /> },
];

export default function Tech() {
  return (
    <section className="relative w-full py-5 bg-black overflow-hidden border-y border-purple-950/10 z-10">
      
      {/* Premium linear-gradient edge fades */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Marquee Wrapper */}
      <FadeUp className="flex overflow-hidden w-full select-none">
        
        {/* Animated Marquee row */}
        <div className="animate-marquee gap-16 py-2">
          {/* Main set of items */}
          <div className="flex gap-16 items-center shrink-0">
            {defaultPartners.map((partner, index) => (
              <div
                key={`main-${index}`}
                className="group flex items-center gap-4 cursor-pointer transition-all duration-500"
              >
                {/* Logo wrapper */}
                <div className="flex items-center justify-center p-1 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  {partner.logo}
                </div>

                {/* Partner Name/Title */}
                <span className="text-gray-500 font-sans text-xl md:text-2xl font-bold tracking-tight group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>

          {/* Duplicate set of items for seamless loop (hidden from accessibility/crawlers) */}
          <div className="flex gap-16 items-center shrink-0" aria-hidden="true">
            {defaultPartners.map((partner, index) => (
              <div
                key={`dup-${index}`}
                className="group flex items-center gap-4 cursor-pointer transition-all duration-500"
              >
                {/* Logo wrapper */}
                <div className="flex items-center justify-center p-1 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  {partner.logo}
                </div>

                {/* Partner Name/Title */}
                <span className="text-gray-500 font-sans text-xl md:text-2xl font-bold tracking-tight group-hover:text-white transition-colors duration-500 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </FadeUp>
    </section>
  );
}
