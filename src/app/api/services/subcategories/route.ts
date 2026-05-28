import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subcategory from "@/models/services/Subcategory";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const categoryId = searchParams.get("category");

    const filter: Record<string, any> = showAll ? {} : { isActive: true };
    if (categoryId) filter.category = categoryId;

    const subcategories = await Subcategory.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: subcategories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch subcategories" },
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
    const { name, slug, description, image, isActive, category } = body;

    if (!name || !slug || !description || !category)
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, slug, description, category" },
        { status: 400 }
      );

    const exists = await Subcategory.findOne({ slug });
    if (exists)
      return NextResponse.json(
        { success: false, message: "A subcategory with this slug already exists" },
        { status: 400 }
      );

    const subcategory = await Subcategory.create({
      name,
      slug,
      description,
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
      category,
    });

    const populated = await subcategory.populate("category", "name slug");

    return NextResponse.json(
      { success: true, message: "Subcategory created successfully", data: populated },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create subcategory" },
      { status: 500 }
    );
  }
}
