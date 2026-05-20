import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import SubService from "@/models/SubService";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { slug } = await params;

    const service = await Service.findOne({ slug });

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    const subservices = await SubService.find({ serviceId: service._id })
      .sort({ order: 1, createdAt: 1 });

    return NextResponse.json({ success: true, data: subservices });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sub-services" },
      { status: 500 }
    );
  }
}
