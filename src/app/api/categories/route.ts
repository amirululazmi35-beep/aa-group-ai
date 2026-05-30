import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true));
    return NextResponse.json({ categories: list });
  } catch (error) {
    console.error('Ralat membaca kategori API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan senarai kategori.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses tidak sah. Admin sahaja.' }, { status: 403 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Sila masukkan nama kategori.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryId = crypto.randomUUID();

    await db.insert(categories).values({
      id: categoryId,
      name,
      slug,
      description: description || null,
      isActive: true,
      createdAt: Date.now(),
    });

    const newCat = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1).then(r => r[0]);

    return NextResponse.json({ success: true, category: newCat });
  } catch (error) {
    console.error('Ralat mencipta kategori API:', error);
    return NextResponse.json(
      { error: 'Gagal menambah kategori baru.' },
      { status: 500 }
    );
  }
}
