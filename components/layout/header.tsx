"use client";

import { Globe, Menu, Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 border-0 text-[15px] font-semibold tracking-wide text-ivory-100 shadow-none outline-none ring-0 transition-colors duration-300 hover:text-gold-400 focus:outline-none focus-visible:ring-0 sm:text-base"
        >
          AngelBook
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <label className="group relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-200/40 transition-colors duration-300 group-hover:text-ivory-200/60 group-focus-within:text-gold-500/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Найти человека..."
              className="w-full rounded-full border border-white/5 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/10 hover:bg-white/10 focus:border-gold-500/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Поиск"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100 md:hidden"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Выбор языка"
            className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium tracking-wide text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100 sm:px-3 sm:text-sm"
          >
            <Globe className="hidden h-3.5 w-3.5 sm:block" strokeWidth={1.5} />
            <span>RU</span>
          </button>

          <button
            type="button"
            aria-label="Меню"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100"
          >
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
