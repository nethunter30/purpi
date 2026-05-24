import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/manage-services/products";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET single product
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product.toObject(),
        id: product._id.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
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

    // Check unique slug on other documents
    const existing = await Product.findOne({ slug, _id: { $ne: id } });
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

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
