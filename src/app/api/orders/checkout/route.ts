import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Sila log masuk atau daftar akaun terlebih dahulu untuk membuat pesanan.' },
        { status: 401 }
      );
    }

    const { items, paymentMethod, paymentReference, paymentReceiptBase64 } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Troli anda kosong. Sila pilih sekurang-kurangnya satu produk.' },
        { status: 400 }
      );
    }

    // Kira jumlah keseluruhan order
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Simpan resit bayaran jika ada base64
    let receiptUrl = null;
    if (paymentReceiptBase64) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const matches = paymentReceiptBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1].split('/')[1] || 'jpg';
          const fileBuffer = Buffer.from(matches[2], 'base64');
          const fileName = `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, fileBuffer);
          receiptUrl = `/uploads/${fileName}`;
        }
      } catch (err) {
        console.error('Gagal menyimpan resit bayaran:', err);
      }
    }

    // Format order ID: AAOD-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `AAOD-${dateStr}-${randomNum}`;
    const now = Date.now();
    const createdDate = new Date().toLocaleString('ms-MY');

    // Masukkan rekod pesanan baru
    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      totalAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'manual_transfer',
      paymentReference: paymentReference || null,
      paymentReceiptUrl: receiptUrl,
      createdDate,
      createdAt: now,
      updatedAt: now,
    });

    // Masukkan order items
    for (const item of items) {
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId,
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      totalAmount,
      createdDate,
      paymentMethod,
    });
  } catch (error) {
    console.error('Ralat API checkout:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman berlaku semasa memproses pesanan.' },
      { status: 500 }
    );
  }
}
