import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, categories, users, serviceRequests, supportTickets } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses tidak sah. Admin sahaja.' }, { status: 403 });
    }

    // 1. Ambil Semua Kategori
    const categoriesList = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt))
      .all();

    // 2. Ambil Semua Produk
    const productsList = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .all();

    // 3. Ambil Semua Pelanggan
    const customersList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'customer'))
      .orderBy(desc(users.createdAt))
      .all();

    // 4. Ambil Semua Pesanan beserta item
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .all();

    const ordersList = [];
    for (const order of allOrders) {
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
        .where(eq(orderItems.orderId, order.id))
        .all();

      // Dapatkan nama pelanggan
      const customer = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, order.userId))
        .get();

      ordersList.push({
        ...order,
        customerName: customer?.name || 'Pelanggan Dipadam',
        customerEmail: customer?.email || '',
        items,
      });
    }

    // 5. Ambil Permintaan Servis Digital
    const servicesList = await db
      .select({
        id: serviceRequests.id,
        orderId: serviceRequests.orderId,
        productId: serviceRequests.productId,
        productName: products.name,
        userName: users.name,
        userEmail: users.email,
        requirements: serviceRequests.requirements,
        status: serviceRequests.status,
        adminNotes: serviceRequests.adminNotes,
        createdAt: serviceRequests.createdAt,
        updatedAt: serviceRequests.updatedAt,
      })
      .from(serviceRequests)
      .innerJoin(products, eq(serviceRequests.productId, products.id))
      .innerJoin(users, eq(serviceRequests.userId, users.id))
      .orderBy(desc(serviceRequests.createdAt))
      .all();

    // 6. Ambil Tiket Bantuan
    const ticketsList = await db
      .select({
        id: supportTickets.id,
        subject: supportTickets.subject,
        message: supportTickets.message,
        status: supportTickets.status,
        createdAt: supportTickets.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(supportTickets)
      .innerJoin(users, eq(supportTickets.userId, users.id))
      .orderBy(desc(supportTickets.createdAt))
      .all();

    // Kira stats ringkas
    const totalEarnings = ordersList
      .filter((o) => o.status === 'paid' || o.status === 'completed')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const pendingOrdersCount = ordersList.filter((o) => o.status === 'pending').length;
    const openTicketsCount = ticketsList.filter((t) => t.status === 'open').length;

    return NextResponse.json({
      stats: {
        totalEarnings,
        customersCount: customersList.length,
        productsCount: productsList.length,
        pendingOrdersCount,
        openTicketsCount,
      },
      categories: categoriesList,
      products: productsList,
      customers: customersList,
      orders: ordersList,
      services: servicesList,
      tickets: ticketsList,
    });
  } catch (error) {
    console.error('Ralat membaca stats admin:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman semasa memproses stats admin.' },
      { status: 500 }
    );
  }
}
