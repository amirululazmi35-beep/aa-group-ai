import { NextResponse } from 'next/server';
import { db } from '@/db';
import { digitalAccess, products } from '@/db/schema';
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
          id: digitalAccess.id,
          userId: digitalAccess.userId,
          productId: digitalAccess.productId,
          productName: products.name,
          orderId: digitalAccess.orderId,
          accessStatus: digitalAccess.accessStatus,
          accessUrl: digitalAccess.accessUrl,
          licenseKey: digitalAccess.licenseKey,
          expiresAt: digitalAccess.expiresAt,
          createdAt: digitalAccess.createdAt,
        })
        .from(digitalAccess)
        .innerJoin(products, eq(digitalAccess.productId, products.id))
        .all();
    } else {
      list = await db
        .select({
          id: digitalAccess.id,
          userId: digitalAccess.userId,
          productId: digitalAccess.productId,
          productName: products.name,
          orderId: digitalAccess.orderId,
          accessStatus: digitalAccess.accessStatus,
          accessUrl: digitalAccess.accessUrl,
          licenseKey: digitalAccess.licenseKey,
          expiresAt: digitalAccess.expiresAt,
          createdAt: digitalAccess.createdAt,
        })
        .from(digitalAccess)
        .innerJoin(products, eq(digitalAccess.productId, products.id))
        .where(
          and(
            eq(digitalAccess.userId, user.id),
            eq(digitalAccess.accessStatus, 'active')
          )
        )
        .all();
    }

    return NextResponse.json({ accesses: list });
  } catch (error) {
    console.error('Ralat membaca digital access API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan pautan akses digital.' },
      { status: 500 }
    );
  }
}
