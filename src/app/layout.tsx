import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AngelBook",
    default: "AngelBook — Электронная книга памяти",
  },
  description: "Электронная книга памяти и поиск пропавших без вести. Сохраните истории жизни близких, зажигайте свечи памяти и помогайте находить пропавших людей.",
  keywords: [
    "AngelBook",
    "angel book",
    "ангелбук",
    "ангел бук",
    "книга пам'яті",
    "книга памяти",
    "онлайн меморіал",
    "онлайн мемориал",
    "електронний меморіал",
    "электронный мемориал",
    "пошук зниклих безвісти",
    "поиск пропавших без вести",
    "пошук людей",
    "поиск людей",
    "віртуальний меморіал",
    "виртуальный мемориал",
    "свічка пам'яті",
    "свеча памяти",
    "запалити свічку онлайн",
    "зажечь свечу онлайн",
    "історія життя близких",
    "история жизни близких",
    "remember loved ones",
    "online memorial book",
    "missing persons database",
    "search for missing relatives",
    "memorial page generator",
    "создать страницу памяти",
    "створити сторінку пам'яті",
    "база даних зниклих",
    "база данных пропавших"
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://angelbook.net",
    title: "AngelBook — Электронная книга памяти",
    description: "Электронная книга памяти и поиск пропавших без вести. Сохраните истории жизни близких, зажигайте свечи памяти и помогайте находить пропавших людей.",
    siteName: "AngelBook",
  },
  twitter: {
    card: "summary_large_image",
    title: "AngelBook — Электронная книга памяти",
    description: "Электронная книга памяти и поиск пропавших без вести. Сохраните истории жизни близких, зажигайте свечи памяти и помогайте находить пропавших людей.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-0L7ZELCZZ7"} />
        <SpeedInsights />
      </body>
    </html>
  );
}
