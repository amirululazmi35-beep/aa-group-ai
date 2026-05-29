import { NextResponse } from 'next/server';
import { db } from '@/db';
import { videoLessons, digitalAccess } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Ambil senarai video pelajaran
    const lessons = await db
      .select()
      .from(videoLessons)
      .where(eq(videoLessons.productId, productId))
      .orderBy(videoLessons.sortOrder)
      .all();

    // Semak jika user logged in dan telah membeli course ini
    const user = await getSession();
    let hasAccess = false;

    if (user) {
      if (user.role === 'admin') {
        hasAccess = true;
      } else {
        const accessRecord = await db
          .select()
          .from(digitalAccess)
          .where(
            and(
              eq(digitalAccess.userId, user.id),
              eq(digitalAccess.productId, productId),
              eq(digitalAccess.accessStatus, 'active')
            )
          )
          .get();
        if (accessRecord) hasAccess = true;
      }
    }

    // Tapis videoUrl jika tiada akses dan isPreview = false
    const filteredLessons = lessons.map((lesson) => {
      if (hasAccess || lesson.isPreview) {
        return lesson;
      }
      return {
        ...lesson,
        videoUrl: '', // Kosongkan URL untuk perlindungan kandungan
      };
    });

    return NextResponse.json({ lessons: filteredLessons, hasAccess });
  } catch (error) {
    console.error('Ralat membaca video lessons:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan video pelajaran.' },
      { status: 500 }
    );
  }
}
