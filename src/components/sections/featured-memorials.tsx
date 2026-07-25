"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { MemorialCard } from "@/components/ui/memorial-card";
import { formatMemorialDates } from "@/lib/memorial-format";

export interface FeaturedMemorialItem {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | string | null;
  dateOfDeath?: Date | string | null;
  imageUrl?: string | null;
  candleCount?: number;
}

interface FeaturedMemorialsProps {
  memorials?: FeaturedMemorialItem[];
}

export function FeaturedMemorials({ memorials = [] }: FeaturedMemorialsProps) {
  const t = useTranslations("FeaturedMemorials");
  const locale = useLocale();

  if (!memorials || memorials.length === 0) {
    return null;
  }

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
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-ivory-100 sm:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {memorials.slice(0, 6).map((memorial, index) => {
            const dates = formatMemorialDates(
              memorial.dateOfBirth ? new Date(memorial.dateOfBirth) : null,
              memorial.dateOfDeath ? new Date(memorial.dateOfDeath) : null,
              locale
            );

            return (
              <MemorialCard
                key={memorial.id}
                id={memorial.id}
                name={`${memorial.firstName} ${memorial.lastName}`}
                dates={dates}
                candles={memorial.candleCount || 0}
                imageUrl={memorial.imageUrl}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
