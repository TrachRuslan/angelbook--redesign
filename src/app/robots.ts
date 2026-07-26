import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.angelbook.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/memorials", "/missing", "/privacy", "/terms", "/ru*", "/en*"],
        disallow: [
          "/admin",
          "/*/admin",
          "/cabinet",
          "/*/cabinet",
          "/api/",
          "/auth/",
          "/*/login",
          "/*/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
