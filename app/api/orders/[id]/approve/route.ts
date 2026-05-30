// ============================================================
// AA AI GROUP — Order Approval API (Admin Only)
// ============================================================
// POST: Approve manual payment & provision digital access
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { provisionDigitalAccess } from "@/lib/order-utils";

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
    const docRef = adminDb.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = doc.data()!;

    if (orderData.status === "completed") {
      return Response.json({ error: "Order is already completed" }, { status: 400 });
    }

    const updateData = {
      status: "completed",
      paymentStatus: "paid",
      approvedBy: user.uid,
      approvedAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Process Referral Commission if applicable
    try {
      const buyerDoc = await adminDb.collection("users").doc(orderData.userId).get();
      if (buyerDoc.exists) {
        const buyerData = buyerDoc.data()!;
        const referrerUid = buyerData.referrerUid || null;
        if (referrerUid) {
          const commissionAmount = orderData.price * 0.10; // 10% Commission
          if (commissionAmount > 0) {
            const referrerRef = adminDb.collection("users").doc(referrerUid);
            const rDoc = await referrerRef.get();
            if (rDoc.exists) {
              const currentBalance = rDoc.data()?.referralBalance || 0;
              await referrerRef.update({
                referralBalance: currentBalance + commissionAmount,
                updatedAt: new Date()
              });
            }

            // Update referral log in referrals collection
            const referralQuery = await adminDb.collection("referrals")
              .where("referrerUid", "==", referrerUid)
              .where("referredUid", "==", orderData.userId)
              .limit(1)
              .get();

            if (!referralQuery.empty) {
              await referralQuery.docs[0].ref.update({
                status: "purchased",
                commissionPaid: commissionAmount,
                orderId: id,
                updatedAt: new Date()
              });
            } else {
              await adminDb.collection("referrals").add({
                referrerUid,
                referredUid: orderData.userId,
                referredName: buyerData.fullName || "Pelanggan Rujukan",
                referredEmail: buyerData.email || "",
                status: "purchased",
                commissionPaid: commissionAmount,
                orderId: id,
                createdAt: new Date(),
                updatedAt: new Date()
              });
            }

            // Notify Referrer
            await adminDb.collection("notifications").add({
              userId: referrerUid,
              title: "Komisen Referral Dikreditkan",
              message: `Tahniah! Anda menerima RM ${commissionAmount.toFixed(2)} komisen tunai dari pembelian ${buyerData.fullName || "rakan anda"}.`,
              read: false,
              type: "success",
              createdAt: new Date()
            });
          }
        }
      }
    } catch (refError) {
      console.error("Failed to process referral commission:", refError);
    }

    // Automatically provision digital access and notify customer
    await provisionDigitalAccess(id, {
      ...orderData,
      ...updateData,
    });

    return Response.json({
      success: true,
      message: "Order approved and digital access provisioned successfully",
      order: {
        id,
        ...orderData,
        ...updateData,
        createdAt: orderData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updateData.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Approve order error:", error);
    return Response.json({ error: "Failed to approve order" }, { status: 500 });
  }
}
