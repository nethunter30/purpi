import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/manage-services/categories";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT update category
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
    const { name, slug, image, faqs } = body;

    if (!name || !slug || !image) {
      return NextResponse.json(
        { success: false, message: "Name, slug, and image are required" },
        { status: 400 }
      );
    }

    // Check unique slug on other documents
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, image, faqs: faqs || [] },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
