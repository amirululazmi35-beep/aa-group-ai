import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, digitalAccess, serviceRequests } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses tidak sah. Admin sahaja.' }, { status: 403 });
    }

    const { id: orderId } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Sila nyatakan status pesanan.' }, { status: 400 });
    }

    // Dapatkan maklumat pesanan asal
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)
      .then(r => r[0]);

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pesanan tidak dijumpai.' }, { status: 404 });
    }

    const now = Date.now();

    // Kemaskini status pesanan
    await db
      .update(orders)
      .set({
        status,
        updatedAt: now,
      })
      .where(eq(orders.id, orderId));

    // Jika status diubah ke 'paid' atau 'completed', janakan akses digital dan rekod servis
    if (status === 'paid' || status === 'completed') {
      // Ambil semua items dalam pesanan
      const items = await db
        .select({
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          type: products.type,
          accessType: products.accessType,
          accessValue: products.accessValue,
          name: products.name,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, orderId));

      for (const item of items) {
        if (item.type === 'app' || item.type === 'video_course' || item.type === 'bundle') {
          // Semak jika akses digital sudah wujud
          const existingAccess = await db
            .select()
            .from(digitalAccess)
            .where(
              and(
                eq(digitalAccess.orderId, orderId),
                eq(digitalAccess.productId, item.productId)
              )
            )
            .limit(1)
            .then(r => r[0]);

          if (!existingAccess) {
            let licenseKey = null;
            let accessUrl = null;

            if (item.accessType === 'license_key') {
              // Janakan lesen rawak premium
              const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
              const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
              const p3 = Math.random().toString(36).substring(2, 6).toUpperCase();
              licenseKey = `AA-${p1}-${p2}-${p3}`;
            } else if (item.accessType === 'download_link' || item.accessType === 'external_link') {
              accessUrl = item.accessValue;
            } else if (item.accessType === 'video_access') {
              accessUrl = `/dashboard?tab=videos`; // redirect link
            }

            await db.insert(digitalAccess).values({
              id: crypto.randomUUID(),
              userId: existingOrder.userId,
              productId: item.productId,
              orderId: orderId,
              accessStatus: 'active',
              licenseKey: licenseKey || item.accessValue || null,
              accessUrl: accessUrl || null,
              createdAt: now,
            });
          }
        } else if (item.type === 'service') {
          // Semak jika permintaan servis sudah wujud
          const existingService = await db
            .select()
            .from(serviceRequests)
            .where(
              and(
                eq(serviceRequests.orderId, orderId),
                eq(serviceRequests.productId, item.productId)
              )
            )
            .limit(1)
            .then(r => r[0]);

          if (!existingService) {
            await db.insert(serviceRequests).values({
              id: crypto.randomUUID(),
              userId: existingOrder.userId,
              productId: item.productId,
              orderId: orderId,
              requirements: 'Sila klik butang kemaskini untuk memasukkan spesifikasi projek anda.',
              status: 'pending',
              adminNotes: 'Pesanan telah disahkan. Menunggu spesifikasi daripada pelanggan.',
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Status pesanan berjaya dikemaskini.' });
  } catch (error) {
    console.error('Ralat mengemaskini pesanan:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan semasa memproses pesanan.' },
      { status: 500 }
    );
  }
}
