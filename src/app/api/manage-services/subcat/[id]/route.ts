import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/manage-services/subcat";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT update subcategory
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
    const { name, slug, description, categorySlug, bulletList, images } = body;

    if (!name || !slug || !categorySlug) {
      return NextResponse.json(
        { success: false, message: "Name, slug, and parent category are required" },
        { status: 400 }
      );
    }

    // Check unique slug on other documents
    const existing = await SubCategory.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Sub-category slug already exists" },
        { status: 400 }
      );
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description: description || "",
        categorySlug,
        bulletList: bulletList || { heading: "", points: [] },
        images: images || [],
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedSubCategory) {
      return NextResponse.json(
        { success: false, message: "Sub-category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSubCategory });
  } catch (error: any) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

// DELETE subcategory
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return NextResponse.json(
        { success: false, message: "Sub-category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sub-category deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
