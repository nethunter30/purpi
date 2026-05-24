import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/manage-services/categories";
import SubCategory from "@/models/manage-services/subcat";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    // We can also fetch subcategories count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const subCount = await SubCategory.countDocuments({ categorySlug: cat.slug });
        return {
          ...cat.toObject(),
          id: cat._id.toString(),
          subcategoriesCount: subCount,
        };
      })
    );

    return NextResponse.json({ success: true, data: categoriesWithCounts });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { name, slug, image, faqs } = body;

    if (!name || !slug || !image) {
      return NextResponse.json(
        { success: false, message: "Name, slug, and image are required" },
        { status: 400 }
      );
    }

    // Check unique slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({ name, slug, image, faqs: faqs || [] });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
