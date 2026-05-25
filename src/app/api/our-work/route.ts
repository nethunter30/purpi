import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CaseStudy from "@/models/CaseStudy";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { isActive: true };
    const studies = await CaseStudy.find(filter).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, data: studies });
  } catch (error: any) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      id,
      title,
      client,
      category,
      subCategory,
      description,
      challenge,
      solution,
      impact,
      impactLabel,
      image,
      techStack,
      results,
      milestones,
      isActive,
    } = body;

    if (
      !id || !title || !client || !category || !subCategory ||
      !description || !challenge || !solution || !impact || !impactLabel || !image
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanId = id.toLowerCase().trim().replace(/\s+/g, "-");

    const existing = await CaseStudy.findOne({ id: cleanId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A case study with this slug already exists" },
        { status: 400 }
      );
    }

    const newStudy = await CaseStudy.create({
      id: cleanId,
      title,
      client,
      category,
      subCategory,
      description,
      challenge,
      solution,
      impact,
      impactLabel,
      image,
      techStack: techStack || [],
      results: results || [],
      milestones: milestones || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      { success: true, message: "Case study created successfully", data: newStudy },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create case study" },
      { status: 500 }
    );
  }
}
