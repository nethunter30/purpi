import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogData";
import { caseStudies } from "@/lib/caseStudiesData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://enteropia.com";

  // 1. Core Pages URLs
  const staticUrls = [
    "",
    "/about-us",
    "/blog",
    "/our-work",
    "/services",
    "/services/software-solutions",
    "/services/cloud-infrastructure",
    "/services/ai-machine-learning",
    "/services/app-solutions",
    "/services/networking-and-secure-solutions",
    "/services/digital-solutions-media"
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  // 2. Blog Post Detail URLs
  const blogUrls = blogPosts.map(post => {
    let lastMod = new Date();
    try {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        lastMod = parsed;
      }
    } catch (e) {}
    
    return {
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.6
    };
  });

  // 3. Case Study / Work Detail URLs
  const workUrls = caseStudies.map(study => ({
    url: `${baseUrl}/our-work/${study.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [...staticUrls, ...blogUrls, ...workUrls];
}
