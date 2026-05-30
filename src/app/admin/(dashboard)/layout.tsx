import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('aa_session_id')?.value;

  if (!sessionId) {
    redirect('/login?role=admin');
  }

  return <>{children}</>;
}
