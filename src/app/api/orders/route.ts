import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Akses tidak sah.' }, { status: 401 });
    }

    let list;
    if (user.role === 'admin') {
      // Admin boleh melihat semua orders
      list = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
    } else {
      // Customer hanya melihat orders sendiri
      list = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, user.id))
        .orderBy(desc(orders.createdAt));
    }

    // Ambil order items untuk setiap order
    const ordersWithItems = [];
    for (const order of list) {
      const items = await db
        .select({
          itemId: orderItems.id,
          productId: orderItems.productId,
          productName: products.name,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          thumbnailUrl: products.thumbnailUrl,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      ordersWithItems.push({
        ...order,
        items,
      });
    }

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Ralat membaca orders API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan rekod pesanan.' },
      { status: 500 }
    );
  }
}
