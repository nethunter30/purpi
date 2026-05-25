import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import CaseStudy from "@/models/CaseStudy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://enteropia.com";

  // 1. Core Pages URLs
  const staticUrls = [
    "",
    "/about-us",
    "/blog",
    "/our-work",
    "/services"
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8
  }));

  // 2. Blog Post Detail URLs
  let blogUrls: { url: string; lastModified: Date; changeFrequency: "weekly"; priority: number }[] = [];
  try {
    await dbConnect();
    const posts = await BlogPost.find({ isActive: true });
    blogUrls = posts.map(post => {
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
  } catch (error) {
    console.error("Error generating sitemap blog URLs:", error);
  }

  // 3. Case Study / Work Detail URLs
  let workUrls: { url: string; lastModified: Date; changeFrequency: "weekly"; priority: number }[] = [];
  try {
    await dbConnect();
    const studies = await CaseStudy.find({ isActive: true });
    workUrls = studies.map(study => ({
      url: `${baseUrl}/our-work/${study.id}`,
      lastModified: study.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));
  } catch (error) {
    console.error("Error generating sitemap work URLs:", error);
  }

  return [...staticUrls, ...blogUrls, ...workUrls];
}
