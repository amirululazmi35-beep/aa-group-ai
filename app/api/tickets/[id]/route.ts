// ============================================================
// AA AI GROUP — Single Support Ticket API
// ============================================================
// GET: Fetch details of a single ticket (admin or owner only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    return Response.json({
      ticket: {
        id: doc.id,
        ...ticketData,
        createdAt: ticketData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: ticketData.updatedAt?.toDate?.()?.toISOString() || null,
        replies: (ticketData.replies || []).map((r: any) => ({
          ...r,
          createdAt: r.createdAt?.toDate?.()?.toISOString() || r.createdAt || null,
        })),
      },
    });
  } catch (error: any) {
    console.error("Fetch single ticket error:", error);
    return Response.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}
