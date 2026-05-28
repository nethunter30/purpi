import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    const { name, role, image, bgColor, order, isActive, linkedin, github, twitter, instagram } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, message: "Name and role are required fields" },
        { status: 400 }
      );
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      {
        name,
        role,
        image: image !== undefined ? image : "",
        bgColor: bgColor || "#8a35e5",
        order: order !== undefined ? order : 0,
        isActive: isActive !== undefined ? isActive : true,
        linkedin: linkedin !== undefined ? linkedin : "",
        github: github !== undefined ? github : "",
        twitter: twitter !== undefined ? twitter : "",
        instagram: instagram !== undefined ? instagram : "",
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json(
        { success: false, message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedMember = await TeamMember.findByIdAndDelete(id);

    if (!deletedMember) {
      return NextResponse.json(
        { success: false, message: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete team member" },
      { status: 500 }
    );
  }
}
