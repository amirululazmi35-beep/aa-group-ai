// ============================================================
// AA AI GROUP — Single Product API
// ============================================================
// GET: Get product by ID
// PUT: Update product (admin only)
// DELETE: Delete product (admin only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  type: z.enum(["app", "video_course", "digital_service", "template", "plugin", "bundle"]).optional(),
  categoryId: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional().nullable(),
  currency: z.string().optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  features: z.array(z.string()).optional(),
  downloadUrl: z.string().optional().nullable(),
  accessUrl: z.string().optional().nullable(),
  version: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = adminDb.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const data = doc.data()!;

    // Non-admin users can only see published products
    const user = await getCurrentUser();
    const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

    if (!isAdmin && !data.isPublished) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({
      product: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const validated = updateProductSchema.safeParse(body);

    if (!validated.success) {
      return Response.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = {
      ...validated.data,
      updatedAt: new Date(),
      updatedBy: user.uid,
    };

    await docRef.update(updateData);

    const updated = await docRef.get();

    return Response.json({
      success: true,
      product: {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data()?.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: updated.data()?.updatedAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await docRef.delete();

    return Response.json({
      success: true,
      message: `Product ${id} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
