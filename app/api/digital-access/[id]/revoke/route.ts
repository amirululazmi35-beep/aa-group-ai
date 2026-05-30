// ============================================================
// AA AI GROUP — Revoke Digital Access API (Admin Only)
// ============================================================
// POST: Revoke customer's digital access entitlement
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
    const docRef = adminDb.collection("digital_access").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Digital access record not found" }, { status: 404 });
    }

    const accessData = doc.data()!;

    if (accessData.status === "revoked") {
      return Response.json({ error: "Access is already revoked" }, { status: 400 });
    }

    const updateData = {
      status: "revoked",
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Notify customer about access revocation
    const notifData = {
      userId: accessData.userId,
      title: "Akses Digital Ditarik Balik",
      message: `Akses anda ke pakej "${accessData.productName}" telah ditarik balik oleh admin.`,
      read: false,
      type: "danger",
      createdAt: new Date(),
    };
    await adminDb.collection("notifications").add(notifData);

    return Response.json({
      success: true,
      message: "Digital access revoked and customer notified",
      digitalAccess: {
        id,
        ...accessData,
        ...updateData,
        createdAt: accessData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updateData.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Revoke digital access error:", error);
    return Response.json({ error: "Failed to revoke digital access" }, { status: 500 });
  }
}
