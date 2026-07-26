"use client";

import { Menu, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { AngelLogo } from "@/components/ui/logo";
import { Link, routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/memorials" as const, labelKey: "navMemorials" as const },
  { href: "/missing" as const, labelKey: "navMissing" as const },
];

type HeaderClientProps = {
  isAuthenticated: boolean;
};

export function HeaderClient({ isAuthenticated }: HeaderClientProps) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 border-0 text-[15px] font-semibold tracking-wide text-ivory-100 shadow-none outline-none ring-0 transition-colors duration-300 hover:text-gold-400 focus:outline-none focus-visible:ring-0 sm:text-base"
        >
          <AngelLogo showText className="h-7 w-7" textClassName="font-medium text-ivory-100 text-base" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-light tracking-wide transition-all duration-300",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-white/10 text-ivory-100"
                  : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center lg:flex">
          <label className="group relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-200/40 transition-colors duration-300 group-hover:text-ivory-200/60 group-focus-within:text-gold-500/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-white/5 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/10 hover:bg-white/10 focus:border-gold-500/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label={t("searchAriaLabel")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100 lg:hidden"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <div
            className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5"
            role="group"
            aria-label={t("languageAriaLabel")}
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-all duration-300 sm:px-3 sm:text-sm",
                  locale === loc
                    ? "bg-gold-500/20 text-gold-400"
                    : "text-ivory-200/60 hover:text-ivory-100"
                )}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/cabinet"
                className="rounded-full px-4 py-2 text-sm font-light tracking-wide text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100"
              >
                {t("myCabinet")}
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  {t("signOut")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-light tracking-wide text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100"
              >
                {t("login")}
              </Link>
              <Link href="/login?tab=register" className={buttonVariants({ size: "sm" })}>
                {t("register")}
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={menuOpen ? t("closeMenuAriaLabel") : t("menuAriaLabel")}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ivory-200/60 transition-all duration-300 hover:bg-white/5 hover:text-ivory-100 md:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/5 bg-black/40 px-4 py-4 backdrop-blur-md md:hidden">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-light tracking-wide transition-colors duration-300",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-white/10 text-ivory-100"
                      : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/cabinet"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-light tracking-wide text-ivory-200/60 transition-colors duration-300 hover:bg-white/5 hover:text-ivory-100"
                  >
                    {t("myCabinet")}
                  </Link>
                </li>
                <li>
                  <form action={signOut}>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                    >
                      {t("signOut")}
                    </Button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-light tracking-wide text-ivory-200/60 transition-colors duration-300 hover:bg-white/5 hover:text-ivory-100"
                  >
                    {t("login")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login?tab=register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-light tracking-wide text-gold-400 transition-colors duration-300 hover:bg-white/5"
                  >
                    {t("register")}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
