"use client";

import { motion } from "framer-motion";

const PARTICLES = [
  { id: 1, left: "8%", size: 2, opacity: 0.15, duration: 22, delay: 0, tone: "gold" },
  { id: 2, left: "18%", size: 3, opacity: 0.12, duration: 28, delay: 2, tone: "ivory" },
  { id: 3, left: "27%", size: 2, opacity: 0.18, duration: 24, delay: 4, tone: "gold" },
  { id: 4, left: "38%", size: 2.5, opacity: 0.1, duration: 30, delay: 1, tone: "ivory" },
  { id: 5, left: "48%", size: 2, opacity: 0.16, duration: 26, delay: 6, tone: "gold" },
  { id: 6, left: "56%", size: 3, opacity: 0.12, duration: 32, delay: 3, tone: "ivory" },
  { id: 7, left: "64%", size: 2, opacity: 0.14, duration: 20, delay: 5, tone: "gold" },
  { id: 8, left: "72%", size: 2.5, opacity: 0.11, duration: 27, delay: 0.5, tone: "ivory" },
  { id: 9, left: "81%", size: 2, opacity: 0.17, duration: 25, delay: 7, tone: "gold" },
  { id: 10, left: "90%", size: 3, opacity: 0.13, duration: 29, delay: 2.5, tone: "ivory" },
] as const;

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute bottom-[-5%] rounded-full"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            backgroundColor:
              particle.tone === "gold"
                ? "rgba(196, 169, 98, 1)"
                : "rgba(245, 244, 240, 1)",
            boxShadow:
              particle.tone === "gold"
                ? "0 0 6px rgba(196, 169, 98, 0.3)"
                : "0 0 4px rgba(245, 244, 240, 0.2)",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, particle.opacity, particle.opacity * 0.6, 0],
            y: [0, -120, -280, -420],
            x: [0, particle.id % 2 === 0 ? 8 : -8, particle.id % 2 === 0 ? -4 : 4, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
