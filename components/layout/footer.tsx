import Link from "next/link";

const NAV_LINKS = [
  { href: "/memorials", label: "Каталог" },
  { href: "/create", label: "Создать мемориал" },
  { href: "/about", label: "О проекте" },
  { href: "/contacts", label: "Контакты" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/terms", label: "Условия использования" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-[#070708]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-block text-lg font-semibold tracking-wide text-ivory-100 transition-colors duration-300 hover:text-gold-400"
            >
              AngelBook
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed tracking-wide text-ivory-200/45">
              Пространство тихой памяти — где истории близких людей сохраняются
              с достоинством, теплом и заботой для будущих поколений.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
              Навигация
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light tracking-wide text-ivory-200/55 transition-colors duration-300 hover:text-ivory-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
              Правовая информация
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light tracking-wide text-ivory-200/55 transition-colors duration-300 hover:text-ivory-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs font-light tracking-wide text-ivory-200/35">
            © {new Date().getFullYear()} AngelBook. Все права защищены.
          </p>
          <p className="text-xs font-light tracking-wide text-ivory-200/25">
            Сохранить историю
          </p>
        </div>
      </div>
    </footer>
  );
}
