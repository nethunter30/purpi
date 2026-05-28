import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/services/Product";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");
    if (!product)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("❌ Error in GET /api/services/products/[id]:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
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
    const { name, slug, description, image, isActive, category, subcategory, sections } = body;

    // Allow partial update (e.g. only toggling isActive)
    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name;
    if (slug !== undefined) {
      // Check slug uniqueness (exclude self)
      const conflict = await Product.findOne({ slug, _id: { $ne: id } });
      if (conflict)
        return NextResponse.json(
          { success: false, message: "A product with this slug already exists" },
          { status: 400 }
        );
      updateFields.slug = slug;
    }
    if (description !== undefined) updateFields.description = description;
    if (image !== undefined) updateFields.image = image || "";
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (category !== undefined) updateFields.category = category;
    if (subcategory !== undefined) updateFields.subcategory = subcategory;
    if (sections !== undefined) updateFields.sections = sections;

    const updated = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!updated)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product updated", data: updated });
  } catch (error: any) {
    console.error("❌ Error in PUT /api/services/products/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update product" },
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
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in DELETE /api/services/products/[id]:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
