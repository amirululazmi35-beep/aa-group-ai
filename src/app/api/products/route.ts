import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and, like, or } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const query = db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        name: products.name,
        slug: products.slug,
        type: products.type,
        shortDescription: products.shortDescription,
        description: products.description,
        price: products.price,
        comparePrice: products.comparePrice,
        thumbnailUrl: products.thumbnailUrl,
        status: products.status,
        accessType: products.accessType,
        accessValue: products.accessValue,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id));

    const conditions = [];

    // Filter by status (public can only see published)
    const user = await getSession();
    if (!user || user.role !== 'admin') {
      conditions.push(eq(products.status, 'published'));
    }

    // Filter by category slug
    if (categorySlug && categorySlug !== 'all' && categorySlug !== 'Semua') {
      conditions.push(eq(categories.slug, categorySlug));
    }

    // Filter by search query
    if (searchQuery) {
      conditions.push(
        or(
          like(products.name, `%${searchQuery}%`),
          like(products.shortDescription, `%${searchQuery}%`)
        )
      );
    }

    let list;
    if (conditions.length > 0) {
      list = await query.where(and(...conditions));
    } else {
      list = await query;
    }

    return NextResponse.json({ products: list });
  } catch (error) {
    console.error('Ralat membaca produk API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan senarai produk.' },
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
    } = await request.json();

    if (!name || !categoryId || !type || price === undefined || !accessType) {
      return NextResponse.json(
        { error: 'Sila lengkapkan semua maklumat produk mandatori.' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(products).values({
      id: productId,
      categoryId,
      name,
      slug,
      type,
      shortDescription: shortDescription || null,
      description: description || null,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      thumbnailUrl: thumbnailUrl || null,
      status: status || 'published',
      accessType,
      accessValue: accessValue || null,
      createdAt: now,
      updatedAt: now,
    });

    const newProd = await db.select().from(products).where(eq(products.id, productId)).limit(1).then(r => r[0]);

    return NextResponse.json({ success: true, product: newProd });
  } catch (error) {
    console.error('Ralat mencipta produk API:', error);
    return NextResponse.json(
      { error: 'Gagal menambah produk baru.' },
      { status: 500 }
    );
  }
}
