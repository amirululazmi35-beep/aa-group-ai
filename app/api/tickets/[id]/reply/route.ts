// ============================================================
// AA AI GROUP — Support Ticket Reply API
// ============================================================
// POST: Add a message reply to a support ticket
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
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return Response.json({ error: "message is required" }, { status: 400 });
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

    const sender = isAdmin ? "admin" : "client";

    const newReply = {
      sender,
      message,
      createdAt: new Date(),
    };

    const updatedReplies = [...(ticketData.replies || []), newReply];

    const updateData = {
      replies: updatedReplies,
      status: isAdmin ? "replied" : "open",
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    // Send notifications
    if (isAdmin) {
      const customerNotif = {
        userId: ticketData.userId,
        title: "Sokongan Tiket Dibalas",
        message: `Tiket #${ticketData.ticketNumber} mendapat maklum balas baharu daripada Admin.`,
        read: false,
        type: "success",
        createdAt: new Date(),
      };
      await adminDb.collection("notifications").add(customerNotif);
    } else {
      const adminNotif = {
        userId: "admin",
        title: "Tiket Dibalas Pelanggan",
        message: `Pelanggan ${ticketData.userName} membalas tiket #${ticketData.ticketNumber}.`,
        read: false,
        type: "info",
        createdAt: new Date(),
      };
      await adminDb.collection("notifications").add(adminNotif);
    }

    return Response.json({
      success: true,
      replies: updatedReplies.map(r => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : (r.createdAt?.toDate?.()?.toISOString() || r.createdAt)
      })),
    });
  } catch (error: any) {
    console.error("Reply ticket error:", error);
    return Response.json({ error: "Failed to reply to ticket" }, { status: 500 });
  }
}
