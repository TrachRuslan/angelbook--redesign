import type { Memorial } from "@prisma/client";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/utils/prisma";
import { MemorialsView } from "./memorials-view";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Книги памяти",
  description: "Список виртуальных мемориалов памяти. Сохраняйте воспоминания, зажигайте свечи и помните близких.",
};

export default async function MemorialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const memorials = await prisma.memorial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return <MemorialsView memorials={memorials} />;
}

export type MemorialRecord = Memorial;
