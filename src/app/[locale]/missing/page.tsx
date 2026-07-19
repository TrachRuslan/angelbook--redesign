"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { MissingCard } from "@/components/ui/missing-card";
import { MISSING_PERSONS } from "@/lib/missing-persons-data";

export default function MissingPersonsPage() {
  const t = useTranslations("Missing");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return MISSING_PERSONS;
    const normalized = query.trim().toLowerCase();
    return MISSING_PERSONS.filter((person) =>
      person.fullName.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-charcoal-950 pt-24 pb-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(148,163,184,0.06),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-400/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-steel-400/60">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-light tracking-tight text-ivory-100 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-light tracking-wide text-steel-300/55 sm:text-lg">
            {t("subtitle")}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <Link href="/missing/create" className={buttonVariants({ size: "lg" })}>
              {t("createCta")}
            </Link>
          </motion.div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <label className="group relative block">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400/40 transition-colors duration-300 group-focus-within:text-steel-300/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-base text-ivory-100 placeholder:text-steel-400/35 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-steel-400/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-steel-400/15"
            />
          </label>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((person, index) => (
            <MissingCard key={person.id} {...person} index={index} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-sm font-light tracking-wide text-steel-400/45">
            {t("empty")}
          </p>
        )}
      </div>
    </main>
  );
}
