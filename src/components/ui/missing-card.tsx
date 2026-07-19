"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MissingPersonStatus = "SEARCHING" | "FOUND";

export type MissingCardProps = {
  fullName: string;
  age: number;
  lastLocation: string;
  disappearanceDate: string;
  status: MissingPersonStatus;
  index?: number;
};

const STATUS_STYLES: Record<
  MissingPersonStatus,
  { badge: string; glow: string }
> = {
  SEARCHING: {
    badge:
      "border-red-500/40 bg-red-500/15 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.35)]",
    glow: "from-red-500/10 via-slate-800/50 to-charcoal-900",
  },
  FOUND: {
    badge:
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.3)]",
    glow: "from-emerald-500/10 via-slate-800/50 to-charcoal-900",
  },
};

export function MissingCard({
  fullName,
  age,
  lastLocation,
  disappearanceDate,
  status,
  index = 0,
}: MissingCardProps) {
  const t = useTranslations("Missing");
  const locale = useLocale();
  const styles = STATUS_STYLES[status];

  const formattedDate = new Date(disappearanceDate).toLocaleDateString(
    locale === "ru" ? "ru-RU" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
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
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow duration-500 hover:border-white/15 hover:shadow-[0_16px_48px_-12px_rgba(148,163,184,0.18)]"
    >
      <div className="relative h-56 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            styles.glow
          )}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(10,10,11,0.85)_100%)]" />
        <div className="absolute left-4 top-4 z-10">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md",
              styles.badge
            )}
          >
            {t(`status.${status === "SEARCHING" ? "searching" : "found"}`)}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-medium tracking-wide text-ivory-50 transition-colors duration-300 group-hover:text-slate-100">
            {fullName}
          </h3>

          <p className="text-sm font-light tracking-wide text-slate-300/60">
            {t("age")}: {age} {t("years")}
          </p>

          <div className="flex items-start gap-2 text-sm font-light tracking-wide text-slate-300/60">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400/70"
              strokeWidth={1.5}
            />
            <span>
              {t("lastSeen")}: {lastLocation}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm font-light tracking-wide text-slate-400/50">
            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="mt-auto w-full border border-white/5 text-slate-300/70 hover:border-white/10 hover:bg-white/5 hover:text-ivory-100"
        >
          {t("reportInfo")}
        </Button>
      </div>
    </motion.article>
  );
}
