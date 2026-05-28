import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subcategory from "@/models/services/Subcategory";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const subcategory = await Subcategory.findById(id).populate("category", "name slug");
    if (!subcategory)
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: subcategory });
  } catch (error: any) {
    console.error("❌ Error in GET /api/services/subcategories/[id]:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch subcategory" }, { status: 500 });
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
    const { name, slug, description, image, isActive, category } = body;

    if (!name || !slug || !description || !category)
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, slug, description, category" },
        { status: 400 }
      );

    // Check slug uniqueness (exclude self)
    const conflict = await Subcategory.findOne({ slug, _id: { $ne: id } });
    if (conflict)
      return NextResponse.json(
        { success: false, message: "A subcategory with this slug already exists" },
        { status: 400 }
      );

    const updated = await Subcategory.findByIdAndUpdate(
      id,
      { name, slug, description, image: image || "", isActive, category },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!updated)
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Subcategory updated", data: updated });
  } catch (error: any) {
    console.error("❌ Error in PUT /api/services/subcategories/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subcategory" },
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
    const deleted = await Subcategory.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in DELETE /api/services/subcategories/[id]:", error);
    return NextResponse.json({ success: false, message: "Failed to delete subcategory" }, { status: 500 });
  }
}
