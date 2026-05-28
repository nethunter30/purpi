import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { isAuthenticated } from "@/lib/auth";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { isActive: true };
    const posts = await BlogPost.find(filter).populate("category").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth check
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
      excerpt,
      content,
      category,
      date,
      readTime,
      author,
      image,
      tags,
      featured,
      isActive,
    } = body;

    // Validation
    if (!id || !title || !excerpt || !content || !category || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (ID, title, excerpt, content, category, image)" },
        { status: 400 }
      );
    }

    const cleanId = id.toLowerCase().trim().replace(/\s+/g, "-");

    // Check slug uniqueness
    const existing = await BlogPost.findOne({ id: cleanId });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A blog post with this URL slug already exists" },
        { status: 400 }
      );
    }

    const newPost = await BlogPost.create({
      id: cleanId,
      title,
      excerpt,
      content,
      category,
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: readTime || "5 min read",
      author: author || {
        name: adminUser.username,
        role: "Principal Architect",
        avatar: "/illustrations/newsletter-person.png",
      },
      image,
      tags: tags || [],
      featured: featured || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      { success: true, message: "Blog post created successfully", data: newPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
