import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { isActive: true };
    const teamMembers = await TeamMember.find(filter).sort({ order: 1 });

    return NextResponse.json({ success: true, data: teamMembers });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, role, image, bgColor, order, isActive, linkedin, github, twitter, instagram } = body;

    if (!name || !role || !image) {
      return NextResponse.json(
        { success: false, message: "Name, role, and image are required fields." },
        { status: 400 }
      );
    }

    const newMember = await TeamMember.create({
      name,
      role,
      image,
      bgColor: bgColor || "#8a35e5",
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
      linkedin: linkedin || "",
      github: github || "",
      twitter: twitter || "",
      instagram: instagram || "",
    });

    return NextResponse.json(
      { success: true, message: "Team member created successfully", data: newMember },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create team member" },
      { status: 500 }
    );
  }
}
