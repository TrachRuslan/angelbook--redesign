import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
        <h1 className="mb-6 text-3xl font-light text-ivory-50 sm:text-4xl">
          Политика конфиденциальности
        </h1>
        <div className="space-y-6 text-sm font-light leading-relaxed text-ivory-200/70">
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональной информации пользователей сервиса AngelBook.
          </p>

          <h2 className="text-lg font-medium text-gold-400">1. Сбор информации</h2>
          <p>
            Мы собираем минимально необходимый объем данных для обеспечения функционирования сервиса: адрес электронной почты, информацию для авторизации и данные, добровольно вносимые при создании мемориальных страниц или объявлений о поиске.
          </p>

          <h2 className="text-lg font-medium text-gold-400">2. Защита данных</h2>
          <p>
            Все персональные данные защищены с использованием современных стандартов шифрования и строгой политики доступа (Row Level Security). Мы не передаем личные данные третьим лицам.
          </p>

          <h2 className="text-lg font-medium text-gold-400">3. Права пользователей</h2>
          <p>
            Вы имеете полное право редактировать или удалять созданные вами страницы памяти в любое время через свой личный кабинет.
          </p>
        </div>
      </div>
    </main>
  );
}
