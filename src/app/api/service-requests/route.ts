import { NextResponse } from 'next/server';
import { db } from '@/db';
import { serviceRequests, products } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Akses tidak sah.' }, { status: 401 });
    }

    let list;
    if (user.role === 'admin') {
      list = await db
        .select({
          id: serviceRequests.id,
          userId: serviceRequests.userId,
          productId: serviceRequests.productId,
          productName: products.name,
          orderId: serviceRequests.orderId,
          requirements: serviceRequests.requirements,
          status: serviceRequests.status,
          adminNotes: serviceRequests.adminNotes,
          createdAt: serviceRequests.createdAt,
          updatedAt: serviceRequests.updatedAt,
        })
        .from(serviceRequests)
        .innerJoin(products, eq(serviceRequests.productId, products.id))
        .all();
    } else {
      list = await db
        .select({
          id: serviceRequests.id,
          userId: serviceRequests.userId,
          productId: serviceRequests.productId,
          productName: products.name,
          orderId: serviceRequests.orderId,
          requirements: serviceRequests.requirements,
          status: serviceRequests.status,
          adminNotes: serviceRequests.adminNotes,
          createdAt: serviceRequests.createdAt,
          updatedAt: serviceRequests.updatedAt,
        })
        .from(serviceRequests)
        .innerJoin(products, eq(serviceRequests.productId, products.id))
        .where(eq(serviceRequests.userId, user.id))
        .all();
    }

    return NextResponse.json({ requests: list });
  } catch (error) {
    console.error('Ralat membaca service requests API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan rekod servis digital.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Akses tidak sah.' }, { status: 401 });
    }

    const { orderId, productId, requirements } = await request.json();

    if (!orderId || !productId || !requirements) {
      return NextResponse.json({ error: 'Sila masukkan maklumat keperluan projek.' }, { status: 400 });
    }

    const now = Date.now();

    // Semak jika rekod request sedia ada
    const existing = await db
      .select()
      .from(serviceRequests)
      .where(and(eq(serviceRequests.orderId, orderId), eq(serviceRequests.userId, user.id)))
      .get();

    if (existing) {
      await db
        .update(serviceRequests)
        .set({
          requirements,
          updatedAt: now,
        })
        .where(eq(serviceRequests.id, existing.id));
    } else {
      await db.insert(serviceRequests).values({
        id: crypto.randomUUID(),
        userId: user.id,
        productId,
        orderId,
        requirements,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ralat mengemaskini service request API:', error);
    return NextResponse.json(
      { error: 'Gagal menghantar keperluan projek.' },
      { status: 500 }
    );
  }
}
