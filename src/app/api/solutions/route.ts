import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Solution from "@/models/Solution";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { isActive: true };
    const solutions = await Solution.find(filter).sort({ createdAt: 1 });


    return NextResponse.json({ success: true, data: solutions });
  } catch (error: any) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Authentication check
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
      description,
      image,
      iconName,
      features,
      startingPrice,
      learnMoreUrl,
      isActive,
    } = body;

    // Validation
    if (!id || !title || !description || !image || !iconName || !startingPrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanId = id.toLowerCase().trim().replace(/\s+/g, "-");

    // Check slug uniqueness
    const existing = await Solution.findOne({ id: cleanId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A solution package with this slug already exists" },
        { status: 400 }
      );
    }

    const newSolution = await Solution.create({
      id: cleanId,
      title,
      description,
      image,
      iconName,
      features: features || [],
      startingPrice,
      learnMoreUrl: learnMoreUrl || "/#contact",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      { success: true, message: "Solution package created successfully", data: newSolution },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating solution package:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create solution package" },
      { status: 500 }
    );
  }
}
