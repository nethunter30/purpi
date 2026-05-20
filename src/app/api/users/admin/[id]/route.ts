import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/users/User";

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
    const { name, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, message: "Name and User ID are required" },
        { status: 400 }
      );
    }

    // Check if another user has the same userId (case-insensitive)
    const safeUserId = userId.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const existingUser = await User.findOne({
      userId: { $regex: new RegExp(`^${safeUserId}$`, "i") },
      _id: { $ne: id }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User ID already exists for another user" },
        { status: 409 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, userId },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
