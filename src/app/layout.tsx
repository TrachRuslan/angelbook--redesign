import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
      </body>
    </html>
  );
}
