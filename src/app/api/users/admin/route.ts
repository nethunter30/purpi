import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/users/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Fetch all users sorted by latest
    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, message: "Name and User ID are required" },
        { status: 400 }
      );
    }

    // Check if user already exists (case-insensitive)
    const safeUserId = userId.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const existingUser = await User.findOne({
      userId: { $regex: new RegExp(`^${safeUserId}$`, "i") }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User ID already exists" },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name,
      userId,
    });

    return NextResponse.json(
      { success: true, message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
