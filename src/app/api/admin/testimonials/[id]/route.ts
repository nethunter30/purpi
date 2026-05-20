import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";

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
    const { status } = body;

    if (!status || !["pending", "approved"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Valid status ('pending' or 'approved') is required" },
        { status: 400 }
      );
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Testimonial ${status === "approved" ? "approved" : "updated"} successfully`,
      data: updatedTestimonial,
    });
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
