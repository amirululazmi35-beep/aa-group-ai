// ============================================================
// AA AI GROUP — Order Management API
// ============================================================
// GET: Fetch user orders (or all orders for admin)
// POST: Create a new order
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { provisionDigitalAccess } from "@/lib/order-utils";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.role === "admin" || user.role === "superadmin";
    let query = adminDb.collection("orders").orderBy("createdAt", "desc");

    // Customers only see their own orders
    if (!isAdmin) {
      query = query.where("userId", "==", user.uid);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

    return Response.json({ orders });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, paymentMethod, clientDetails } = await request.json();

    if (!productId || !paymentMethod || !clientDetails) {
      return Response.json(
        { error: "productId, paymentMethod, and clientDetails are required" },
        { status: 400 }
      );
    }

    // Fetch product details
    const productDoc = await adminDb.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    const product = productDoc.data()!;

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isFpx = paymentMethod === "fpx";

    const orderData = {
      orderNumber,
      userId: user.uid,
      userName: clientDetails.name || user.name || "Pelanggan",
      userEmail: clientDetails.email || user.email || "",
      productId,
      productName: product.name,
      price: product.price,
      paymentMethod,
      status: isFpx ? "completed" : "pending",
      paymentStatus: isFpx ? "paid" : "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection("orders").add(orderData);

    // If payment is completed (e.g. FPX), provision access immediately
    if (isFpx) {
      await provisionDigitalAccess(docRef.id, orderData);
    } else {
      // Create pending payment notification
      const notifData = {
        userId: user.uid,
        title: "Pesanan Dibuat",
        message: `Pesanan RM ${product.price} menunggu kelulusan bayaran manual.`,
        read: false,
        type: "warning",
        createdAt: new Date(),
      };
      await adminDb.collection("notifications").add(notifData);
    }

    return Response.json({
      success: true,
      order: {
        id: docRef.id,
        ...orderData,
        createdAt: orderData.createdAt.toISOString(),
        updatedAt: orderData.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Create order error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
