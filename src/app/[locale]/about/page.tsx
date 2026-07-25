import { setRequestLocale } from "next-intl/server";
import { AngelLogo } from "@/components/ui/logo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <AngelLogo className="h-20 w-20" />
          <div>
            <h1 className="text-3xl font-light text-ivory-50 sm:text-4xl">
              О проекте AngelBook
            </h1>
            <p className="text-sm text-gold-400 font-light mt-1">
              Место, где живет память
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm font-light leading-relaxed text-ivory-200/70">
          <p>
            <strong>AngelBook</strong> — это современная онлайн-платформа, созданная для бережного сохранения памяти о близких людях и эффективного поиска без вести пропавших.
          </p>
          <p>
            Наша миссия — дать каждому человеку возможность создать светлый, достойный виртуальный мемориал, зажечь виртуальную свечу памяти, а также объединить усилия сообщества для поиска тех, кто попал в беду.
          </p>
          <p>
            Платформа разработана с заботой о конфиденциальности, высокими стандартами безопасности и эстетики.
          </p>
        </div>
      </div>
    </main>
  );
}
