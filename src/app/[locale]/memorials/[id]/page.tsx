import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Heart } from "lucide-react";
import { prisma } from "@/utils/prisma";
import { formatMemorialDates } from "@/lib/memorial-format";
import { Button } from "@/components/ui/button";
import { CandleButton } from "@/components/ui/candle-button";

interface MemorialPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: MemorialPageProps): Promise<Metadata> {
  const { id, locale } = await params;

  const memorial = await prisma.memorial.findUnique({
    where: { id },
  });

  if (!memorial) {
    return {
      title: "Не найдено | AngelBook",
      description: "Страница памяти не найдена",
    };
  }

  const name = `${memorial.firstName} ${memorial.lastName}`;
  const dates = formatMemorialDates(
    memorial.dateOfBirth,
    memorial.dateOfDeath,
    locale
  );

  const description = memorial.biography
    ? `${memorial.biography.substring(0, 160)}...`
    : `Страница памяти ${name}. ${dates}`;

  const title = `${name} — Книга памяти | AngelBook`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      firstName: memorial.firstName,
      lastName: memorial.lastName,
      images: memorial.imageUrl
        ? [
            {
              url: memorial.imageUrl,
              width: 1200,
              height: 630,
              alt: name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: memorial.imageUrl ? [memorial.imageUrl] : [],
    },
  };
}

export default async function MemorialPage({ params }: MemorialPageProps) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Memorials");

  const memorial = await prisma.memorial.findUnique({
    where: { id },
  });

  if (!memorial) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-charcoal-950 px-4">
        <h1 className="text-2xl font-light text-ivory-50">
          {t("detail.notFound")}
        </h1>
      </div>
    );
  }

  const dates = formatMemorialDates(
    memorial.dateOfBirth,
    memorial.dateOfDeath,
    locale
  );

  return (
    <main className="min-h-screen bg-charcoal-950 pb-24 pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold-500/15 bg-charcoal-900 shadow-2xl">
            {memorial.imageUrl ? (
              <Image
                src={memorial.imageUrl}
                alt={`${memorial.firstName} ${memorial.lastName}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="h-32 w-32 rounded-full border border-gold-500/20 bg-black/20 backdrop-blur-sm" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-light tracking-tight text-ivory-50 sm:text-5xl lg:text-6xl">
                {memorial.firstName} {memorial.lastName}
              </h1>
              <p className="text-xl font-light tracking-[0.1em] text-gold-500/60">
                {dates}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <CandleButton
                memorialId={memorial.id}
                initialCount={memorial.candleCount}
                buttonLabel={t("detail.lightCandle")}
                candlesLabel={t("candles")}
              />
              <Button
                variant="ghost"
                className="h-14 px-6 text-ivory-200/60 hover:text-ivory-50"
              >
                <Heart className="mr-2 h-5 w-5" />
                {/* Could add a "Follow" or "Remember" feature later */}
              </Button>
            </div>

            <div className="space-y-12 pt-8">
              <section className="space-y-4">
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold-500/40">
                  {t("detail.biography")}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg font-light leading-relaxed text-ivory-200/80">
                    {memorial.biography || "..."}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold-500/40">
                  {t("detail.epitaph")}
                </h2>
                <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 italic">
                  <p className="text-center text-xl font-light text-ivory-100/70">
                    {"..."}
                  </p>
                  <div className="absolute -left-2 -top-2 text-4xl text-gold-500/20 font-serif">
                    &ldquo;
                  </div>
                  <div className="absolute -right-2 -bottom-2 text-4xl text-gold-500/20 font-serif">
                    &rdquo;
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
