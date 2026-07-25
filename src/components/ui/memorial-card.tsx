"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MemorialCard({
  id,
  name,
  dates,
  candles,
  imageUrl,
  index = 0,
}: {
  id: string;
  name: string;
  dates: string;
  candles: number;
  imageUrl?: string | null;
  index?: number;
}) {
  const t = useTranslations("Memorials");

  return (
    <Link href={`/memorials/${id}`}>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.7,
          delay: (index % 6) * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -4 }}
        className="group overflow-hidden rounded-3xl border border-gold-500/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-md transition-shadow duration-500 hover:border-gold-500/30 hover:shadow-[0_16px_48px_-12px_rgba(196,169,98,0.2)]"
      >
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-charcoal-800 via-[#1a1814] to-charcoal-900">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border border-gold-500/20 bg-black/20 backdrop-blur-sm" />
            </div>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(196,169,98,0.14),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,10,11,0.9)_100%)]" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(196,169,98,0.1),transparent_70%)]" />
          </div>
        </div>

        <div className="space-y-3 p-6">
          <h3 className="text-xl font-medium tracking-wide text-ivory-50 transition-colors duration-300 group-hover:text-gold-400">
            {name}
          </h3>
          <p className="text-sm font-light tracking-[0.08em] text-gold-500/60">
            {dates}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Flame
              className="h-4 w-4 text-gold-500/80 transition-colors duration-300 group-hover:text-gold-400"
              strokeWidth={1.5}
            />
            <span className="text-sm font-light tracking-wide text-ivory-200/55">
              {candles} {t("candles")}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
