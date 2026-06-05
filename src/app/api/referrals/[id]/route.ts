import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReferralSubmission from "@/models/ReferralSubmission";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/referrals/[id] - Update referral submission status (isRead or lead status)
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
    const { isRead, status } = body;

    const updateFields: any = {};
    if (isRead !== undefined) {
      updateFields.isRead = isRead;
    }
    if (status !== undefined) {
      const allowedStatus = ["Pending", "In Progress", "Signed", "Paid", "Rejected"];
      if (!allowedStatus.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value provided" },
          { status: 400 }
        );
      }
      updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updatedSubmission = await ReferralSubmission.findByIdAndUpdate(
      id,
      updateFields,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, message: "Referral submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral updated successfully",
      data: updatedSubmission,
    });
  } catch (error: any) {
    console.error("Error updating referral submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update referral submission" },
      { status: 500 }
    );
  }
}

// DELETE /api/referrals/[id] - Delete a referral submission
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

    const deletedSubmission = await ReferralSubmission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { success: false, message: "Referral submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral submission deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting referral submission:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete referral submission" },
      { status: 500 }
    );
  }
}
