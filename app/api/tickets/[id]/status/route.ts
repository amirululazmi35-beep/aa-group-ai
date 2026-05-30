// ============================================================
// AA AI GROUP — Support Ticket Status API
// ============================================================
// PATCH/POST: Update support ticket status (Close / Reopen)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ["open", "replied", "closed"];
    if (!status || !validStatuses.includes(status)) {
      return Response.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("tickets").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Ticket not found" }, { status: 404 });
    }

    const ticketData = doc.data()!;
    const isAdmin = user.role === "admin" || user.role === "superadmin";
    const isOwner = ticketData.userId === user.uid;

    if (!isAdmin && !isOwner) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Customer can only close their own tickets
    if (!isAdmin && status !== "closed") {
      return Response.json(
        { error: "Forbidden. Customers can only close tickets." },
        { status: 403 }
      );
    }

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Create system notification about ticket closure
    if (status === "closed") {
      const notifData = {
        userId: ticketData.userId,
        title: "Tiket Ditutup",
        message: `Tiket sokongan #${ticketData.ticketNumber} telah berjaya ditutup.`,
        read: false,
        type: "info",
        createdAt: new Date(),
      };
      await adminDb.collection("notifications").add(notifData);
    }

    return Response.json({
      success: true,
      status,
      message: `Ticket status updated to ${status} successfully.`,
    });
  } catch (error: any) {
    console.error("Update ticket status error:", error);
    return Response.json({ error: "Failed to update ticket status" }, { status: 500 });
  }
}

// Support POST fallback for environments preferring POST over PATCH
export async function POST(request: Request, context: any) {
  return PATCH(request, context);
}
