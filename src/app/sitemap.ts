import { MetadataRoute } from "next";
import { prisma } from "@/utils/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.angelbook.org";
  const locales = ["ru", "en"];
  const staticPaths = ["", "/about", "/memorials", "/missing", "/privacy", "/terms"];

  const staticUrls: MetadataRoute.Sitemap = [];

  // Generate localized static URLs
  for (const locale of locales) {
    for (const path of staticPaths) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic Memorials URLs (only approved ones)
  let dynamicMemorialUrls: MetadataRoute.Sitemap = [];
  try {
    const memorials = await prisma.memorial.findMany({
      where: { status: "APPROVED" },
      select: { id: true, updatedAt: true },
    });

    for (const memorial of memorials) {
      for (const locale of locales) {
        dynamicMemorialUrls.push({
          url: `${baseUrl}/${locale}/memorials/${memorial.id}`,
          lastModified: memorial.updatedAt,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("Error generating sitemap for memorials:", error);
  }

  return [...staticUrls, ...dynamicMemorialUrls];
}
