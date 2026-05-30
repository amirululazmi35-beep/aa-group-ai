import { cookies } from 'next/headers';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'aa_session_id';

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });

  return sessionId;
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return null;

    const result = await db
      .select({
        session: sessions,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          phone: users.phone,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1)
      .then(r => r[0]);

    if (!result) return null;

    const { session, user } = result;

    if (Date.now() > session.expiresAt) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Ralat membaca session:', error);
    return null;
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error('Ralat memusnahkan session:', error);
  }
}
