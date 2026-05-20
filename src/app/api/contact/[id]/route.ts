import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";
import { isAuthenticated } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/contact/[id] - Update contact submission status (isRead)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    
    // Secure endpoint check
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
    const { isRead } = body;

    if (isRead === undefined) {
      return NextResponse.json(
        { success: false, message: "isRead field is required" },
        { status: 400 }
      );
    }

    const updatedSubmission = await ContactSubmission.findByIdAndUpdate(
      id,
      { isRead },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, message: "Contact submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Submission marked as ${isRead ? "read" : "unread"} successfully`,
      data: updatedSubmission,
    });
  } catch (error: any) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update contact submission" },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact submission
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    // Secure endpoint check
    const adminUser = await isAuthenticated();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const deletedSubmission = await ContactSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { success: false, message: "Contact submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete contact submission" },
      { status: 500 }
    );
  }
}
