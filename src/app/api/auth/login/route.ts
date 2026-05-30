import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Sila masukkan emel dan kata laluan.' },
        { status: 400 }
      );
    }

    // Cari user dalam database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
      .then(r => r[0]);

    if (!user) {
      return NextResponse.json(
        { error: 'Emel atau kata laluan salah.' },
        { status: 401 }
      );
    }

    // Bandingkan kata laluan
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        { error: 'Emel atau kata laluan salah.' },
        { status: 401 }
      );
    }

    // Cipta session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Ralat log masuk:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman berlaku semasa log masuk.' },
      { status: 500 }
    );
  }
}
