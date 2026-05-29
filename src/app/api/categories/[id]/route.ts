import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
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

    const { id: categoryId } = await params;
    const { name, description, isActive } = await request.json();

    const existing = await db.select().from(categories).where(eq(categories.id, categoryId)).get();
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak dijumpai.' }, { status: 404 });
    }

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug;

    await db
      .update(categories)
      .set({
        name: name !== undefined ? name : existing.name,
        slug,
        description: description !== undefined ? description : existing.description,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      })
      .where(eq(categories.id, categoryId));

    const updated = await db.select().from(categories).where(eq(categories.id, categoryId)).get();

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Ralat mengemaskini kategori:', error);
    return NextResponse.json(
      { error: 'Gagal mengemaskini kategori.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses tidak sah. Admin sahaja.' }, { status: 403 });
    }

    const { id: categoryId } = await params;

    // Set isActive ke false untuk mengekalkan integriti produk sedia ada
    await db
      .update(categories)
      .set({ isActive: false })
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true, message: 'Kategori berjaya dinyahaktifkan.' });
  } catch (error) {
    console.error('Ralat menyahaktifkan kategori:', error);
    return NextResponse.json(
      { error: 'Gagal memadam kategori.' },
      { status: 500 }
    );
  }
}
