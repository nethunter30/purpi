import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Industry from "@/models/Industry";
import { isAuthenticated } from "@/lib/auth";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
    const ind = await Industry.findOne(query);

    if (!ind) {
      return NextResponse.json(
        { success: false, message: "Industry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ind });
  } catch (error: any) {
    console.error("Error fetching industry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch industry" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();

    const { title, description, iconName, link, isActive } = body;

    if (!title || !description || !iconName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };

    const updateFields: any = {
      title,
      description,
      iconName,
      link: link || "/solutions",
      isActive: isActive !== undefined ? isActive : true,
    };

    if (body.id) {
      const cleanId = body.id.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const currentRecord = await Industry.findOne(query);
      if (!currentRecord) {
        return NextResponse.json(
          { success: false, message: "Industry not found" },
          { status: 404 }
        );
      }
      const conflict = await Industry.findOne({
        id: cleanId,
        _id: { $ne: currentRecord._id },
      });
      if (conflict) {
        return NextResponse.json(
          { success: false, message: "An industry with this slug already exists" },
          { status: 400 }
        );
      }
      updateFields.id = cleanId;
    }

    const updated = await Industry.findOneAndUpdate(query, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Industry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Industry updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating industry:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update industry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
    const deleted = await Industry.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Industry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Industry deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting industry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete industry" },
      { status: 500 }
    );
  }
}
