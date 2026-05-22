import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
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
    "/services"
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

  // 4. Service Detail URLs (Dynamic from DB)
  let serviceUrls: any[] = [];
  try {
    await dbConnect();
    const services = await Service.find({}, "slug updatedAt").lean();
    serviceUrls = services.map((service: any) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.updatedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
  } catch (error) {
    console.error("Failed to generate services sitemap dynamic routes:", error);
  }

  return [...staticUrls, ...blogUrls, ...workUrls, ...serviceUrls];
}
