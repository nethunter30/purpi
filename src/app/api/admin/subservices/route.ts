import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubService from "@/models/SubService";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Optional filtering by parent serviceId
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    
    const query = serviceId ? { serviceId } : {};

    const subservices = await SubService.find(query)
      .populate("serviceId", "title slug")
      .sort({ order: 1, createdAt: 1 });
      
    return NextResponse.json({ success: true, data: subservices });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch sub-services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { serviceId, title, description, whatWeOffer, benefits, order } = body;

    if (!serviceId || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Service ID, title, and description are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug is unique
    const existing = await SubService.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A sub-service with a similar title already exists." },
        { status: 400 }
      );
    }

    const subservice = await SubService.create({
      serviceId,
      title,
      slug,
      description,
      whatWeOffer: whatWeOffer || [],
      benefits: benefits || [],
      order: order || 0,
    });

    return NextResponse.json(
      { success: true, message: "Sub-service created successfully", data: subservice },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create sub-service" },
      { status: 500 }
    );
  }
}
