"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { MemorialCard } from "@/components/ui/memorial-card";
import { MEMORIALS } from "@/lib/memorials-data";
import { cn } from "@/lib/utils";

type Filter = "recent" | "alphabet";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "recent", label: "Недавние" },
  { id: "alphabet", label: "Алфавит" },
];

export default function MemorialsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("recent");

  const filteredMemorials = useMemo(() => {
    let result = [...MEMORIALS];

    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(normalized));
    }

    if (filter === "alphabet") {
      result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }

    return result;
  }, [query, filter]);

  return (
    <main className="min-h-screen bg-charcoal-950 pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-light tracking-tight text-ivory-50 sm:text-5xl">
            Светлая память
          </h1>
          <p className="mt-4 text-base font-light tracking-wide text-ivory-200/55 sm:text-lg">
            Найдите страницу близкого человека
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 space-y-6"
        >
          <label className="group relative block">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ivory-200/40 transition-colors duration-300 group-focus-within:text-gold-500/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-base text-ivory-100 placeholder:text-ivory-200/35 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-gold-500/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm font-light tracking-wide transition-all duration-300",
                  filter === item.id
                    ? "border-gold-500/30 bg-gold-500/10 text-gold-400"
                    : "border-white/10 bg-white/5 text-ivory-200/55 hover:border-white/15 hover:bg-white/[0.07] hover:text-ivory-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
          {filteredMemorials.map((memorial, index) => (
            <MemorialCard key={memorial.id} {...memorial} index={index} />
          ))}
        </div>

        {filteredMemorials.length === 0 && (
          <p className="py-20 text-center text-sm font-light tracking-wide text-ivory-200/45">
            Ничего не найдено. Попробуйте изменить запрос.
          </p>
        )}
      </div>
    </main>
  );
}
