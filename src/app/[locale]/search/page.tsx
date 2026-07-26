import { setRequestLocale } from "next-intl/server";
import { searchAll } from "@/app/actions/search";
import { MemorialCard } from "@/components/ui/memorial-card";
import { MissingCard } from "@/components/ui/missing-card";
import { formatMemorialDates } from "@/lib/memorial-format";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; query?: string }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const { q, query } = await searchParams;
  const searchTerm = (q || query || "").trim();

  setRequestLocale(locale);

  const results = searchTerm ? await searchAll(searchTerm) : [];

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
            Результаты поиска
          </h1>
          {searchTerm ? (
            <p className="mt-3 text-base font-light text-ivory-200/50">
              По запросу <span className="font-medium text-gold-400">&quot;{searchTerm}&quot;</span> найдено {results.length} страниц(ы)
            </p>
          ) : (
            <p className="mt-3 text-base font-light text-ivory-200/50">
              Введите имя или фамилию для поиска по мемориалам и пропавшим без вести
            </p>
          )}
        </header>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {results.map((item, index) => {
              if (item.type === "memorial") {
                const dates = formatMemorialDates(
                  item.dateOfBirth,
                  item.dateOfDeath,
                  locale
                );

                return (
                  <MemorialCard
                    key={item.id}
                    id={item.id}
                    name={`${item.firstName} ${item.lastName}`}
                    dates={dates}
                    candles={item.candleCount || 0}
                    imageUrl={item.imageUrl}
                    index={index}
                  />
                );
              } else {
                return (
                  <MissingCard
                    key={item.id}
                    id={item.id}
                    fullName={item.fullName}
                    age={item.age}
                    lastLocation={item.lastLocation || "Не указано"}
                    disappearanceDate={
                      item.disappearanceDate
                        ? item.disappearanceDate.toISOString()
                        : new Date().toISOString()
                    }
                    status={item.status}
                    photoUrl={item.photoUrl}
                    distinctiveFeatures={item.distinctiveFeatures}
                    index={index}
                  />
                );
              }
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-xl">
            <Search className="mb-4 h-12 w-12 text-ivory-200/30" />
            <h3 className="text-xl font-light text-ivory-100">
              Ничего не найдено
            </h3>
            <p className="mt-2 text-sm font-light text-ivory-200/40">
              Попробуйте проверить написание имени или изменить поисковый запрос.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
