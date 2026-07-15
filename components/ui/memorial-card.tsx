"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function MemorialCard({
  name,
  dates,
  candles,
  index = 0,
}: {
  name: string;
  dates: string;
  candles: number;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow duration-500 hover:border-gold-500/20 hover:shadow-[0_12px_40px_-8px_rgba(196,169,98,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-charcoal-800 via-charcoal-700 to-charcoal-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(196,169,98,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(196,169,98,0.06),transparent_70%)]" />
        </div>
      </div>

      <div className="space-y-3 p-6">
        <h3 className="text-lg font-medium tracking-wide text-ivory-50 transition-colors duration-300 group-hover:text-gold-400">
          {name}
        </h3>
        <p className="text-sm font-light tracking-wide text-ivory-200/45">{dates}</p>
        <div className="flex items-center gap-2 pt-1">
          <Flame
            className="h-3.5 w-3.5 text-gold-500/70 transition-colors duration-300 group-hover:text-gold-400"
            strokeWidth={1.5}
          />
          <span className="text-xs font-light tracking-wide text-ivory-200/50">
            {candles}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
