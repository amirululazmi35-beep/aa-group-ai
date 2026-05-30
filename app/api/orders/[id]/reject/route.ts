// ============================================================
// AA AI GROUP — Order Rejection API (Admin Only)
// ============================================================
// POST: Reject manual payment receipt
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return Response.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { id } = await params;
    const { reason } = await request.json();

    const docRef = adminDb.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = doc.data()!;

    const updateData = {
      status: "cancelled",
      paymentStatus: "failed",
      rejectionReason: reason || "Bukti pemindahan tidak sah atau tidak lengkap.",
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Notify customer about rejection
    const notifData = {
      userId: orderData.userId,
      title: "Resit Bayaran Ditolak",
      message: `Bayaran untuk Pesanan #${id} ditolak: ${updateData.rejectionReason}. Sila hubungi admin.`,
      read: false,
      type: "danger",
      createdAt: new Date(),
    };
    await adminDb.collection("notifications").add(notifData);

    return Response.json({
      success: true,
      message: "Order payment rejected and customer notified",
      order: {
        id,
        ...orderData,
        ...updateData,
        createdAt: orderData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updateData.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Reject order error:", error);
    return Response.json({ error: "Failed to reject order" }, { status: 500 });
  }
}
