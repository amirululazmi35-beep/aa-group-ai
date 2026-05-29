import { NextResponse } from 'next/server';
import { db } from '@/db';
import { supportTickets } from '@/db/schema';
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
      list = await db
        .select()
        .from(supportTickets)
        .orderBy(desc(supportTickets.createdAt))
        .all();
    } else {
      list = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.userId, user.id))
        .orderBy(desc(supportTickets.createdAt))
        .all();
    }

    return NextResponse.json({ tickets: list });
  } catch (error) {
    console.error('Ralat membaca support tickets API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan tiket bantuan.' },
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

    const { subject, message, orderId } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Sila lengkapkan subjek dan isi mesej bantuan.' },
        { status: 400 }
      );
    }

    const ticketId = `TCKT-${Date.now().toString().slice(-6)}`;
    const now = Date.now();

    await db.insert(supportTickets).values({
      id: ticketId,
      userId: user.id,
      orderId: orderId || null,
      subject,
      message,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    });

    const newTicket = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketId)).get();

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error('Ralat mencipta support ticket API:', error);
    return NextResponse.json(
      { error: 'Gagal menghantar tiket bantuan.' },
      { status: 500 }
    );
  }
}
