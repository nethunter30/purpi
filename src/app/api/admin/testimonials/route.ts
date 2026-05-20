import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all testimonials for the admin, regardless of status
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    console.error("Error fetching admin testimonials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
