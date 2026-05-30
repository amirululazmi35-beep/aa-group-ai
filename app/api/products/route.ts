// ============================================================
// AA AI GROUP — Product Management API
// ============================================================
// GET: List products (published for customers, all for admin)
// POST: Create product (admin only)
// ============================================================

import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

// Zod schema for product validation
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  description: z.string().optional().default(""),
  shortDescription: z.string().max(500).optional().default(""),
  type: z.enum(["app", "video_course", "digital_service", "template", "plugin", "bundle"]),
  categoryId: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0).optional().nullable(),
  currency: z.string().default("MYR"),
  coverImageUrl: z.string().url().optional().nullable().default(null),
  features: z.array(z.string()).optional().default([]),
  downloadUrl: z.string().optional().nullable().default(null),
  accessUrl: z.string().optional().nullable().default(null),
  version: z.string().optional().default("1.0.0"),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
});

// Generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = adminDb.collection("products").orderBy("createdAt", "desc");

    // Non-admin users only see published products
    if (!isAdmin) {
      query = query.where("isPublished", "==", true);
    }

    // Filter by type
    if (type) {
      query = query.where("type", "==", type);
    }

    // Filter by featured
    if (featured === "true") {
      query = query.where("isFeatured", "==", true);
    }

    const snapshot = await query.limit(limit).get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }));

    return Response.json({ products, total: products.length });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Admin only
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return Response.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = createProductSchema.safeParse(body);

    if (!validated.success) {
      return Response.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validated.data;
    const slug = generateSlug(data.name) + "-" + Date.now().toString(36);

    const productData = {
      ...data,
      slug,
      totalSales: 0,
      galleryUrls: [],
      metadata: {},
      createdBy: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection("products").add(productData);

    return Response.json(
      {
        success: true,
        product: { id: docRef.id, ...productData },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
