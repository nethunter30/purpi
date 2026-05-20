import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/users/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user exists in our database (case-insensitive)
    const safeUserId = userId.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const user = await User.findOne({
      userId: { $regex: new RegExp(`^${safeUserId}$`, "i") }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID. Please use a valid generated ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User validated successfully",
      data: { name: user.name, userId: user.userId }
    });
  } catch (error: any) {
    console.error("Error validating user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while validating the user." },
      { status: 500 }
    );
  }
}
