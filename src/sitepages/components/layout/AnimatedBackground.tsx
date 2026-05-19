"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0, isActive: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      glowSize: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.glowSize = Math.random() * 15 + 5;
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.isActive) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.x += (dx / distance) * 2;
            this.y += (dy / distance) * 2;
          }
        }

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowSize);
        gradient.addColorStop(0, `rgba(217, 70, 239, ${this.alpha})`); // fuchsia
        gradient.addColorStop(1, "rgba(217, 70, 239, 0)");

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha + 0.2})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(window.innerWidth / 15, 60);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        if (mouse.isActive) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217, 70, 239, ${0.4 * (1 - distance / 200)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217, 70, 239, ${0.15 * (1 - distance / 200)})`; // fuchsia lines
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);

            // Add curve to lines to match design
            const cx = (particles[i].x + particles[j].x) / 2 + (Math.random() - 0.5) * 50;
            const cy = (particles[i].y + particles[j].y) / 2 + (Math.random() - 0.5) * 50;

            ctx.quadraticCurveTo(cx, cy, particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute w-full inset-0 z-0 bg-[#140620] overflow-hidden">
      {/* Background radial gradients for depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[#581c87]/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#4c1d95]/20 blur-[150px] rounded-full" />
      <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-[#86198f]/20 blur-[100px] rounded-full" />

      {/* Curved abstract wave SVGs */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <path
          d="M0,200 C300,100 600,400 1000,200 C1400,0 1800,300 2000,200"
          stroke="url(#grad1)"
          strokeWidth="2"
          fill="none"
          style={{ filter: 'blur(4px)' }}
        />
        <path
          d="M0,400 C400,600 800,200 1200,400 C1600,600 1900,300 2000,400"
          stroke="url(#grad2)"
          strokeWidth="3"
          fill="none"
          style={{ filter: 'blur(6px)' }}
        />
        <path
          d="M0,600 C500,400 900,700 1300,500 C1700,300 2000,600 2000,600"
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          style={{ filter: 'blur(2px)' }}
        />

        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d946ef" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
