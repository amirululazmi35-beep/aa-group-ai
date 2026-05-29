import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ralat log keluar:', error);
    return NextResponse.json(
      { error: 'Gagal log keluar dari sistem.' },
      { status: 500 }
    );
  }
}
