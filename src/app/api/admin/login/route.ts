import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Admin from "@/models/admin/Admin";
import { generateToken, setAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });

    // Set cookie
    await setAuthToken(token);

    // Force Next.js to revalidate the admin routes
    revalidatePath("/admin", "layout");

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}