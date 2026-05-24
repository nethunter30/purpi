import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/manage-services/subcat";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET all subcategories
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get("categorySlug");
    
    let filter = {};
    if (categorySlug) {
      filter = { categorySlug };
    }

    const subcategories = await SubCategory.find(filter).sort({ createdAt: -1 });

    const subcatsWithIds = subcategories.map((sub) => ({
      ...sub.toObject(),
      id: sub._id.toString(),
    }));

    return NextResponse.json({ success: true, data: subcatsWithIds });
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

// POST create subcategory
export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { name, slug, categorySlug, bulletList, faqs, images } = body;

    if (!name || !slug || !categorySlug) {
      return NextResponse.json(
        { success: false, message: "Name, slug, and parent category are required" },
        { status: 400 }
      );
    }

    // Check unique slug
    const existing = await SubCategory.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Sub-category slug already exists" },
        { status: 400 }
      );
    }

    const newSubCategory = await SubCategory.create({
      name,
      slug,
      categorySlug,
      bulletList: bulletList || { heading: "", points: [] },
      faqs: faqs || [],
      images: images || [],
    });

    return NextResponse.json({ success: true, data: newSubCategory }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create subcategory" },
      { status: 500 }
    );
  }
}
