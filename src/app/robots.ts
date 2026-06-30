import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://enteropia.com";

  return {
    rules: [
      {
        // 1. Block AI Training & Scraper bots (models that ingest data without traffic referrals)
        userAgent: ["GPTBot", "ClaudeBot", "CCBot", "Applebot-Extended"],
        disallow: "/",
      },
      {
        // 2. Explicitly allow AI Search/Citation bots (which index pages to answer and cite with links)
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Claude-Web",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        // 3. Default rules for all other search engine bots
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
