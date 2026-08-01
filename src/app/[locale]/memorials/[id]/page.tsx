import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Heart, Send, Facebook } from "lucide-react";
import { prisma } from "@/utils/prisma";
import { formatMemorialDates } from "@/lib/memorial-format";
import { Button } from "@/components/ui/button";
import { CandleButton } from "@/components/ui/candle-button";
import { QrPrintButton } from "@/components/ui/qr-print-button";
import { PrintPdfButton } from "@/components/ui/print-pdf-button";
import { MemorialThemeWrapper } from "@/components/ui/memorial-theme-wrapper";
import { cn } from "@/lib/utils";

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.angelbook.org";
  const shareUrl = `${baseUrl}/${locale}/memorials/${memorial.id}`;
  const shareText = `${memorial.firstName} ${memorial.lastName} — Книга памяти`;
  const theme = memorial.theme || "CLASSIC";

  return (
    <>
      <MemorialThemeWrapper
        theme={theme}
        photoNode={
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold-500/15 bg-charcoal-900 shadow-2xl transition-all duration-500">
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
        }
        infoNode={
          <>
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
              <QrPrintButton
                pageUrl={shareUrl}
                fullName={`${memorial.firstName} ${memorial.lastName}`}
                dates={dates}
                imageUrl={memorial.imageUrl}
              />
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-light text-ivory-200/80 transition-all duration-300 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-300 gap-2"
              >
                <Send className="h-4 w-4 text-sky-400" />
                <span>Telegram</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-light text-ivory-200/80 transition-all duration-300 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-300 gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-500" />
                <span>Facebook</span>
              </a>
              <PrintPdfButton label={t("detail.printPdf")} />
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

              {memorial.epitaph && (
                <section className="space-y-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold-500/40">
                    {t("detail.epitaph")}
                  </h2>
                  <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 italic">
                    <p className="text-center text-xl font-light text-ivory-100/70">
                      {memorial.epitaph}
                    </p>
                    <div className="absolute -left-2 -top-2 text-4xl text-gold-500/20 font-serif">
                      &ldquo;
                    </div>
                    <div className="absolute -right-2 -bottom-2 text-4xl text-gold-500/20 font-serif">
                      &rdquo;
                    </div>
                  </div>
                </section>
              )}
            </div>
          </>
        }
      />

      {/* Hidden PDF/Print Layout */}
      <div className="hidden print-layout text-stone-900 bg-white p-12 min-h-screen flex flex-col justify-between" style={{ display: "none" }}>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-3xl font-serif tracking-[0.1em] text-stone-800">AngelBook</div>
          <div className="text-xs uppercase tracking-[0.25em] text-stone-500 border-b border-stone-200 pb-2 w-48">
            {locale === "uk" ? "КНИГА ПАМ'ЯТІ" : locale === "ru" ? "КНИГА ПАМЯТИ" : "BOOK OF MEMORY"}
          </div>

          {memorial.imageUrl ? (
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-stone-200 shadow-sm mt-4">
              <img
                src={memorial.imageUrl}
                alt={`${memorial.firstName} ${memorial.lastName}`}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div className="h-64 w-64 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center mt-4">
              <div className="h-16 w-16 rounded-full border border-stone-300 bg-white" />
            </div>
          )}

          <h2 className="text-4xl font-serif font-light text-stone-900 mt-6">
            {memorial.firstName} {memorial.lastName}
          </h2>
          <p className="text-lg font-light text-stone-600 tracking-wide">{dates}</p>

          <div className="flex items-center gap-2 text-stone-500 text-sm mt-2">
            <span>
              {memorial.candleCount} {t("candles")}
            </span>
          </div>

          {memorial.epitaph && (
            <div className="relative max-w-xl mx-auto rounded-2xl bg-stone-50 border border-stone-100 p-6 italic text-stone-700 text-center my-6">
              <p className="text-lg font-light leading-relaxed">&ldquo;{memorial.epitaph}&rdquo;</p>
            </div>
          )}

          <div className="max-w-2xl text-left text-stone-800 font-light leading-relaxed text-base pt-6 border-t border-stone-100 whitespace-pre-wrap">
            {memorial.biography || "..."}
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 pt-12 border-t border-stone-100 mt-12">
          <div className="border border-stone-200 p-3 rounded-2xl bg-white shadow-sm">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&bgcolor=ffffff&data=${encodeURIComponent(shareUrl)}`}
              alt="QR Code"
              className="h-32 w-32 object-contain"
            />
          </div>
          <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
            {locale === "uk"
              ? "Відскануйте QR-код, щоб перейти на сторінку пам'яті, запалити віртуальну свічку або залишити спогад."
              : locale === "ru"
              ? "Отсканируйте QR-код, чтобы перейти на страницу памяти, зажечь виртуальную свечу или оставить воспоминание."
              : "Scan the QR code to visit the memorial page, light a virtual candle, or leave a memory."}
          </p>
        </div>
      </div>

      {/* Print Specific CSS Style Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              .print-layout,
              .print-layout * {
                visibility: visible !important;
              }
              .print-layout {
                display: flex !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: white !important;
                color: #1c1917 !important;
                padding: 40px !important;
                box-sizing: border-box !important;
              }
              main, header, footer, #header, #footer {
                display: none !important;
              }
            }
          `,
        }}
      />
    </>
  );
}
