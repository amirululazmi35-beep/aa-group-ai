"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Terminal, 
  PlayCircle, 
  Cpu, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  HelpCircle, 
  ChevronRight, 
  User, 
  MessageSquare, 
  Search, 
  Filter, 
  BookOpen, 
  Flame, 
  ChevronDown,
  Lock,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Product Data
interface Product {
  id: string;
  name: string;
  category: "app" | "course" | "service" | "subscription" | "bundle";
  price: number;
  description: string;
  features: string[];
  image: string;
  tag?: string;
  glowColor: string;
}

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "AA AutoBot AI Premium",
    category: "app",
    price: 199,
    description: "Sistem automasi pemasaran media sosial dipacu kecerdasan buatan untuk Facebook, Telegram, dan Discord.",
    features: ["Automasi Siaran 24/7", "Penjana Artikel AI", "Analitis Sentimen", "Lesen Sepanjang Hayat"],
    image: "🤖",
    tag: "Terlaris",
    glowColor: "rgba(6, 182, 212, 0.4)" // cyan
  },
  {
    id: "prod-2",
    name: "AA Vision Analyser Pro",
    category: "app",
    price: 149,
    description: "Analisis grafik dan wajah berkuasa AI untuk pemprosesan imej masa nyata dalam sistem sekuriti.",
    features: ["Pengecaman Objek 99.9%", "Uptime Rendah", "Integrasi API Mudah", "SDK Sedia Guna"],
    image: "👁️",
    glowColor: "rgba(16, 185, 129, 0.4)" // emerald
  },
  {
    id: "prod-3",
    name: "AI Prompt Masterclass: Midjourney & ChatGPT",
    category: "course",
    price: 99,
    description: "Kuasai kemahiran kejuruteraan prompt untuk menjana visual premium dan copywriting berkelas dunia.",
    features: ["12 Modul Video 4K", "1000+ Senarai Prompt VIP", "Sijil Profesional", "Akses Komuniti VIP"],
    image: "🎥",
    tag: "Popular",
    glowColor: "rgba(139, 92, 246, 0.4)" // purple
  },
  {
    id: "prod-4",
    name: "AA Agentic AI Builder Course",
    category: "course",
    price: 129,
    description: "Bina ejen AI autonomi yang mampu menyelesaikan tugas rumit secara berkumpulan tanpa seliaan.",
    features: ["8 Modul Pengekodan", "Template Node.js & Python", "Sesi Soal Jawab Khas", "Sijil Tamat Latihan"],
    image: "💻",
    glowColor: "rgba(37, 99, 235, 0.4)" // blue
  },
  {
    id: "prod-5",
    name: "Penyediaan Custom AI Chatbot Syarikat",
    category: "service",
    price: 499,
    description: "Kami membina dan melatih ejen AI khas yang mahir dengan data perniagaan dan fail dokumentasi syarikat anda.",
    features: ["Latihan Pangkalan Data", "Integrasi WhatsApp & Web", "Penyelenggaraan 3 Bulan", "SLA Sokongan Pantas"],
    image: "💼",
    glowColor: "rgba(245, 158, 11, 0.4)" // gold
  },
  {
    id: "prod-6",
    name: "AA AI Group VIP Membership (Pro)",
    category: "subscription",
    price: 49,
    description: "Akses tanpa had ke semua aplikasi web AI, pangkalan video mingguan, dan sesi konsultasi peribadi.",
    features: ["Semua Aplikasi Akses Bebas", "Kelas Live Setiap Sabtu", "Khidmat Pelanggan VIP", "Batalkan Bila-Bila Masa"],
    image: "👑",
    tag: "VIP",
    glowColor: "rgba(234, 179, 8, 0.5)" // gold
  },
  {
    id: "prod-7",
    name: "Ecosystem Launch Bundle (All-in-One)",
    category: "bundle",
    price: 699,
    description: "Batalkan sekatan. Miliki semua aplikasi premium, kursus video, dan konsultasi 1-pada-1 dalam satu harga jimat.",
    features: ["Akses Semua App Seumur Hidup", "Akses Semua Kursus", "Servis Chatbot 1 Unit", "Ganjaran 1000 Referral Points"],
    image: "🎁",
    tag: "Penjimatan 50%",
    glowColor: "rgba(236, 72, 153, 0.4)" // pink
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "assistant" | "user"; text: string; products?: any[] }>>([
    { role: "assistant", text: "Hai! Saya Pembantu Sokongan AI AA GROUP. Ada sebarang soalan tentang produk digital, cara akses lesen, program keahlian, atau komisen rujukan? Sila tanya saya! 🤖" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Background particle position simulation
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 30 - 15,
        y: (e.clientY / window.innerHeight) * 30 - 15
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const processAiQuery = (queryText: string) => {
    let reply = "Maaf, saya tidak berapa faham. Sila gunakan butang tindakan pantas di bawah atau hubungi pasukan bantuan kami di Tab 'Tiket Sokongan' jika perlukan bantuan manual.";
    let recommendedProducts: Product[] | undefined = undefined;
    const lower = queryText.toLowerCase();

    if (lower.includes("rekomendasi") || lower.includes("produk") || lower.includes("pakej") || lower.includes("pilih") || lower.includes("harga")) {
      reply = "Berdasarkan carian anda, berikut adalah beberapa produk AI premium terlaris kami yang disyorkan:";
      recommendedProducts = mockProducts.slice(0, 3);
    } else if (lower.includes("lesen") || lower.includes("akses") || lower.includes("kunci") || lower.includes("muat turun")) {
      reply = "Untuk mengakses lesen produk digital anda: Log masuk ke Portal Pelanggan, pergi ke tab 'Akses Produk'. Di sana anda boleh menyalin Kunci Lesen dan memuat turun installer perisian anda secara langsung! 🔑";
    } else if (lower.includes("keahlian") || lower.includes("membership") || lower.includes("vip") || lower.includes("langgan")) {
      reply = "AA AI GROUP menawarkan 4 tier keahlian:\n1. Free Member: Keahlian percuma.\n2. Basic Member: Akses produk digital standard.\n3. Premium Member: Diskaun 10% automatik di Checkout.\n4. VIP Member: Diskaun 20% tanpa had & tontonan video pelajaran VIP khas! 👑";
    } else if (lower.includes("tiket") || lower.includes("sokongan") || lower.includes("bantuan") || lower.includes("masalah") || lower.includes("isu")) {
      reply = "Jika anda menghadapi sebarang ralat teknikal, sila log masuk ke portal dan buka tiket bantuan baru di tab 'Tiket Sokongan'. Ejen ejen bantuan kami akan menyelesaikan isu anda dengan kadar segera! 🎫";
    } else if (lower.includes("bot") || lower.includes("autobot") || lower.includes("automasi")) {
      reply = "Untuk automasi siaran media sosial 24/7, kami mengesyorkan 'AA AutoBot AI Premium' (RM 199).";
      recommendedProducts = [mockProducts[0]];
    } else if (lower.includes("kursus") || lower.includes("video") || lower.includes("prompt")) {
      reply = "Kuasai kejuruteraan prompt dengan 'AI Prompt Masterclass' (RM 99) kami yang dilengkapi 12 modul video HD.";
      recommendedProducts = [mockProducts[2]];
    }

    setChatMessages(prev => [...prev, { role: "assistant", text: reply, products: recommendedProducts }]);
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      processAiQuery(userText);
    }, 600);
  };

  const filteredProducts = mockProducts.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#030303] text-slate-100 min-height-screen font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Background Neon Gradients */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none opacity-20 transition-transform duration-300"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)",
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
        }}
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px] pointer-events-none opacity-25 transition-transform duration-300"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)",
          transform: `translate(${mousePosition.x * -0.6}px, ${mousePosition.y * -0.6}px)`
        }}
      />
      <div 
        className="absolute bottom-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
        }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black px-3 py-1 rounded-lg text-white font-extrabold text-lg tracking-wider border border-white/10">
                AA
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI GROUP
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">Utama</a>
            <a href="#kategori" className="hover:text-cyan-400 transition-colors">Produk</a>
            <a href="#kelebihan" className="hover:text-cyan-400 transition-colors">Kelebihan</a>
            <a href="#cara-kerja" className="hover:text-cyan-400 transition-colors">Proses</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">Soalan Lazim</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#katalog" className="relative group hidden sm:inline-flex">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <button className="relative bg-zinc-950 hover:bg-zinc-900 border border-white/10 px-5 py-2 rounded-full text-xs font-semibold text-white transition duration-200">
                Hubungi Kami
              </button>
            </a>
            <a href="#katalog">
              <Button className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white rounded-full font-bold hover:brightness-110 shadow-lg shadow-cyan-500/20 text-xs px-5 py-2">
                Dapatkan Akses
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 md:pt-40 pb-20 md:pb-28 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>THE FUTURE OF DIGITAL AI ECOSYSTEM</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MEMBINA MASA DEPAN <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                EKOSISTEM DIGITAL AI
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Access premium AI apps, digital services, automation systems, and AI education in one powerful platform. Dipacu oleh teknologi AI termaju untuk mengoptimumkan perniagaan anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href="#katalog" className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:brightness-110 font-bold px-8 py-6 rounded-xl shadow-xl shadow-cyan-400/20 text-sm flex items-center gap-2">
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </a>
              <a href="#membership" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 bg-transparent text-white font-bold px-8 py-6 rounded-xl text-sm flex items-center gap-2">
                  <span>Join Membership</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </Button>
              </a>
            </div>

            {/* Float badges */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Automatik & Selamat</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Teknologi Autonomi</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span>Komuniti VIP Eksklusif</span>
              </div>
            </div>
          </div>

          {/* Right Hologram Preview */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Ambient glows behind hologram */}
            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-[60px] animate-pulse"></div>
            <div className="absolute w-60 h-60 rounded-full bg-purple-500/10 blur-[80px] delay-1000"></div>

            <div className="relative w-full max-w-[400px] aspect-square rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-md p-6 overflow-hidden shadow-2xl shadow-cyan-500/5 group hover:border-cyan-500/30 transition-all duration-500">
              
              {/* Fake coding panel */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>aa-ai-group.sh</span>
                </div>
              </div>

              <div className="space-y-4 font-mono text-left">
                <div className="text-[11px] text-purple-400">
                  <span className="text-cyan-400">const</span> ecosystem = <span className="text-amber-400">new</span> <span className="text-emerald-400">AA_AI_Group</span>();
                </div>
                <div className="text-[11px] text-slate-500">
                  {"// Inisialisasi ejen autonomi..."}
                </div>
                <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2 text-[10px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Active Bots</span>
                    <span className="text-cyan-400 font-bold">14 Bots</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>System Load</span>
                    <span className="text-emerald-400 font-bold">0.03ms (Healthy)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>FPX Gateway</span>
                    <span className="text-cyan-300 font-bold">Simulated</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-lg p-2.5 text-center">
                    <span className="text-[11px] font-bold text-cyan-300">AUTO-POST BOTS</span>
                    <div className="text-[16px] font-black text-white mt-1">ACTIVE</div>
                  </div>
                  <div className="flex-1 bg-zinc-900 border border-white/5 rounded-lg p-2.5 text-center">
                    <span className="text-[11px] text-slate-400">VIP POINTS</span>
                    <div className="text-[16px] font-black text-amber-400 mt-1">RM 250k+</div>
                  </div>
                </div>
              </div>

              {/* Floating micro cards */}
              <div className="absolute bottom-6 right-6 bg-zinc-950/90 border border-cyan-500/30 rounded-xl p-3 shadow-2xl flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">LATEST DEPLOY</div>
                  <div className="text-xs font-bold text-white">AutoBot Premium</div>
                </div>
              </div>

              <div className="absolute top-20 left-4 bg-zinc-950/90 border border-purple-500/30 rounded-xl p-3 shadow-2xl flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Referral Bonus</div>
                  <div className="text-xs font-bold text-amber-400">+100 Points</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="kategori" className="py-16 md:py-24 border-y border-white/5 bg-zinc-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              KATEGORI EKOSISTEM DIGITAL
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Setiap komponen direka khas untuk bersambung secara pintar, membolehkan automasi menyeluruh bagi aliran kerja perniagaan anda.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { title: "App Premium", desc: "Aplikasi Terbina & Utiliti", icon: Bot, color: "text-cyan-400", bg: "bg-cyan-500/5", border: "hover:border-cyan-500/30" },
              { title: "Video Education AI", desc: "Kursus Modular Premium", icon: PlayCircle, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "hover:border-emerald-500/30" },
              { title: "Digital Services", desc: "Penyelesaian Pengekodan Khas", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/5", border: "hover:border-blue-500/30" },
              { title: "Membership", desc: "Akses VIP Kelab Eksklusif", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-500/5", border: "hover:border-amber-500/30" },
              { title: "Subscription", desc: "Langganan Bulanan Fleksibel", icon: Layers, color: "text-purple-400", bg: "bg-purple-500/5", border: "hover:border-purple-500/30" },
              { title: "Bundles", desc: "Semua-dalam-Satu Nilai Penjimatan", icon: Gift, color: "text-rose-400", bg: "bg-rose-500/5", border: "hover:border-rose-500/30" }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                className={`glass-card p-6 rounded-2xl border border-white/5 bg-zinc-950/60 flex flex-col justify-center items-center text-center space-y-4 transition-all duration-300 cursor-pointer ${cat.border}`}
                onClick={() => {
                  let mappedCat = "all";
                  if (cat.title === "App Premium") mappedCat = "app";
                  else if (cat.title === "Video Education AI") mappedCat = "course";
                  else if (cat.title === "Digital Services") mappedCat = "service";
                  else if (cat.title === "Subscription") mappedCat = "subscription";
                  else if (cat.title === "Bundles") mappedCat = "bundle";
                  setActiveCategory(mappedCat);
                  const el = document.getElementById("katalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{cat.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog - Interactive Product Grid */}
      <section id="katalog" className="py-20 md:py-28 max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Katalog Ekosistem</div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              PILIH TEKNOLOGI ANDA
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Gunakan penapis kategori di bawah untuk mencari aplikasi premium, kursus video, atau servis pembinaan chatbot khas syarikat.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Category filtering pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/5">
          {[
            { id: "all", label: "Semua Produk", icon: Compass },
            { id: "app", label: "Premium Apps", icon: Bot },
            { id: "course", label: "Video Education AI", icon: PlayCircle },
            { id: "service", label: "Digital Services", icon: Cpu },
            { id: "subscription", label: "VIP Subscription", icon: Sparkles },
            { id: "bundle", label: "Premium Bundles", icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 ${
                activeCategory === tab.id 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500 text-cyan-300"
                  : "bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Grid display */}
        {filteredProducts.length === 0 ? (
          <div className="glass-card p-16 text-center border border-white/5 rounded-3xl bg-zinc-950/40">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Tiada Produk Ditemui</h3>
            <p className="text-slate-400 text-xs mt-2">Cuba tukar kata kunci carian atau pilih tab kategori yang lain.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div 
                key={p.id} 
                className="relative group rounded-3xl border border-white/5 bg-zinc-950/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col min-h-[440px]"
                style={{
                  boxShadow: `0 0 30px -10px ${p.glowColor}`
                }}
              >
                {/* Visual card header glow accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 blur-[3px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.glowColor}, transparent)`
                  }}
                />

                {/* Card Header */}
                <div className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl">{p.image}</span>
                    {p.tag && (
                      <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                    {p.name}
                  </h3>
                  <span className="inline-block bg-white/5 text-slate-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2">
                    {p.category === "course" ? "Video Course" : p.category === "app" ? "Software App" : p.category.toUpperCase()}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-2 flex-grow space-y-4">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {p.description}
                  </p>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Kelebihan Utama:</div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {p.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-cyan-400">✦</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 border-t border-white/5 mt-auto flex justify-between items-center bg-black/20">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">Harga Pelancaran</span>
                    <span className="text-2xl font-black text-white">
                      RM {p.price}
                      {p.category === "subscription" && <span className="text-xs font-normal text-slate-500">/bln</span>}
                    </span>
                  </div>

                  <a href={`/checkout?prod=${p.id}`} className="inline-flex">
                    <Button className="bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-cyan-500 text-white rounded-xl text-xs font-bold transition-all duration-300 py-5">
                      <span>Dapatkan Akses</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Membership Benefits */}
      <section id="membership" className="py-20 md:py-28 relative z-10 bg-zinc-950/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                👑 KEAHLIAN VIP PLATINUM
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                SATU LANGGANAN VIP <br />
                <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  AKSES TANPA HAD KESELURUHAN
                </span>
              </h2>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Jadilah sebahagian daripada komuniti eksklusif AA AI GROUP. Membership ini memberikan anda hak akses premium kepada semua sistem yang dihoskan, kemas kini perisian secara automatik, dan talian bantuan terus.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Semua App Percuma", desc: "Muat turun percuma versi pro" },
                  { title: "Akses Kursus Baru", desc: "Tiada cas tambahan untuk video" },
                  { title: "Konsultasi 1-pada-1", desc: "Konsultasi sistem AI perniagaan" },
                  { title: "Komuniti Premium", desc: "Sembang rangkaian usahawan AI" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 text-[10px]">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side Pricing Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group w-full max-w-[420px]">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-zinc-950 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6">
                  
                  <div className="inline-block bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-amber-400/20">
                    Syor Utama
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">AA AI VIP MEMBERSHIP</h3>
                    <p className="text-xs text-slate-500 mt-1">Akses penuh ekosistem AI perniagaan</p>
                  </div>

                  <div className="py-4 border-y border-white/5">
                    <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Harga Bulanan</span>
                    <span className="text-5xl font-black text-white bg-gradient-to-b from-white to-amber-300 bg-clip-text text-transparent">
                      RM 49
                    </span>
                    <span className="text-slate-500 text-xs font-normal"> /sebulan</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-400 text-left max-w-xs mx-auto">
                    <li className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Akses Tanpa Had AA AutoBot AI Premium</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>12 Modul Kursus ChatGPT & Midjourney</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Tiket Sokongan Priority Kelulusan Pantas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span>Akses Segera Kemas Kini API Terbina</span>
                    </li>
                  </ul>

                  <a href="/checkout?prod=prod-6" className="block w-full pt-4">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:brightness-115 text-black font-extrabold py-6 rounded-2xl shadow-xl shadow-yellow-500/10">
                      Sertai Membership Sekarang
                    </Button>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="cara-kerja" className="py-20 md:py-28 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 mb-16 text-center">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Aliran Kerja</div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            PROSES PENGHANTARAN AUTOMATIK
          </h2>
          <p className="text-slate-400 text-sm">
            Bagaimana ekosistem kami membekalkan akses fail, video pembelajaran dan pengesahan pembayaran sekelip mata.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 z-1"></div>

          {[
            { step: "01", title: "Pilih & Bayar", desc: "Pilih produk dari katalog kami dan selesaikan bayaran melalui FPX dengan sistem kelulusan serta-merta.", icon: Search, glow: "cyan" },
            { step: "02", title: "Terima Akses Dashboard", desc: "Anda akan dipindahkan ke Dashboard Pelanggan automatik. Setup fail dan streaming video dibuka terus.", icon: Layers, glow: "blue" },
            { step: "03", title: "Urus & Kembangkan", desc: "Tonton video pembelajaran, jejak status servis kustom syarikat anda, atau kumpul mata referral ganjaran.", icon: Cpu, glow: "purple" }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 glass-card p-8 rounded-3xl border border-white/5 bg-zinc-950/60 space-y-4 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/10 text-white font-black text-sm`}>
                  {item.step}
                </div>
                <item.icon className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="font-extrabold text-lg text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 relative z-10 bg-zinc-950/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-4 mb-16 text-center">
            <div className="text-purple-400 text-xs font-bold uppercase tracking-widest">Testimonial</div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              APA KATA PENGGUNA KAMI
            </h2>
            <p className="text-slate-400 text-sm">
              Maklum balas tulen daripada pemilik perniagaan dan pemaju sistem yang telah beralih ke AA AI GROUP.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Khairul Nizam", role: "Usahawan E-Dagang", feedback: "AA AutoBot AI Premium sangat membantu! Sebelum ini saya habiskan 3 jam sehari untuk menyiarkan promosi di media sosial. Kini segalanya berjalan secara auto 24/7 dipacu penjana kandungan AI.", stars: "⭐⭐⭐⭐⭐" },
              { name: "Siti Aminah", role: "Pemaju Web Bebas", feedback: "Pemain video kursus AI Prompt Masterclass di dashboard adalah yang paling lancar saya pernah guna. Penerangan yang modular memudahkan saya menguasai Midjourney v6 untuk grafik komersial pelanggan.", stars: "⭐⭐⭐⭐⭐" },
              { name: "Marcus Lim", role: "Pengarah Operasi Tech", feedback: "Servis Custom Chatbot Syarikat sangat profesional. Pihak AA AI Group membantu melatih AI tersebut menggunakan fail SOP kami. Integrasi di laman web syarikat kami selesai dalam masa 3 hari.", stars: "⭐⭐⭐⭐⭐" }
            ].map((test, idx) => (
              <div key={idx} className="glass-card p-8 rounded-3xl border border-white/5 bg-zinc-950/60 space-y-4">
                <div className="text-amber-400 text-xs">{test.stars}</div>
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  &quot;{test.feedback}&quot;
                </p>
                <div className="border-t border-white/5 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-cyan-400 border border-white/5">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{test.name}</h4>
                    <span className="text-[10px] text-slate-500">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 mb-16 text-center">
          <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Pertanyaan Umum</div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            SOALAN LAZIM (FAQ)
          </h2>
          <p className="text-slate-400 text-sm">
            Segala jawapan pantas bagi persoalan paling lazim tentang ekosistem kami.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-zinc-950/60">
          <Accordion className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-b border-white/5 pb-2">
              <AccordionTrigger className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                Apakah itu AA AI GROUP Digital Ecosystem?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-400 leading-relaxed pt-2">
                AA AI GROUP ialah sebuah platform ekosistem digital premium sehenti. Kami menjual aplikasi kecerdasan buatan, video pendidikan berstruktur, perkhidmatan integrasi chatbot perniagaan khas, dan program langganan VIP dengan sistem akses automatik.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-white/5 pb-2">
              <AccordionTrigger className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                Adakah saya menerima akses terus sebaik pembayaran selesai?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-400 leading-relaxed pt-2">
                Ya! Melalui gerbang pembayaran simulasian FPX, status transaksi disahkan serta-merta dan anda akan diarahkan secara langsung ke Dashboard Pelanggan. Untuk Pindahan Bank manual, kelulusan admin diperlukan dalam tempoh 1-2 jam.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-white/5 pb-2">
              <AccordionTrigger className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                Bagaimanakah cara untuk menggunakan mata ganjaran referral?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-400 leading-relaxed pt-2">
                Setiap kali anda mempromosikan produk digital kami menggunakan kod referral unik yang dijana di dashboard anda, rakan anda akan mendapat diskaun pembelian dan akaun anda akan dikreditkan sebanyak 100 points yang boleh ditebus untuk membeli produk seterusnya.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-white/5 pb-2">
              <AccordionTrigger className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                Bagaimana jika saya memerlukan bantuan teknikal bagi aplikasi yang dibeli?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-400 leading-relaxed pt-2">
                Anda boleh membuka tiket sokongan terus daripada Dashboard Pelanggan anda. Kami membekalkan pembantu AI untuk membalas mesej anda sekelip mata, dan admin manusia kami bersedia memproses kes-kes rumit dalam masa kurang daripada 24 jam.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-start">
          
          {/* Logo column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 rounded-lg text-white font-extrabold text-sm tracking-wider">
                AA
              </div>
              <span className="font-extrabold text-lg text-white">AA AI GROUP</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Membekalkan akses aplikasi kecerdasan buatan, sistem automasi pemasaran, dan video pengajaran VIP berkualiti tinggi secara lancar dan automatik.
            </p>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#hero" className="hover:text-white transition-colors">Utama</a></li>
                <li><a href="#kategori" className="hover:text-white transition-colors">Katalog</a></li>
                <li><a href="#kelebihan" className="hover:text-white transition-colors">Kelebihan</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produk</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#katalog" className="hover:text-white transition-colors">AutoBot AI</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">Vision Analyser</a></li>
                <li><a href="#katalog" className="hover:text-white transition-colors">VIP Membership</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dasar</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Syarat Perkhidmatan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dasar Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Bantuan</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© 2026 AA AI GROUP Ecosystem. Hak Cipta Terpelihara.</p>
          <div className="flex gap-4">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Uptime: 99.99%</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">SSL Secured</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Support Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!aiChatOpen ? (
          <button 
            onClick={() => setAiChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 flex items-center justify-center text-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-[340px] sm:w-[360px] h-[480px] rounded-3xl border border-white/10 bg-zinc-950/75 backdrop-blur-md shadow-2xl shadow-cyan-500/5 flex flex-col overflow-hidden animate-slide-up">
            
            {/* AI Header */}
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-cyan-300" />
                <div>
                  <h4 className="text-xs font-bold">AA AI Support Assistant</h4>
                  <span className="text-[9px] opacity-80 block">Ejen Pintar Autonomi (Aktif)</span>
                </div>
              </div>
              <button 
                onClick={() => setAiChatOpen(false)}
                className="text-white hover:opacity-80 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs flex flex-col">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed flex flex-col ${
                    msg.role === "user" 
                      ? "bg-cyan-500 text-black font-medium self-end ml-auto rounded-tr-none" 
                      : "bg-zinc-900 text-slate-200 border border-white/5 mr-auto rounded-tl-none text-left"
                  }`}
                >
                  <span className="whitespace-pre-line">{msg.text}</span>
                  
                  {/* Inline Product Recommendation Card */}
                  {msg.products && (
                    <div className="mt-2.5 space-y-2">
                      {msg.products.map((p: any) => (
                        <div key={p.id} className="bg-black/60 border border-white/5 rounded-xl p-2 flex items-center justify-between gap-3 text-left">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl flex-shrink-0">{p.image || "📦"}</span>
                            <div className="min-w-0">
                              <h5 className="font-bold text-[10px] text-white truncate leading-tight">{p.name}</h5>
                              <span className="text-[9px] text-cyan-400 font-extrabold block mt-0.5">RM {p.price}</span>
                            </div>
                          </div>
                          <Link href={`/checkout?prod=${p.id}`}>
                            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-bold py-1 px-2 h-6 rounded-md">
                              Beli
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap gap-1 p-2 border-t border-white/5 bg-black/60">
              {[
                { label: "🔍 Rekomendasi", action: "rekomendasi produk" },
                { label: "🔑 Akses Lesen", action: "cara akses lesen" },
                { label: "👑 Keahlian VIP", action: "info keahlian" },
                { label: "🎫 Tiket Sokongan", action: "buka tiket sokongan" }
              ].map((btn, bidx) => (
                <button
                  key={bidx}
                  type="button"
                  onClick={() => {
                    setChatMessages(prev => [...prev, { role: "user", text: btn.label }]);
                    setTimeout(() => {
                      processAiQuery(btn.action);
                    }, 500);
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[9px] font-bold text-slate-300 hover:text-white transition-all"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleAiSend} className="p-3 border-t border-white/5 flex gap-2 bg-black/40">
              <input
                type="text"
                placeholder="Tanya pasal bot atau kursus AI..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold px-4 py-2">
                Hantar
              </Button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
