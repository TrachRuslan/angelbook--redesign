"use client";

import { motion } from "framer-motion";
import { MemorialCard } from "@/components/ui/memorial-card";
import { MEMORIALS } from "@/lib/memorials-data";

export function FeaturedMemorials() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
            Недавние мемориалы
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
            Память, которую берегут
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {MEMORIALS.slice(0, 3).map((memorial, index) => (
            <MemorialCard key={memorial.id} {...memorial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
