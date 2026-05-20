import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";

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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, details, image, order } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, message: "Title, description, and image are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug is unique
    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A service with a similar title already exists." },
        { status: 400 }
      );
    }

    const service = await Service.create({
      title,
      slug,
      description,
      details: details || "",
      image,
      order: order || 0,
    });

    return NextResponse.json(
      { success: true, message: "Service created successfully", data: service },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
