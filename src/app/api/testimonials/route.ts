import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import User from "@/models/users/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Only fetch approved testimonials for the public UI
    const testimonials = await Testimonial.find({ status: "approved" }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, role, text, userId, stars } = body;

    if (!name || !role || !text || !userId || !stars) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Double check that the user ID is valid (case-insensitive)
    const safeUserId = userId.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const validUser = await User.findOne({
      userId: { $regex: new RegExp(`^${safeUserId}$`, "i") }
    });
    if (!validUser) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID." },
        { status: 404 }
      );
    }

    const newTestimonial = await Testimonial.create({
      name,
      role,
      text,
      userId,
      stars,
      status: "pending", // Always defaults to pending
    });

    return NextResponse.json(
      { success: true, message: "Testimonial submitted successfully and is pending approval", data: newTestimonial },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
