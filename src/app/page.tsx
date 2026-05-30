'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JarvisChatbot from '@/components/JarvisChatbot';
import {
  Sparkles, ShieldCheck, Zap, ArrowRight, Star, Clock,
  ChevronRight, Package, Headphones, BadgeCheck
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice: number | null;
  shortDescription: string | null;
  categoryName: string;
  categorySlug: string;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 47, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 47, seconds: 32 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.products.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      title: 'Akaun Stabil & Sah',
      desc: 'Langganan aplikasi 100% rasmi bagi mengelakkan akaun disekat.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      title: 'Penghantaran <10 Minit',
      desc: 'Lesen digital dihantar terus ke emel dan portal dashboard anda.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      title: 'Waranti Penuh 1-ke-1',
      desc: 'Jaminan penggantian lesen baru sekiranya berlaku sebarang masalah.',
    },
  ];

  const testimonials = [
    {
      name: 'Khairul Anwar',
      role: 'Content Creator',
      comment: 'CapCut Pro Premium dari AA memang jimat gila! Kurang 5 minit terus dapat akses. Sangat membantu video editing kerja saya.',
      rating: 5,
      initial: 'K',
    },
    {
      name: 'Norsyazwani',
      role: 'Pelajar UPM',
      comment: 'Canva Pro Lifetime sangat stabil, dah guna masuk 6 bulan tiada masalah. Berbaloi-baloi beli dengan harga bajet.',
      rating: 5,
      initial: 'N',
    },
    {
      name: 'Zulhelmi',
      role: 'Pakar Automasi AI',
      comment: 'Google AI 5TB & Gemini Advanced sangat laju diaktifkan. Bantuan admin di WhatsApp sangat pantas dan mesra.',
      rating: 5,
      initial: 'Z',
    },
  ];

  const stats = [
    { icon: <BadgeCheck className="w-5 h-5" />, value: '5,000+', label: 'Pelanggan Berpuas Hati' },
    { icon: <Package className="w-5 h-5" />, value: '50+', label: 'Produk Digital' },
    { icon: <Headphones className="w-5 h-5" />, value: '24/7', label: 'Sokongan Pelanggan' },
  ];

  return (
    <>
      <Navbar onCartToggle={() => setCartOpen(true)} />

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-bg-primary">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/8 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-600/8 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Selamat Datang ke AA AI GROUP
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-text-primary leading-tight tracking-tight">
            Akses Aplikasi &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Elit Termaju
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Koleksi akaun premium, alatan AI termaju, dan lesen perisian eksklusif — dihantar kurang dari 10 minit dengan waranti penuh.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all group"
            >
              Teroka Katalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border-color bg-card-bg hover:bg-border-color text-text-primary font-bold text-sm transition-all"
            >
              Daftar Akaun Percuma
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-border-color mt-8">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-indigo-400">{s.icon}</div>
                <div className="text-left">
                  <div className="font-black text-lg text-text-primary">{s.value}</div>
                  <div className="text-xs text-text-muted">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="w-full px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 border border-indigo-500/20 p-8 sm:p-10">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-transparent to-purple-600/5 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Text */}
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  Penawaran Terhad
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white max-w-sm">
                  Belilah sekarang — stok terhad, sekali serbu habis!
                </h3>
                <p className="text-sm text-indigo-200/70">
                  Aktivasi lesen digital serta-merta dengan waranti jaminan penuh sehingga 1 tahun.
                </p>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-3 shrink-0">
                {[
                  { val: String(timeLeft.hours).padStart(2, '0'), label: 'JAM' },
                  { val: String(timeLeft.minutes).padStart(2, '0'), label: 'MINIT' },
                  { val: String(timeLeft.seconds).padStart(2, '0'), label: 'SAAT' },
                ].map((t, i, arr) => (
                  <React.Fragment key={i}>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-lg border border-white/10 backdrop-blur-sm">
                        {t.val}
                      </div>
                      <span className="text-[9px] text-indigo-300 font-bold uppercase mt-1.5 block tracking-wider">
                        {t.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-white/50 font-black text-xl mb-4">:</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="w-full px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Kenapa Pilih AA AI GROUP?
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto">
              Kepantasan, kestabilan, dan jaminan sokongan terbaik — itu standard kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-card-bg border border-card-border hover:border-indigo-500/20 transition-all space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <h4 className="font-extrabold text-base text-text-primary">{f.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="w-full px-6 py-16 bg-bg-secondary">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                Produk Paling Hangat
              </h2>
              <p className="text-sm text-text-secondary">Harga promosi terpilih hari ini.</p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group shrink-0"
            >
              Semua Katalog
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-card-bg border border-card-border p-6 space-y-4 animate-pulse">
                  <div className="h-3 w-20 bg-border-color rounded-full" />
                  <div className="h-5 w-3/4 bg-border-color rounded-full" />
                  <div className="h-3 w-full bg-border-color rounded-full" />
                  <div className="h-3 w-2/3 bg-border-color rounded-full" />
                  <div className="flex justify-between items-center pt-4 border-t border-border-color">
                    <div className="h-5 w-16 bg-border-color rounded-full" />
                    <div className="h-8 w-24 bg-border-color rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tiada produk untuk dipaparkan buat masa ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-card-bg border border-card-border hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/5 transition-all flex flex-col p-6 group"
                >
                  <div className="flex-1 space-y-3">
                    <span className="inline-block text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {p.categoryName}
                    </span>
                    <h4 className="font-extrabold text-base text-text-primary leading-snug">{p.name}</h4>
                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                      {p.shortDescription || 'Produk digital premium dengan jaminan aktivasi pantas.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-border-color">
                    <div className="space-y-0.5">
                      {p.comparePrice && (
                        <div className="text-xs text-text-muted line-through">
                          RM{p.comparePrice.toFixed(2)}
                        </div>
                      )}
                      <div className="font-black text-base text-indigo-400">
                        RM{p.price.toFixed(2)}
                      </div>
                    </div>
                    <Link
                      href="/katalog"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all"
                    >
                      Beli Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="w-full px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Apa Kata Pengguna Kami?
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto">
              Lebih 5,000+ pelanggan berpuas hati dengan servis dan sokongan teknikal pantas kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card-bg border border-card-border p-6 flex flex-col justify-between space-y-5"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  &ldquo;{t.comment}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-text-primary">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="w-full px-6 py-20 bg-bg-secondary">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Sedia Bermula?
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Daftar akaun percuma dan dapatkan akses penuh ke katalog produk digital premium kami hari ini.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all group"
            >
              Daftar Percuma Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border-color text-text-secondary hover:text-text-primary hover:bg-border-color font-bold text-sm transition-all"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </section>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <JarvisChatbot />
      <Footer />
    </>
  );
}
