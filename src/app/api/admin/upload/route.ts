// src/app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// Increase the body size limit for file uploads (Next.js 16+)
export const maxDuration = 60; // Allow up to 60s for uploads

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subfolder = (formData.get("subfolder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size on the server side (5 MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 5 MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a clean filename (Cloudinary appends the extension)
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-");
    const filename = `${timestamp}-${originalName}`;

    // Pass the real MIME type so the base64 data URI is correct
    const result = await uploadToCloudinary(buffer, subfolder, file.type, filename);

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    const isTimeout = errorMessage.toLowerCase().includes("timeout") || 
                      errorMessage.toLowerCase().includes("timed out");
    
    return NextResponse.json(
      { 
        success: false, 
        error: isTimeout 
          ? "Upload timed out. Please try again with a smaller image." 
          : "Failed to upload file. Please try again." 
      },
      { status: isTimeout ? 408 : 500 }
    );
  }
}