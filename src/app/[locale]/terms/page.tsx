import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
        <h1 className="mb-6 text-3xl font-light text-ivory-50 sm:text-4xl">
          Условия использования
        </h1>
        <div className="space-y-6 text-sm font-light leading-relaxed text-ivory-200/70">
          <p>
            Добро пожаловать в AngelBook. Используя наш сервис, вы соглашаетесь со следующими условиями.
          </p>

          <h2 className="text-lg font-medium text-gold-400">1. Обязанности пользователя</h2>
          <p>
            Пользователи обязуются предоставлять достоверную информацию при создании страниц памяти и объявлений о поиске, а также воздерживаться от публикации оскорбительного или противоправного контента.
          </p>

          <h2 className="text-lg font-medium text-gold-400">2. Авторские права и права на контент</h2>
          <p>
            Вы сохраняете права на все загружаемые вами фотографии и тексты. Публикуя контент, вы предоставляете AngelBook лицензию на его отображение в рамках сервиса.
          </p>

          <h2 className="text-lg font-medium text-gold-400">3. Модерация и ответственность</h2>
          <p>
            Администрация оставляет за собой право удалять материалы, нарушающие правила платформы или законодательство.
          </p>
        </div>
      </div>
    </main>
  );
}
