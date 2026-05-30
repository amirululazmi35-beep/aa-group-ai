// ============================================================
// AA AI GROUP — Order Shared Utilities
// ============================================================

import { adminDb } from "@/lib/firebase-admin";

// Helper to generate unique license key
export function generateLicenseKey(): string {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AA-${segment()}-${segment()}-${segment()}`;
}

// Provision digital access after completed payment
export async function provisionDigitalAccess(orderId: string, orderData: any) {
  const { userId, productId, productName, userName } = orderData;

  // 1. Fetch product details
  const productDoc = await adminDb.collection("products").doc(productId).get();
  const product = productDoc.exists ? productDoc.data() : null;
  const productType = product?.type || "app";

  // 2. Create digital access document
  const accessData = {
    userId,
    productId,
    productName,
    productType,
    orderId,
    licenseKey: productType === "app" ? generateLicenseKey() : null,
    downloadUrl: product?.downloadUrl || null,
    accessUrl: product?.accessUrl || null,
    status: "active",
    expiresAt: null, // Lifetime access
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb.collection("digital_access").add(accessData);

  // 3. If it's a digital service, provision service request tracker
  if (productType === "digital_service" || product?.category === "service") {
    const serviceData = {
      userId,
      userName,
      serviceName: productName,
      status: "pending",
      progressNotes: "Pesanan disahkan. Ejen AI sedang disediakan.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await adminDb.collection("services").add(serviceData);
  }

  // 4. Create notification
  const notifData = {
    userId,
    title: "Akses Digital Diaktifkan",
    message: `Pakej "${productName}" anda telah aktif. Sila semak tab Akses Produk.`,
    read: false,
    type: "success",
    createdAt: new Date(),
  };
  await adminDb.collection("notifications").add(notifData);
}
