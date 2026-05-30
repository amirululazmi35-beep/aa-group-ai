import { NextResponse } from 'next/server';
import { db } from '@/db';
import { serviceRequests } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses tidak sah. Admin sahaja.' }, { status: 403 });
    }

    const { id: serviceId } = await params;
    const { status, adminNotes } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Sila masukkan status servis.' }, { status: 400 });
    }

    // Semak kewujudan
    const existing = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, serviceId))
      .limit(1)
      .then(r => r[0]);

    if (!existing) {
      return NextResponse.json({ error: 'Permintaan servis tidak ditemui.' }, { status: 404 });
    }

    // Kemaskini
    await db
      .update(serviceRequests)
      .set({
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
        updatedAt: Date.now(),
      })
      .where(eq(serviceRequests.id, serviceId));

    return NextResponse.json({ success: true, message: 'Keadaan servis berjaya dikemaskini.' });
  } catch (error) {
    console.error('Ralat mengemaskini servis admin:', error);
    return NextResponse.json(
      { error: 'Gagal mengemaskini maklumat servis.' },
      { status: 500 }
    );
  }
}
