"use client";

import React from "react";
import { motion } from "framer-motion";

interface FadeUpProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  id?: string;
}

export default function FadeUp({
  children,
  duration = 1,
  delay = 0.2,
  className = "",
  id,
}: FadeUpProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // smooth cubic-bezier easeOut
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
