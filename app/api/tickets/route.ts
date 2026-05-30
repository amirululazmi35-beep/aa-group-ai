// ============================================================
// AA AI GROUP — Support Ticket Management API
// ============================================================
// GET: Fetch tickets (customer see theirs, admin see all)
// POST: Create a new support ticket
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const isAdmin = user.role === "admin" || user.role === "superadmin";
    let query = adminDb.collection("tickets").orderBy("createdAt", "desc");

    if (!isAdmin) {
      query = query.where("userId", "==", user.uid);
    }

    if (statusFilter) {
      query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.get();
    const tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        replies: (data.replies || []).map((r: any) => ({
          ...r,
          createdAt: r.createdAt?.toDate?.()?.toISOString() || r.createdAt || null,
        })),
      };
    });

    return Response.json({ tickets });
  } catch (error: any) {
    console.error("Fetch tickets error:", error);
    return Response.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, description, orderId } = await request.json();

    if (!subject || !description) {
      return Response.json(
        { error: "subject and description are required" },
        { status: 400 }
      );
    }

    const ticketNumber = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticketData = {
      ticketNumber,
      userId: user.uid,
      userName: user.name || "Pelanggan",
      subject,
      description,
      orderId: orderId || null,
      status: "open",
      priority: "medium",
      replies: [
        {
          sender: "system",
          message: "Tiket sokongan berjaya dibuka. Ejen AI dan Admin kami sedang meneliti isu anda.",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection("tickets").add(ticketData);

    // Send customer notification
    const notifData = {
      userId: user.uid,
      title: "Tiket Sokongan Dibuka",
      message: `Tiket sokongan #${ticketNumber} berjaya dihantar.`,
      read: false,
      type: "info",
      createdAt: new Date(),
    };
    await adminDb.collection("notifications").add(notifData);

    return Response.json({
      success: true,
      ticket: {
        id: docRef.id,
        ...ticketData,
        createdAt: ticketData.createdAt.toISOString(),
        updatedAt: ticketData.updatedAt.toISOString(),
        replies: ticketData.replies.map(r => ({
          ...r,
          createdAt: r.createdAt.toISOString()
        }))
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create ticket error:", error);
    return Response.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
