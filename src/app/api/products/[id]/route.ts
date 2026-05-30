import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
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

    const { id: productId } = await params;
    const body = await request.json();

    const {
      name,
      categoryId,
      type,
      shortDescription,
      description,
      price,
      comparePrice,
      thumbnailUrl,
      status,
      accessType,
      accessValue,
    } = body;

    // Pastikan produk wujud
    const existing = await db.select().from(products).where(eq(products.id, productId)).limit(1).then(r => r[0]);
    if (!existing) {
      return NextResponse.json({ error: 'Produk tidak dijumpai.' }, { status: 404 });
    }

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug;

    await db
      .update(products)
      .set({
        name: name !== undefined ? name : existing.name,
        slug,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        type: type !== undefined ? type : existing.type,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        description: description !== undefined ? description : existing.description,
        price: price !== undefined ? parseFloat(price) : existing.price,
        comparePrice: comparePrice !== undefined ? (comparePrice ? parseFloat(comparePrice) : null) : existing.comparePrice,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : existing.thumbnailUrl,
        status: status !== undefined ? status : existing.status,
        accessType: accessType !== undefined ? accessType : existing.accessType,
        accessValue: accessValue !== undefined ? accessValue : existing.accessValue,
        updatedAt: Date.now(),
      })
      .where(eq(products.id, productId));

    const updated = await db.select().from(products).where(eq(products.id, productId)).limit(1).then(r => r[0]);

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Ralat mengemaskini produk:', error);
    return NextResponse.json(
      { error: 'Gagal mengemaskini produk.' },
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

    const { id: productId } = await params;

    // Padam atau set status ke archived untuk mengekalkan integriti rujukan orders
    await db
      .update(products)
      .set({ status: 'archived', updatedAt: Date.now() })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true, message: 'Produk berjaya diarkibkan.' });
  } catch (error) {
    console.error('Ralat memadam produk:', error);
    return NextResponse.json(
      { error: 'Gagal memadam produk.' },
      { status: 500 }
    );
  }
}
