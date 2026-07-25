import { setRequestLocale } from "next-intl/server";
import { getMissingPersons } from "@/app/actions/missing";
import { MissingCard } from "@/components/ui/missing-card";
import { MISSING_PERSONS } from "@/lib/missing-persons-data";
import { Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

interface MissingPersonsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; query?: string }>;
}

export default async function MissingPersonsPage({
  params,
  searchParams,
}: MissingPersonsPageProps) {
  const { locale } = await params;
  const { q, query } = await searchParams;
  const searchTerm = (q || query || "").trim();

  setRequestLocale(locale);

  const dbPersons = await getMissingPersons(searchTerm);

  // Combine database records with mock data if query matches
  const formattedDbPersons = dbPersons.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    age: p.age || 0,
    lastLocation: p.lastLocation || "Не указано",
    disappearanceDate: p.disappearanceDate
      ? p.disappearanceDate.toISOString()
      : p.createdAt.toISOString(),
    status: p.status as "SEARCHING" | "FOUND",
    photoUrl: p.photoUrl,
    distinctiveFeatures: p.distinctiveFeatures,
  }));

  const mockFiltered = searchTerm
    ? MISSING_PERSONS.filter((p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : MISSING_PERSONS;

  const allPersons = [...formattedDbPersons, ...mockFiltered];

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
        <header className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-steel-400/60">
            ПРОПАВШИЕ БЕЗ ВЕСТИ
          </p>
          <h1 className="mt-4 text-4xl font-light tracking-tight text-ivory-100 sm:text-5xl">
            Поиск пропавших
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-light tracking-wide text-steel-300/55 sm:text-lg">
            Помогите найти тех, кто пропал без вести
          </p>
          <div className="mt-8">
            <Link href="/missing/create" className={buttonVariants({ size: "lg" })}>
              Сообщить о пропаже
            </Link>
          </div>
        </header>

        <form method="GET" className="mb-10">
          <label className="group relative block">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-400/40 transition-colors duration-300 group-focus-within:text-steel-300/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Поиск по имени или местоположению..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-base text-ivory-100 placeholder:text-steel-400/35 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-steel-400/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-steel-400/15"
            />
          </label>
        </form>

        {allPersons.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {allPersons.map((person, index) => (
              <MissingCard key={person.id} {...person} index={index} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-sm font-light tracking-wide text-steel-400/45">
            Ничего не найдено
          </p>
        )}
      </div>
    </main>
  );
}
