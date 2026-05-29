import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const config = await db.select().from(settings).where(eq(settings.id, 'default-settings')).get();
    
    // Jika tiada settings, gunakan fallback
    const fallbackSettings = {
      brandName: 'AA AI GROUP',
      logoUrl: '/logo.png',
      supportEmail: 'support@aa-aigroup.com',
      supportPhone: '+601118715341',
      themeColor: '#6366f1',
      qrUrl: '/qr.jpg',
      whatsappNumber: '601118715341',
      maintenanceMode: false,
      maintenanceMessage: 'Website sedang dinaik taraf.',
    };

    return NextResponse.json({ settings: config || fallbackSettings });
  } catch (error) {
    console.error('Ralat membaca settings API:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan tetapan platform.' },
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

    const { brandName, logoUrl, supportEmail, supportPhone, themeColor, qrUrl, whatsappNumber, maintenanceMode, maintenanceMessage } = await request.json();

    if (!brandName || !supportEmail || !supportPhone) {
      return NextResponse.json({ error: 'Sila lengkapkan nama kedai, emel, dan no telefon.' }, { status: 400 });
    }

    const defaultId = 'default-settings';

    // Insert or update
    await db.insert(settings).values({
      id: defaultId,
      brandName,
      logoUrl: logoUrl || '/logo.png',
      supportEmail,
      supportPhone,
      themeColor: themeColor || '#6366f1',
      qrUrl: qrUrl || '/qr.jpg',
      whatsappNumber: whatsappNumber || '601118715341',
      maintenanceMode: !!maintenanceMode,
      maintenanceMessage: maintenanceMessage || 'Website sedang dinaik taraf.',
      updatedAt: Date.now(),
    }).onConflictDoUpdate({
      target: settings.id,
      set: {
        brandName,
        logoUrl: logoUrl || '/logo.png',
        supportEmail,
        supportPhone,
        themeColor: themeColor || '#6366f1',
        qrUrl: qrUrl || '/qr.jpg',
        whatsappNumber: whatsappNumber || '601118715341',
        maintenanceMode: !!maintenanceMode,
        maintenanceMessage: maintenanceMessage || 'Website sedang dinaik taraf.',
        updatedAt: Date.now(),
      }
    });

    const updated = await db.select().from(settings).where(eq(settings.id, 'default-settings')).get();

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Ralat mengemaskini settings API:', error);
    return NextResponse.json(
      { error: 'Gagal mengemaskini tetapan.' },
      { status: 500 }
    );
  }
}
