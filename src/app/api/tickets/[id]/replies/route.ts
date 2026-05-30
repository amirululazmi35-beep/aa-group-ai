import { NextResponse } from 'next/server';
import { db } from '@/db';
import { ticketReplies, supportTickets, users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Akses tidak sah.' }, { status: 401 });
    }

    // Semak hak milik tiket jika bukan admin
    if (user.role !== 'admin') {
      const ticket = await db
        .select()
        .from(supportTickets)
        .where(and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)))
        .limit(1)
        .then(r => r[0]);
      if (!ticket) {
        return NextResponse.json({ error: 'Akses dinafikan.' }, { status: 403 });
      }
    }

    // Ambil senarai balasan tiket
    const replies = await db
      .select({
        id: ticketReplies.id,
        ticketId: ticketReplies.ticketId,
        senderId: ticketReplies.senderId,
        senderName: users.name,
        senderRole: users.role,
        message: ticketReplies.message,
        createdAt: ticketReplies.createdAt,
      })
      .from(ticketReplies)
      .innerJoin(users, eq(ticketReplies.senderId, users.id))
      .where(eq(ticketReplies.ticketId, ticketId))
      .orderBy(ticketReplies.createdAt);

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('Ralat membaca replies tiket:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan perbualan tiket.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Akses tidak sah.' }, { status: 401 });
    }

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Sila masukkan mesej balasan.' }, { status: 400 });
    }

    // Semak hak milik tiket
    if (user.role !== 'admin') {
      const ticket = await db
        .select()
        .from(supportTickets)
        .where(and(eq(supportTickets.id, ticketId), eq(supportTickets.userId, user.id)))
        .limit(1)
        .then(r => r[0]);
      if (!ticket) {
        return NextResponse.json({ error: 'Akses dinafikan.' }, { status: 403 });
      }
    }

    const replyId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(ticketReplies).values({
      id: replyId,
      ticketId,
      senderId: user.id,
      message,
      createdAt: now,
    });

    // Kemaskini status tiket
    await db
      .update(supportTickets)
      .set({
        status: user.role === 'admin' ? 'replied' : 'open',
        updatedAt: now,
      })
      .where(eq(supportTickets.id, ticketId));

    const newReply = {
      id: replyId,
      ticketId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message,
      createdAt: now,
    };

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    console.error('Ralat mencipta reply tiket:', error);
    return NextResponse.json(
      { error: 'Gagal menghantar balasan.' },
      { status: 500 }
    );
  }
}
