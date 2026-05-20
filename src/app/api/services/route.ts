import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
