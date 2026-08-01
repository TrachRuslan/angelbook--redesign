import { setRequestLocale, getTranslations } from "next-intl/server";
import { AngelLogo } from "@/components/ui/logo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("title"),
    description: t("p1"),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <AngelLogo className="h-20 w-20" />
          <div>
            <h1 className="text-3xl font-light text-ivory-50 sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-sm text-gold-400 font-light mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm font-light leading-relaxed text-ivory-200/70">
          <p>
            {t("p1")}
          </p>
          <p>
            {t("p2")}
          </p>
          <p>
            {t("p3")}
          </p>
        </div>
      </div>
    </main>
  );
}
