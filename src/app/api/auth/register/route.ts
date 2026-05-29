import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Sila lengkapkan nama, emel, dan kata laluan.' },
        { status: 400 }
      );
    }

    // Semak jika emel telah digunakan
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .get();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Emel ini telah berdaftar. Sila gunakan emel lain.' },
        { status: 400 }
      );
    }

    // Hash kata laluan
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    // Simpan user baru
    await db.insert(users).values({
      id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: 'customer',
      phone: phone || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Cipta session
    await createSession(userId);

    return NextResponse.json({
      success: true,
      user: { id: userId, name, email, role: 'customer' },
    });
  } catch (error) {
    console.error('Ralat pendaftaran:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman berlaku semasa pendaftaran.' },
      { status: 500 }
    );
  }
}
