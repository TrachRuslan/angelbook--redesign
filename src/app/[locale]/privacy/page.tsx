import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
        <h1 className="mb-6 text-3xl font-light text-ivory-50 sm:text-4xl">
          {t("title")}
        </h1>
        <div className="space-y-6 text-sm font-light leading-relaxed text-ivory-200/70">
          <p>
            {t("description")}
          </p>

          <h2 className="text-lg font-medium text-gold-400">{t("h1")}</h2>
          <p>
            {t("p1")}
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>{t("li1")}</li>
            <li>{t("li2")}</li>
            <li>{t("li3")}</li>
          </ul>

          <h2 className="text-lg font-medium text-gold-400">{t("h2")}</h2>
          <p>
            {t("p2")}
          </p>

          <h2 className="text-lg font-medium text-gold-400">{t("h3")}</h2>
          <p>
            {t("p3")}
          </p>

          <h2 className="text-lg font-medium text-gold-400">{t("h4")}</h2>
          <p>
            {t("p4")}
          </p>
        </div>
      </div>
    </main>
  );
}
