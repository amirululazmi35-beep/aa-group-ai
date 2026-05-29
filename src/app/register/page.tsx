'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { User, Mail, Phone, Key, ShieldAlert, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Register() {
  const { user, refetchUser, settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Pendaftaran gagal.');
      }

      await refetchUser(); // Refresh user session
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ralat semasa mendaftar.';
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
              Daftar Akaun
            </h2>
            <p className="text-xs text-text-secondary mt-2">
              Sertai platform {settings.brandName} sekarang.
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
                Nama Penuh
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                />
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

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
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                Nombor Telefon (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: +60123456789"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                />
                <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                Kata Laluan
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 aksara"
                  minLength={6}
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
              {loading ? 'Mendaftar...' : 'Daftar Akaun'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-text-secondary border-t border-border-color pt-6">
            Sudah mempunyai akaun?{' '}
            <Link href="/login" className="text-primary-color font-bold hover:underline">
              Log Masuk
            </Link>
          </div>

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
