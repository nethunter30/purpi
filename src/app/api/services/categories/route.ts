import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import { isAuthenticated } from "@/lib/auth";

// Cache GET responses for 60s; POST/PUT/DELETE bypass cache automatically
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const filter = showAll ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("❌ Error in GET /api/services/categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
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
    const { name, slug, description, image, isActive, order } = body;

    if (!name || !slug || !description)
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, slug, description" },
        { status: 400 }
      );

    const exists = await Category.findOne({ slug });
    if (exists)
      return NextResponse.json(
        { success: false, message: "A category with this slug already exists" },
        { status: 400 }
      );

    const category = await Category.create({
      name,
      slug,
      description,
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? Number(order) : 0,
    });

    return NextResponse.json(
      { success: true, message: "Category created successfully", data: category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error in POST /api/services/categories:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
