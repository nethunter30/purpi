import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/services/Category";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category)
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const adminUser = await isAuthenticated();
    if (!adminUser)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, image, isActive } = body;

    if (!name || !slug || !description)
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, slug, description" },
        { status: 400 }
      );

    // Check slug uniqueness (exclude self)
    const conflict = await Category.findOne({ slug, _id: { $ne: id } });
    if (conflict)
      return NextResponse.json(
        { success: false, message: "A category with this slug already exists" },
        { status: 400 }
      );

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, image: image || "", isActive },
      { new: true, runValidators: true }
    );

    if (!updated)
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category updated", data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const adminUser = await isAuthenticated();
    if (!adminUser)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to delete category" }, { status: 500 });
  }
}
