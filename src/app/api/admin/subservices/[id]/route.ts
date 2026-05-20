import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubService from "@/models/SubService";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    const subservice = await SubService.findById(id).populate(
      "serviceId",
      "title slug"
    );

    if (!subservice) {
      return NextResponse.json(
        { success: false, message: "Sub-service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: subservice });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sub-service" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
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

    // Check if slug is unique (excluding this document)
    const existing = await SubService.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A sub-service with a similar title already exists." },
        { status: 400 }
      );
    }

    const updated = await SubService.findByIdAndUpdate(
      id,
      {
        serviceId,
        title,
        slug,
        description,
        whatWeOffer: whatWeOffer || [],
        benefits: benefits || [],
        order: order ?? 0,
      },
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Sub-service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sub-service updated", data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update sub-service" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await SubService.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Sub-service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sub-service deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete sub-service" },
      { status: 500 }
    );
  }
}
