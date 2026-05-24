import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/manage-services/products";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET all products
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get("categorySlug");
    const subcategorySlug = url.searchParams.get("subcategorySlug");

    let filter = {};
    if (categorySlug) {
      filter = { ...filter, categorySlug };
    }
    if (subcategorySlug) {
      filter = { ...filter, subcategorySlug };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    const productsWithIds = products.map((prod) => ({
      ...prod.toObject(),
      id: prod._id.toString(),
    }));

    return NextResponse.json({ success: true, data: productsWithIds });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const {
      name,
      slug,
      categorySlug,
      subcategorySlug,
      title,
      subtitle,
      description,
      image,
      heroImage,
      overview,
      bulletList,
      features,
      securityFeatures,
      processSteps,
      pricingPlans,
      serverPlatforms,
      faqs,
      tags,
      toolSections,
      whatWeDo,
      seoTitle,
      seoDescription,
    } = body;

    const finalTitle = title || (toolSections && toolSections[0]?.title);
    const finalDescription = description || (toolSections && toolSections[0]?.description);

    if (!name || !slug || !categorySlug || !subcategorySlug || !finalTitle || !finalDescription) {
      return NextResponse.json(
        { success: false, message: "Missing required product fields" },
        { status: 400 }
      );
    }

    // Check unique slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product slug already exists" },
        { status: 400 }
      );
    }

    const sanitizedBulletList = bulletList && bulletList.heading ? bulletList : undefined;
    const sanitizedPlatforms = (serverPlatforms || []).map((block: any) => ({
      id: block.id || Date.now().toString() + Math.random().toString(),
      name: block.name || "Configuration Block",
      slug: block.slug || "config-block",
      shortDescription: block.shortDescription || "Technical specifications and setup description.",
      features: block.features || [],
      configCode: block.configCode || ""
    }));

    const newProduct = await Product.create({
      name,
      slug,
      categorySlug,
      subcategorySlug,
      title: finalTitle,
      subtitle,
      description: finalDescription,
      image,
      heroImage,
      overview,
      bulletList: sanitizedBulletList,
      features: features || [],
      securityFeatures: securityFeatures || [],
      processSteps: processSteps || [],
      pricingPlans: pricingPlans || [],
      serverPlatforms: sanitizedPlatforms,
      faqs: faqs || [],
      tags: tags || (toolSections && toolSections[0]?.tools) || [],
      toolSections: toolSections || [],
      whatWeDo: whatWeDo || [],
      seoTitle,
      seoDescription,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
