// ============================================================
// AA AI GROUP — Product Publish Toggle API
// ============================================================
// PATCH: Toggle publish/unpublish a product (admin only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin only
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return Response.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const docRef = adminDb.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const currentData = doc.data()!;
    const newPublishState = !currentData.isPublished;

    await docRef.update({
      isPublished: newPublishState,
      updatedAt: new Date(),
      updatedBy: user.uid,
    });

    return Response.json({
      success: true,
      isPublished: newPublishState,
      message: newPublishState
        ? `Product "${currentData.name}" is now published.`
        : `Product "${currentData.name}" has been unpublished.`,
    });
  } catch (error: any) {
    console.error("Error toggling publish:", error);
    return Response.json(
      { error: "Failed to toggle publish status" },
      { status: 500 }
    );
  }
}
