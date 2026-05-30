// ============================================================
// AA AI GROUP — Order Payment Submission API (Manual Transfer)
// ============================================================
// POST: Submit payment receipt details (owner only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { receiptUrl, notes } = await request.json();

    if (!receiptUrl) {
      return Response.json({ error: "receiptUrl is required" }, { status: 400 });
    }

    const docRef = adminDb.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = doc.data()!;
    if (orderData.userId !== user.uid) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData = {
      receiptUrl,
      paymentStatus: "processing",
      status: "pending", // Waiting for approval
      customerNotes: notes || "",
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Create notification for admin
    const adminNotif = {
      userId: "admin", // Admin notification channel
      title: "Pembayaran Manual Baharu",
      message: `Pelanggan ${orderData.userName} memuat naik bukti bayaran untuk Pesanan #${id}.`,
      read: false,
      type: "info",
      createdAt: new Date(),
    };
    await adminDb.collection("notifications").add(adminNotif);

    return Response.json({
      success: true,
      message: "Payment receipt submitted successfully",
      order: {
        id,
        ...orderData,
        ...updateData,
        createdAt: orderData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updateData.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Submit payment error:", error);
    return Response.json({ error: "Failed to submit payment" }, { status: 500 });
  }
}
