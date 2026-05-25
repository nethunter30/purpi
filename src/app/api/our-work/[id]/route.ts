import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
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
    const study = await CaseStudy.findOne(query);

    if (!study) {
      return NextResponse.json(
        { success: false, message: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: study });
  } catch (error: any) {
    console.error("Error fetching case study:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case study" },
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

    const {
      title, client, category, subCategory,
      description, challenge, solution, impact, impactLabel,
      image, techStack, results, milestones, isActive,
    } = body;

    if (
      !title || !client || !category || !subCategory ||
      !description || !challenge || !solution || !impact || !impactLabel || !image
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };

    const updateFields: any = {
      title, client, category, subCategory,
      description, challenge, solution, impact, impactLabel,
      image,
      techStack: techStack || [],
      results: results || [],
      milestones: milestones || [],
      isActive: isActive !== undefined ? isActive : true,
    };

    if (body.id) {
      const cleanId = body.id.toLowerCase().trim().replace(/\s+/g, "-");
      const currentRecord = await CaseStudy.findOne(query);
      if (!currentRecord) {
        return NextResponse.json(
          { success: false, message: "Case study not found" },
          { status: 404 }
        );
      }
      const conflict = await CaseStudy.findOne({
        id: cleanId,
        _id: { $ne: currentRecord._id },
      });
      if (conflict) {
        return NextResponse.json(
          { success: false, message: "A case study with this slug already exists" },
          { status: 400 }
        );
      }
      updateFields.id = cleanId;
    }

    const updated = await CaseStudy.findOneAndUpdate(query, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Case study updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating case study:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update case study" },
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
    const deleted = await CaseStudy.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Case study deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete case study" },
      { status: 500 }
    );
  }
}
