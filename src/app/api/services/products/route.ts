import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/services/Product";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const categoryId = searchParams.get("category");
    const subcategoryId = searchParams.get("subcategory");

    const filter: Record<string, any> = showAll ? {} : { isActive: true };
    if (categoryId) filter.category = categoryId;
    if (subcategoryId) filter.subcategory = subcategoryId;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const adminUser = await isAuthenticated();
    if (!adminUser)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, slug, description, image, isActive, category, subcategory, sections } = body;

    if (!name || !slug || !description || !category || !subcategory || !sections)
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, slug, description, category, subcategory, sections" },
        { status: 400 }
      );

    if (!sections.productDetails?.title || !sections.productDetails?.description)
      return NextResponse.json(
        { success: false, message: "sections.productDetails.title and .description are required" },
        { status: 400 }
      );

    const exists = await Product.findOne({ slug });
    if (exists)
      return NextResponse.json(
        { success: false, message: "A product with this slug already exists" },
        { status: 400 }
      );

    const product = await Product.create({
      name,
      slug,
      description,
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
      category,
      subcategory,
      sections,
    });

    const populated = await product.populate([
      { path: "category", select: "name slug" },
      { path: "subcategory", select: "name slug" },
    ]);

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: populated },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
