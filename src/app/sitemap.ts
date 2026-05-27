import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import CaseStudy from "@/models/CaseStudy";
import CategoryModel from "@/models/manage-services/categories";
import SubCategoryModel from "@/models/manage-services/subcat";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://enteropia.com";

  // 1. Core Pages URLs
  const staticUrls = [
    { route: "", changeFrequency: "daily" as const, priority: 1.0 },
    { route: "/about-us", changeFrequency: "monthly" as const, priority: 0.8 },
    { route: "/blog", changeFrequency: "daily" as const, priority: 0.8 },
    { route: "/our-work", changeFrequency: "weekly" as const, priority: 0.8 },
    { route: "/services", changeFrequency: "daily" as const, priority: 0.8 },
    { route: "/industries", changeFrequency: "weekly" as const, priority: 0.8 },
    { route: "/solutions", changeFrequency: "weekly" as const, priority: 0.8 },
    { route: "/privacy-policy", changeFrequency: "monthly" as const, priority: 0.3 },
    { route: "/terms", changeFrequency: "monthly" as const, priority: 0.3 }
  ].map(({ route, changeFrequency, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority
  }));

  // Fetch all dynamic data
  let blogUrls: MetadataRoute.Sitemap = [];
  let workUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];
  let subcategoryUrls: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    
    const [posts, studies, categories, subcategories] = await Promise.all([
      BlogPost.find({ isActive: true }),
      CaseStudy.find({ isActive: true }),
      CategoryModel.find({}),
      SubCategoryModel.find({})
    ]);

    // 2. Blog Post Detail URLs
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

    // 3. Case Study / Work Detail URLs
    workUrls = studies.map(study => ({
      url: `${baseUrl}/our-work/${study.id}`,
      lastModified: study.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

    // 4. Services Category URLs
    categoryUrls = categories.map(cat => ({
      url: `${baseUrl}/services/${cat.slug}`,
      lastModified: cat.get("updatedAt") || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8
    }));

    // 5. Services Subcategory/Subservices Detail URLs
    subcategoryUrls = subcategories.map(sub => ({
      url: `${baseUrl}/services/${sub.categorySlug}/${sub.slug}`,
      lastModified: sub.get("updatedAt") || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

  } catch (error) {
    console.error("Error generating sitemap URLs:", error);
  }

  return [
    ...staticUrls,
    ...blogUrls,
    ...workUrls,
    ...categoryUrls,
    ...subcategoryUrls
  ];
}
