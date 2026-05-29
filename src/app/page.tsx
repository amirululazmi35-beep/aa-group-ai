'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JarvisChatbot from '@/components/JarvisChatbot';
import { 
  Sparkles, ShieldCheck, Zap, ArrowRight, Star, Clock, 
  ChevronRight
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

  // Countdown timer simulation for CTA urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 5, minutes: 47, seconds: 32 }; // Reset loop
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Ambil 3 produk teratas sebagai featured
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
      icon: <ShieldCheck className="w-6 h-6 text-primary-color" />,
      title: 'Akaun Stabil & Sah',
      desc: 'Langganan aplikasi 100% rasmi bagi mengelakkan akaun disekat.',
    },
    {
      icon: <Zap className="w-6 h-6 text-accent-cyan" />,
      title: 'Penghantaran <10 Minit',
      desc: 'Lesen digital dihantar terus ke emel dan portal dashboard anda.',
    },
    {
      icon: <Clock className="w-6 h-6 text-accent-purple" />,
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
    },
    {
      name: 'Norsyazwani',
      role: 'Pelajar UPM',
      comment: 'Canva Pro Lifetime sangat stabil, dah guna masuk 6 bulan tiada masalah. Berbaloi-baloi beli dengan harga bajet.',
      rating: 5,
    },
    {
      name: 'Zulhelmi',
      role: 'Pakar Automasi AI',
      comment: 'Google AI 5TB & Gemini Advanced sangat laju diaktifkan. Bantuan admin di WhatsApp sangat pantas dan mesra.',
      rating: 5,
    },
  ];

  return (
    <>
      <Navbar onCartToggle={() => setCartOpen(true)} />
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-28 overflow-hidden bg-bg-primary">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary-color/10 to-accent-cyan/10 blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute -top-40 right-10 w-96 h-96 rounded-full bg-accent-purple/5 blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary-color/20 bg-primary-color/5 text-primary-color text-xs font-bold uppercase tracking-wider mx-auto animate-bounce">
            <Sparkles className="w-3.5 h-3.5" /> Selamat Datang ke AA AI GROUP
          </div>

          {/* Slogan */}
          <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto leading-tight">
            Akses Aplikasi &{' '}
            <span className="bg-gradient-to-r from-primary-color via-accent-cyan to-accent-purple bg-clip-text text-transparent">
              AI Elit Termaju
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Membawakan koleksi akaun premium, alatan kecerdasan buatan (AI) termaju, dan lesen perisian eksklusif yang direka untuk meningkatkan produktiviti dan kreativiti digital anda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/katalog"
              className="w-full sm:w-auto p-4 px-8 rounded-xl bg-primary-color hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary-glow flex items-center justify-center gap-2 group transition-all"
            >
              Teroka Produk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto p-4 px-8 rounded-xl border border-border-color bg-card-bg hover:bg-border-color text-text-primary font-bold text-sm transition-all"
            >
              Daftar Akaun Pelanggan
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Urgent Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-indigo-900 border border-primary-color/20 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
              Penawaran Terhad
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Belilah sekarang, produk terhad sekali serbu dah habis!
            </h3>
            <p className="text-xs text-indigo-200">
              Aktivasi lesen digital serta-merta dengan waranti jaminan penuh sehingga 1 tahun.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-sm border border-white/10">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-indigo-300 font-bold uppercase mt-1 block">Jam</span>
            </div>
            <span className="text-white font-black text-lg">:</span>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-sm border border-white/10">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-indigo-300 font-bold uppercase mt-1 block">Minit</span>
            </div>
            <span className="text-white font-black text-lg">:</span>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-sm border border-white/10">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[9px] text-indigo-300 font-bold uppercase mt-1 block">Saat</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">Kenapa Pilih AA AI GROUP?</h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2">
            Kami mementingkan kepantasan, kestabilan perisian, dan jaminan sokongan terbaik untuk anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-glass-border space-y-4 hover:shadow-md hover:shadow-primary-glow/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-border-color flex items-center justify-center shadow-inner">
                {f.icon}
              </div>
              <h4 className="font-extrabold text-base text-text-primary">{f.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Mini Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">Produk Paling Hangat</h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">Dapatkan harga promosi terpilih hari ini.</p>
          </div>
          <Link
            href="/katalog"
            className="flex items-center gap-1 text-xs font-bold text-primary-color hover:text-primary-hover group"
          >
            Teroka Semua Katalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-2xl overflow-hidden border border-glass-border flex flex-col justify-between p-6 hover:shadow-lg hover:shadow-primary-glow/5 transition-all"
              >
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-primary-color uppercase tracking-wider bg-primary-color/10 px-2 py-0.5 rounded-full border border-primary-color/20 inline-block">
                    {p.categoryName}
                  </span>
                  <h4 className="font-extrabold text-sm text-text-primary">{p.name}</h4>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {p.shortDescription || 'Tiada penerangan ringkas disediakan.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-border-color">
                  <div>
                    {p.comparePrice && (
                      <span className="text-xs text-text-muted line-through mr-1.5 font-medium">
                        RM{p.comparePrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-black text-sm text-primary-color">RM{p.price.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/katalog"
                    className="bg-primary-color hover:bg-primary-hover text-white text-xs font-bold p-2 px-4 rounded-xl shadow-sm shadow-primary-glow"
                  >
                    Butiran & Beli
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">Apa Kata Pengguna Kami?</h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2">
            Lebih 5,000+ pelanggan berpuas hati dengan servis dan sokongan teknikal pantas kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-glass-border flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="pt-4 border-t border-border-color flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color font-bold text-xs">
                  {t.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-text-primary">{t.name}</h5>
                  <span className="text-[10px] text-text-muted">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Sidebar/Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Jarvis Chatbot */}
      <JarvisChatbot />

      <Footer />
    </>
  );
}
