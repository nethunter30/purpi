import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Industry from "@/models/Industry";
import { isAuthenticated } from "@/lib/auth";

const initialIndustries = [
  {
    id: "small-medium-business",
    title: "Small & Medium Business",
    description: "Cost-effective IT solutions that grow with your business. From basic infrastructure to advanced cloud services.",
    iconName: "Building2",
    link: "/solutions"
  },
  {
    id: "education",
    title: "Education",
    description: "Secure campus networks, student device management, and digital classroom solutions for schools and universities.",
    iconName: "GraduationCap",
    link: "/solutions"
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "HIPAA-compliant IT infrastructure with patient data protection, secure access, and 24/7 system availability.",
    iconName: "ShieldPlus",
    link: "/solutions"
  },
  {
    id: "retail",
    title: "Retail",
    description: "Multi-location POS systems, inventory management integration, and secure payment processing infrastructure.",
    iconName: "ShoppingCart",
    link: "/solutions"
  },
  {
    id: "startups",
    title: "Startups",
    description: "Cloud-native foundations with scalable architecture, DevOps tooling, and rapid deployment capabilities.",
    iconName: "Rocket",
    link: "/solutions"
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Industrial IoT integration, OT security, and robust network infrastructure for smart factory operations.",
    iconName: "Factory",
    link: "/solutions"
  },
  {
    id: "banking-finance",
    title: "Banking & Finance",
    description: "Regulatory-compliant security, high-availability infrastructure, and secure transaction processing systems.",
    iconName: "Landmark",
    link: "/solutions"
  },
  {
    id: "professional-services",
    title: "Professional Services",
    description: "Secure client data management, collaboration tools, and remote work infrastructure for consulting firms.",
    iconName: "Briefcase",
    link: "/solutions"
  },
  {
    id: "logistics-transport",
    title: "Logistics & Transport",
    description: "Fleet management systems, warehouse automation, and real-time tracking infrastructure.",
    iconName: "Truck",
    link: "/solutions"
  },
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Property management systems, guest WiFi, POS integration, and booking platform infrastructure.",
    iconName: "Utensils",
    link: "/solutions"
  }
];

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { isActive: true };
    let list = await Industry.find(filter).sort({ createdAt: 1 });

    // Auto-seed database if empty
    if (list.length === 0 && initialIndustries.length > 0) {
      console.log("[Seeding] Seeding initial industries to the database...");
      await Industry.insertMany(
        initialIndustries.map((ind) => ({
          id: ind.id,
          title: ind.title,
          description: ind.description,
          iconName: ind.iconName,
          link: ind.link || "/solutions",
          isActive: true,
        }))
      );
      list = await Industry.find(filter).sort({ createdAt: 1 });
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error("Error fetching industries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch industries" },
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
    const { id, title, description, iconName, link, isActive } = body;

    if (!id || !title || !description || !iconName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cleanId = id.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const existing = await Industry.findOne({ id: cleanId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An industry with this slug already exists" },
        { status: 400 }
      );
    }

    const newIndustry = await Industry.create({
      id: cleanId,
      title,
      description,
      iconName,
      link: link || "/solutions",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      { success: true, message: "Industry created successfully", data: newIndustry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating industry:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create industry" },
      { status: 500 }
    );
  }
}
