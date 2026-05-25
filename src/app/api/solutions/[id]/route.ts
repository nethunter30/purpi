import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";
import { isAuthenticated } from "@/lib/auth";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Support searching by Mongo _id OR by slug id
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
    const solution = await Solution.findOne(query);

    if (!solution) {
      return NextResponse.json(
        { success: false, message: "Solution package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: solution });
  } catch (error: any) {
    console.error("Error fetching solution package:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch solution package" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    // Authentication check
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
      title,
      description,
      image,
      iconName,
      features,
      startingPrice,
      learnMoreUrl,
      isActive,
    } = body;

    if (!title || !description || !image || !iconName || !startingPrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };

    // Build update payload
    const updateFields: any = {
      title,
      description,
      image,
      iconName,
      features: features || [],
      startingPrice,
      learnMoreUrl: learnMoreUrl || "/#contact",
      isActive: isActive !== undefined ? isActive : true,
    };

    if (body.id) {
      const cleanId = body.id.toLowerCase().trim().replace(/\s+/g, "-");

      // Conflict checks
      const currentRecord = await Solution.findOne(query);
      if (!currentRecord) {
        return NextResponse.json(
          { success: false, message: "Solution package not found" },
          { status: 404 }
        );
      }

      const conflict = await Solution.findOne({
        id: cleanId,
        _id: { $ne: currentRecord._id },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, message: "A solution package with this slug already exists" },
          { status: 400 }
        );
      }

      updateFields.id = cleanId;
    }

    const updatedSolution = await Solution.findOneAndUpdate(query, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedSolution) {
      return NextResponse.json(
        { success: false, message: "Solution package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solution package updated successfully",
      data: updatedSolution,
    });
  } catch (error: any) {
    console.error("Error updating solution package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update solution package" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    // Authentication check
    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
    const deletedSolution = await Solution.findOneAndDelete(query);

    if (!deletedSolution) {
      return NextResponse.json(
        { success: false, message: "Solution package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Solution package deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting solution package:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete solution package" },
      { status: 500 }
    );
  }
}
