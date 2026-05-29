import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Ralat API me:', error);
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman semasa semakan session.' },
      { status: 500 }
    );
  }
}
