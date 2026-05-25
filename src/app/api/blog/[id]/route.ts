import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Category from "@/models/manage-services/categories"; // Ensure Category model is registered
import { isAuthenticated } from "@/lib/auth";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Support searching by Mongo _id OR by slug id
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
    const post = await BlogPost.findOne(query).populate("category");

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();

    const {
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

    if (!title || !excerpt || !content || !category || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };

    // Build update payload
    const updateFields: any = {
      title,
      excerpt,
      content,
      category,
      date,
      readTime,
      author,
      image,
      tags: tags || [],
      featured: featured || false,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (body.id) {
      const cleanId = body.id.toLowerCase().trim().replace(/\s+/g, "-");

      // Look up current record to get its primary key for self-conflict avoidance
      const currentRecord = await BlogPost.findOne(query);
      if (!currentRecord) {
        return NextResponse.json(
          { success: false, message: "Blog post not found" },
          { status: 404 }
        );
      }

      // Check if new slug conflicts with another document
      const conflict = await BlogPost.findOne({
        id: cleanId,
        _id: { $ne: currentRecord._id },
      });

      if (conflict) {
        return NextResponse.json(
          { success: false, message: "A blog post with this URL slug already exists" },
          { status: 400 }
        );
      }
      updateFields.id = cleanId;
    }

    const updatedPost = await BlogPost.findOneAndUpdate(query, updateFields, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
    const deletedPost = await BlogPost.findOneAndDelete(query);

    if (!deletedPost) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
