import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import CaseStudy from "@/models/CaseStudy";
import Category from "@/models/services/Category";
import Subcategory from "@/models/services/Subcategory";
import Product from "@/models/services/Product";

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
  let serviceCategoryUrls: MetadataRoute.Sitemap = [];
  let serviceSubcategoryUrls: MetadataRoute.Sitemap = [];
  let serviceProductUrls: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    
    const [posts, studies, categories, subcategories, products] = await Promise.all([
      BlogPost.find({ isActive: true }),
      CaseStudy.find({ isActive: true }),
      Category.find({ isActive: true }),
      Subcategory.find({ isActive: true }).populate("category"),
      Product.find({ isActive: true }).populate("category").populate("subcategory"),
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

    // 4. Service Category URLs
    serviceCategoryUrls = categories.map(cat => ({
      url: `${baseUrl}/services/${cat.slug}`,
      lastModified: (cat as any).updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));

    // 5. Service Subcategory URLs
    serviceSubcategoryUrls = subcategories
      .filter(sub => {
        const cat = sub.category as any;
        return cat && cat.isActive;
      })
      .map(sub => {
        const cat = sub.category as any;
        return {
          url: `${baseUrl}/services/${cat.slug}/${sub.slug}`,
          lastModified: (sub as any).updatedAt || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7
        };
      });

    // 6. Service Product Detail URLs
    serviceProductUrls = products
      .filter(p => {
        const cat = p.category as any;
        const sub = p.subcategory as any;
        return cat && cat.isActive && sub && sub.isActive;
      })
      .map(p => {
        const cat = p.category as any;
        const sub = p.subcategory as any;
        return {
          url: `${baseUrl}/services/${cat.slug}/${sub.slug}/${p.slug}`,
          lastModified: (p as any).updatedAt || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6
        };
      });

  } catch (error) {
    console.error("Error generating sitemap URLs:", error);
  }

  return [
    ...staticUrls,
    ...blogUrls,
    ...workUrls,
    ...serviceCategoryUrls,
    ...serviceSubcategoryUrls,
    ...serviceProductUrls,
  ];
}
