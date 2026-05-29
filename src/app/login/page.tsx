'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Key, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function LoginContent() {
  const { user, refetchUser, settings } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get('role');

  // Jika user dah login, redirect ke page yang bersesuaian
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Emel atau kata laluan salah.');
      }

      await refetchUser(); // Refresh global user state
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ralat log masuk.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-bg-primary relative overflow-hidden">
        {/* Glow decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary-color/10 blur-[80px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent-cyan/10 blur-[80px] -z-10 pointer-events-none" />

        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-xl border border-glass-border">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-color to-accent-cyan flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-primary-glow mb-4">
              AA
            </div>
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              Log Masuk {roleParam === 'admin' && 'Pentadbir'}
            </h2>
            <p className="text-xs text-text-secondary mt-2">
              Sila masukkan kelayakan akaun {settings.brandName} anda.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                Alamat Emel
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide">
                  Kata Laluan
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                />
                <Key className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-xl bg-primary-color hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-primary-glow transition-all flex items-center justify-center gap-1.5 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Log masuk...' : 'Log Masuk'}
            </button>
          </form>

          {roleParam !== 'admin' && (
            <div className="mt-6 text-center text-xs text-text-secondary border-t border-border-color pt-6">
              Belum mempunyai akaun?{' '}
              <Link href="/register" className="text-primary-color font-bold hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Laman Utama
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-bg-primary min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
