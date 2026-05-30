"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Layers, 
  PlayCircle, 
  Cpu, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Download, 
  Key, 
  Calendar, 
  Lock,
  HelpCircle, 
  Bell, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Clipboard,
  Tv,
  ArrowUpRight
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Component to render individual manual payment rows safely with local state
function ManualPaymentRow({ o, submitPaymentReceipt }: { o: any; submitPaymentReceipt: any }) {
  const [refInput, setRefInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput) return;
    setUploading(true);
    const success = await submitPaymentReceipt(o.id, refInput, "Rujukan Kemas Kini: " + refInput);
    setUploading(false);
    if (success) {
      alert("Bukti rujukan bayaran berjaya dihantar.");
      setRefInput("");
    } else {
      alert("Gagal menghantar rujukan.");
    }
  };

  return (
    <div className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0 text-left space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs font-bold text-white">{o.productName}</div>
          <span className="text-[9px] text-slate-500 uppercase font-semibold">Pesanan ID: {o.id} • RM {o.price}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
          o.status === "cancelled" ? "bg-rose-500/10 text-rose-400" :
          o.paymentStatus === "processing" ? "bg-blue-500/10 text-blue-400" :
          "bg-amber-500/10 text-amber-400"
        }`}>
          {o.status === "cancelled" ? "DITOLAK" :
           o.paymentStatus === "processing" ? "MENUNGGU PENGESAHAN" :
           "BELUM DIBAYAR"}
        </span>
      </div>

      {o.status === "cancelled" && (
        <div className="text-[11px] text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg p-2 leading-relaxed">
          <strong>Alasan Penolakan:</strong> {o.rejectionReason || "Bukti bayaran tidak sah."}
        </div>
      )}

      {o.paymentStatus === "processing" ? (
        <div className="text-[11px] text-slate-400 bg-white/5 rounded-lg p-2.5">
          Rujukan dihantar: <code className="text-amber-400 font-mono font-bold">{o.receiptUrl}</code>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="flex gap-2">
          <input 
            type="text"
            placeholder="Masukkan Rujukan Bank (e.g. MBY883192)"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            className="flex-grow bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
            required
          />
          <Button type="submit" disabled={uploading} className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-xs font-bold px-4 py-1.5">
            {uploading ? "Menghantar..." : "Hantar Bukti"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const {
    currentUser,
    orders,
    products,
    digitalAccesses,
    services,
    tickets,
    notifications,
    referralPoints,
    referralCode,
    payouts,
    login,
    logout,
    createTicket,
    replyToTicket,
    closeTicket,
    requestPayout,
    claimReferralPoints,
    submitPaymentReceipt
  } = useApp() as any;

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [emailInput, setEmailInput] = useState<string>("ahmad@gmail.com");
  const [passwordInput, setPasswordInput] = useState<string>("danish123");

  // AI Support Assistant states
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "assistant" | "user"; text: string; products?: any[] }>>([
    { role: "assistant", text: "Hai! Saya Pembantu Sokongan AI AA GROUP. Ada sebarang soalan tentang produk digital, cara akses lesen, program keahlian, atau komisen rujukan? Sila tanya saya! 🤖" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  // Profile forms
  const [profileName, setProfileName] = useState<string>("Ahmad Danish");
  const [profileEmail, setProfileEmail] = useState<string>("ahmad@gmail.com");
  const [profileEmoji, setProfileEmoji] = useState<string>("👨‍💻");

  // Ticket creation
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [ticketMessage, setTicketMessage] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState<string>("");

  // Referral Points claim code
  const [claimInput, setClaimInput] = useState<string>("");

  // Payout request states
  const [bankInfo, setBankInfo] = useState<string>("");
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutProcessing, setPayoutProcessing] = useState<boolean>(false);

  // Video streaming active state
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeCourse, setActiveCourse] = useState<any>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030303] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[80px] top-1/4 left-1/4 pointer-events-none"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] bottom-1/4 right-1/4 pointer-events-none"></div>

        <Card className="w-full max-w-md border-white/10 bg-zinc-950/70 backdrop-blur-md relative z-10">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-lg shadow-cyan-500/20">
              AA
            </div>
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Log Masuk Portal Pelanggan
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Sila masuk untuk mengakses lesen aplikasi, video, dan servis anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => { e.preventDefault(); login(emailInput, passwordInput); }} 
              className="space-y-4"
            >
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500">E-mel Pelanggan</label>
                <input 
                  type="email" 
                  value={emailInput} 
                  onChange={(e) => setEmailInput(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="nama@alamat.com"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500">Kata Laluan</label>
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 font-bold py-6 rounded-xl text-xs mt-2 text-white">
                Masuk Dashboard
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center justify-center text-xs text-slate-500 border-t border-white/5 pt-4">
            Akaun Demo? Klik terus &quot;Masuk Dashboard&quot; untuk log masuk segera.
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Completed purchase filtration
  const myCompletedOrders = orders.filter((o: any) => o.userId === currentUser.id && o.status === "completed");
  const myProducts = products.filter((p: any) => myCompletedOrders.some((o: any) => o.productId === p.id));
  
  // VIP check (access to everything)
  const isVipUser = myProducts.some((p: any) => p.category === "subscription") || orders.some((o: any) => o.userId === currentUser.id && o.productName.includes("VIP") && o.status === "completed");
  const unlockedProducts = isVipUser ? products : myProducts;

  const myServices = services.filter((s: any) => s.userId === currentUser.id);
  const myTickets = tickets.filter((t: any) => t.userId === currentUser.id);
  const pendingTickets = myTickets.filter((t: any) => t.status === "open").length;

  const totalSpent = myCompletedOrders.reduce((sum: number, o: any) => sum + o.price, 0);

  const startCourse = (course: any) => {
    setActiveCourse(course);
    if (course.videos && course.videos.length > 0) {
      setActiveVideo(course.videos[0]);
    }
    setActiveTab("courselibrary");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketMessage) return;
    createTicket(ticketTitle, ticketMessage, selectedOrderId);
    setTicketTitle("");
    setTicketMessage("");
    setSelectedOrderId("");
    alert("Tiket sokongan telah berjaya dibuka.");
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    replyToTicket(selectedTicket.id, replyText, "client");

    setSelectedTicket((prev: any) => ({
      ...prev,
      replies: [...prev.replies, {
        sender: "client",
        message: replyText,
        createdAt: new Date().toISOString()
      }]
    }));

    setReplyText("");
  };

  const handleClaimPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput) return;
    const success = claimReferralPoints(claimInput);
    if (success) {
      setClaimInput("");
      alert("Tahniah! Mata bonus berjaya dikreditkan.");
    } else {
      alert("Kod tidak sah.");
    }
  };

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankInfo || !payoutAmount) return;
    const amount = Number(payoutAmount);
    if (amount < 50) {
      alert("Amaun pengeluaran minima adalah RM 50.");
      return;
    }
    setPayoutProcessing(true);
    const success = await requestPayout(bankInfo, amount);
    setPayoutProcessing(false);
    if (success) {
      setBankInfo("");
      setPayoutAmount("");
      alert("Permohonan payout komisen anda telah berjaya dihantar.");
    }
  };

  const processAiQuery = (queryText: string) => {
    let reply = "Maaf, saya tidak berapa faham. Sila gunakan butang tindakan pantas di bawah atau hubungi pasukan bantuan kami di Tab 'Tiket Sokongan' jika perlukan bantuan manual.";
    let recommendedProducts: any[] | undefined = undefined;
    const lower = queryText.toLowerCase();

    if (lower.includes("rekomendasi") || lower.includes("produk") || lower.includes("pakej") || lower.includes("pilih") || lower.includes("harga")) {
      reply = "Berdasarkan carian anda, berikut adalah beberapa produk AI premium terlaris kami yang disyorkan:";
      recommendedProducts = products.slice(0, 3);
    } else if (lower.includes("lesen") || lower.includes("akses") || lower.includes("kunci") || lower.includes("muat turun")) {
      reply = "Untuk mengakses lesen produk digital anda: Pergi ke tab 'Akses Produk' di sebelah kiri. Di sana anda boleh menyalin Kunci Lesen dan memuat turun perisian anda! 🔑";
    } else if (lower.includes("keahlian") || lower.includes("membership") || lower.includes("vip") || lower.includes("langgan")) {
      reply = "AA AI GROUP menawarkan 4 tier keahlian:\n1. Free Member: Keahlian percuma.\n2. Basic Member: Akses produk digital standard.\n3. Premium Member: Diskaun 10% automatik di Checkout.\n4. VIP Member: Diskaun 20% tanpa had & tontonan video pelajaran VIP khas! 👑";
    } else if (lower.includes("tiket") || lower.includes("sokongan") || lower.includes("bantuan") || lower.includes("masalah") || lower.includes("isu")) {
      reply = "Jika anda menghadapi sebarang ralat teknikal, sila pergi ke tab 'Tiket Sokongan' di menu sebelah kiri untuk membuka tiket baru. Ejen bantuan kami akan menyelesaikan isu anda segera! 🎫";
    } else if (lower.includes("bot") || lower.includes("autobot") || lower.includes("automasi")) {
      reply = "Untuk automasi siaran media sosial 24/7, kami mengesyorkan 'AA AutoBot AI Premium' (RM 199).";
      recommendedProducts = products.filter((p: any) => p.id === "prod-1");
    } else if (lower.includes("kursus") || lower.includes("video") || lower.includes("prompt")) {
      reply = "Kuasai kejuruteraan prompt dengan 'AI Prompt Masterclass' (RM 99) kami yang dilengkapi 12 modul video HD.";
      recommendedProducts = products.filter((p: any) => p.id === "prod-3");
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

  return (
    <div className="bg-[#030303] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-x-hidden">
      
      {/* Glow decorations */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[100px] top-0 left-[-10vw] pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] bottom-0 right-[-10vw] pointer-events-none"></div>

      {/* Header bar */}
      <header className="border-b border-white/5 bg-zinc-950/40 backdrop-blur-md py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 rounded-lg text-white font-extrabold text-sm tracking-wider">
                AA
              </span>
              <span className="font-extrabold text-lg text-white">AA AI GROUP</span>
            </Link>
            <span className="text-slate-700 text-sm">|</span>
            <span className="text-xs font-semibold text-slate-400">Customer Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
              <span className="text-lg">{profileEmoji}</span>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <span className="text-[9px] text-slate-400 block">{currentUser.email}</span>
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-rose-400 flex items-center justify-center transition-colors"
              title="Log Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Grid Content layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 grid md:grid-cols-12 gap-8 flex-grow relative z-10">
        
        {/* Sidebar Left navigation */}
        <aside className="md:col-span-3 space-y-2">
          {[
            { id: "overview", label: "Overview Panel", icon: Cpu },
            { id: "products", label: "Akses Produk", icon: Bot },
            { id: "courselibrary", label: "Video AI Library", icon: PlayCircle },
            { id: "servicetracker", label: "Jejak Servis", icon: Layers },
            { id: "tickets", label: "Tiket Sokongan", icon: MessageSquare },
            { id: "referral", label: "Ganjaran Referral", icon: Sparkles },
            { id: "notifications", label: "Notifikasi", icon: Bell },
            { id: "settings", label: "Profil & Tetapan", icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/5"
                  : "bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/5"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              {tab.id === "notifications" && notifications.filter((n: any) => !n.read).length > 0 && (
                <span className="ml-auto w-4 h-4 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center">
                  {notifications.filter((n: any) => !n.read).length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9">
          
          {/* Tab 1: Overview Panel */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Selamat Datang, {currentUser.name}</span>
                  {currentUser.membershipTier && currentUser.membershipTier !== "free" ? (
                    <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      👑 {currentUser.membershipTier.toUpperCase()} MEMBER
                    </span>
                  ) : (
                    <span className="bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Basic Client
                    </span>
                  )}
                </h2>
                {currentUser.membershipExpiresAt && (
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">
                    Keahlian Tamat: {new Date(currentUser.membershipExpiresAt).toLocaleDateString()}
                  </span>
                )}
                <p className="text-xs text-slate-500 mt-1">Uruskan pembelian dan akses keahlian ekosistem digital anda.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Total Purchases", value: `RM ${totalSpent}`, sub: "Nilai belian bersih", icon: DollarSign, glow: "rgba(16,185,129,0.15)" },
                  { title: "Active Products", value: `${unlockedProducts.length} Pakej`, sub: "Sedia untuk diakses", icon: Bot, glow: "rgba(59,130,246,0.15)" },
                  { title: "Active Membership", value: currentUser.membershipTier !== "free" ? currentUser.membershipTier.toUpperCase() : "Basic Client", sub: currentUser.membershipTier === "vip" ? "Akses Tanpa Had" : "Keahlian Asas", icon: Sparkles, glow: "rgba(245,158,11,0.15)", class: currentUser.membershipTier === "vip" ? "text-amber-400" : "" },
                  { title: "Pending Tickets", value: `${pendingTickets} Terbuka`, sub: "Dalam maklum balas", icon: MessageSquare, glow: "rgba(139,92,246,0.15)" },
                  { title: "Expiring Subs", value: currentUser.membershipExpiresAt ? new Date(currentUser.membershipExpiresAt).toLocaleDateString() : "Lifetime", sub: "Status subskripsi", icon: Calendar, glow: "rgba(236,72,153,0.15)" },
                  { title: "Referral Commission", value: `RM ${(currentUser.referralBalance || 0).toFixed(2)}`, sub: "Komisen sedia dituntut", icon: Sparkles, glow: "rgba(234,179,8,0.15)", class: "text-amber-400" }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="relative rounded-2xl border border-white/5 bg-zinc-950/60 p-6 flex flex-col justify-between min-h-[140px] overflow-hidden"
                    style={{ boxShadow: `0 0 25px -10px ${stat.glow}` }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.title}</span>
                      <stat.icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className={`text-xl font-black text-white mt-4 ${stat.class || ""}`}>{stat.value}</div>
                      <span className="text-[10px] text-slate-500 block mt-1">{stat.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Active Products preview */}
              <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aktiviti Terkini</h3>
                {myCompletedOrders.length === 0 ? (
                  <p className="text-xs text-slate-500">Tiada log pembelian direkodkan.</p>
                ) : (
                  <div className="space-y-3">
                    {myCompletedOrders.slice(0, 3).map((o: any) => (
                      <div key={o.id} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm text-cyan-400">
                            ✓
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{o.productName}</div>
                            <span className="text-[9px] text-slate-500 uppercase tracking-wide block mt-0.5">{o.paymentMethod} • ID: {o.id}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-white">RM {o.price}</span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Log Bayaran Manual (Manual Payment Verification) */}
              {orders.filter((o: any) => o.userId === currentUser.id && o.status !== "completed").length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log Bayaran Manual</h3>
                  <div className="space-y-4">
                    {orders
                      .filter((o: any) => o.userId === currentUser.id && o.status !== "completed")
                      .map((o: any) => (
                        <ManualPaymentRow key={o.id} o={o} submitPaymentReceipt={submitPaymentReceipt} />
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 2: Akses Produk & Digital Access */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Akses Perisian & Pautan Muat Turun</h2>
                <p className="text-xs text-slate-500 mt-1">Urus lesen, pautan muat turun, dan kunci keselamatan bagi produk anda.</p>
              </div>

              {unlockedProducts.length === 0 ? (
                <Card className="border-white/5 bg-zinc-950/60 text-center py-16">
                  <CardContent className="space-y-4">
                    <Bot className="w-12 h-12 text-slate-700 mx-auto" />
                    <h3 className="text-sm font-bold text-white">Tiada Produk Aktif</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Sila buat pembelian di laman katalog untuk membuka lesen produk digital di sini.</p>
                    <Link href="/" className="inline-block mt-2">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold px-6 py-4">
                        Beli Produk Pertama
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {unlockedProducts.map((p: any) => {
                    const myAccess = digitalAccesses?.find((a: any) => a.productId === p.id);
                    const licenseKey = myAccess?.licenseKey || `AA-${p.id.toUpperCase()}-7728-XXXX`;
                    const downloadUrl = myAccess?.downloadUrl || p.downloadUrl;
                    const expiryText = myAccess?.expiresAt 
                      ? new Date(myAccess.expiresAt).toLocaleDateString() 
                      : "Seumur Hidup (Lifetime)";

                    return (
                      <Card key={p.id} className="border-white/5 bg-zinc-950/60 overflow-hidden flex flex-col justify-between shadow-lg shadow-cyan-500/5 relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-3xl">{p.image || "📦"}</span>
                            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                              {p.category?.toUpperCase() || "APP"}
                            </span>
                          </div>
                          <CardTitle className="text-base font-extrabold text-white leading-tight">{p.name}</CardTitle>
                          <CardDescription className="text-xs text-slate-500 leading-relaxed pt-1">
                            {p.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                          
                          {/* Auto License Key Generator */}
                          <div className="bg-black/60 border border-white/5 rounded-xl p-3 space-y-1.5">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Lesen Kunci (License Key)</span>
                            </span>
                            <div className="flex justify-between items-center">
                              <code className="text-xs font-mono font-bold text-slate-300">
                                {licenseKey}
                              </code>
                              <button 
                                onClick={() => { navigator.clipboard.writeText(licenseKey); alert("Lesen kunci disalin!"); }}
                                className="text-[10px] text-cyan-400 hover:underline"
                              >
                                Salin
                              </button>
                            </div>
                          </div>

                          {/* Expiry detail */}
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>Tarikh Luput</span>
                            </span>
                            <span className="font-bold text-white">{expiryText}</span>
                          </div>

                        </CardContent>
                        <CardFooter className="border-t border-white/5 bg-black/20 p-4 gap-3">
                          {p.category === "app" ? (
                            <a href={downloadUrl} className="w-full" target="_blank" rel="noopener noreferrer">
                              <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-extrabold flex items-center justify-center gap-2">
                                <Download className="w-3.5 h-3.5" />
                                <span>Muat Turun Setup</span>
                              </Button>
                            </a>
                          ) : p.category === "course" ? (
                            (p.tag === "VIP" || p.name.includes("VIP")) && currentUser.membershipTier !== "vip" ? (
                              <Button 
                                disabled
                                className="w-full bg-zinc-800 text-slate-500 border border-white/5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Ahli VIP Sahaja</span>
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => startCourse(p)}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Tonton Video Kursus</span>
                              </Button>
                            )
                          ) : (
                            <Button 
                              onClick={() => setActiveTab("tickets")}
                              variant="outline" 
                              className="w-full border-white/10 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Hubungi Bantuan Servis</span>
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: AI Course Library & Video Player */}
          {activeTab === "courselibrary" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">AI Course Library (Perpustakaan Video)</h2>
                <p className="text-xs text-slate-500 mt-1">Belajar teknik prompt dan integrasi sistem daripada modul HD terbina.</p>
              </div>

              {activeCourse ? (
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Video Streaming view */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-black aspect-video flex items-center justify-center relative">
                      {activeVideo ? (
                        <video 
                          key={activeVideo.id} 
                          src={activeVideo.url} 
                          className="w-full h-full object-contain"
                          controls 
                          autoPlay 
                        />
                      ) : (
                        <div className="text-slate-500 text-xs">Pilih video dari senarai main untuk bermula.</div>
                      )}
                    </div>
                    <div className="space-y-1.5 text-left">
                      <h3 className="text-base font-extrabold text-white">
                        {activeVideo ? activeVideo.title : "Sila Pilih Video"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Modul pendidikan rasmi AA AI GROUP. Durasi video adalah sekitar {activeVideo ? activeVideo.duration : "0"} minit.
                      </p>
                    </div>
                  </div>

                  {/* Playlist sidebar */}
                  <div className="lg:col-span-4 space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Senarai Modul ({activeCourse.videos?.length || 0})</h4>
                      <button 
                        onClick={() => { setActiveCourse(null); setActiveVideo(null); }}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        Tutup Player
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {activeCourse.videos?.map((vid: any) => {
                        const isVipVideo = vid.title.toLowerCase().includes("vip") || vid.vipOnly;
                        const isLocked = isVipVideo && currentUser.membershipTier !== "vip";
                        return (
                          <div 
                            key={vid.id}
                            onClick={() => { if (!isLocked) setActiveVideo(vid); }}
                            className={`rounded-xl border p-3 cursor-pointer transition-all relative ${
                              isLocked ? "opacity-60 cursor-not-allowed border-rose-500/20 bg-rose-950/5" :
                              activeVideo?.id === vid.id 
                                ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500 text-cyan-300"
                                : "bg-zinc-950/60 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            <div className="text-xs font-bold leading-tight flex justify-between items-center">
                              <span>{vid.title}</span>
                              {isLocked && <Lock className="w-3 h-3 text-rose-400 flex-shrink-0 ml-2" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{isLocked ? "Had VIP" : `Durasi: ${vid.duration}`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {unlockedProducts.filter((p: any) => p.category === "course").map((p: any) => (
                    <Card key={p.id} className="border-white/5 bg-zinc-950/60 overflow-hidden flex flex-col justify-between">
                      <CardHeader className="pb-2">
                        <PlayCircle className="w-8 h-8 text-emerald-400 mb-4" />
                        <CardTitle className="text-base font-extrabold text-white leading-tight">{p.name}</CardTitle>
                        <CardDescription className="text-xs text-slate-500 leading-relaxed pt-1">
                          {p.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="border-t border-white/5 p-4 mt-auto">
                        <Button 
                          onClick={() => startCourse(p)}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Mula Belajar (Tonton)</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  {unlockedProducts.filter((p: any) => p.category === "course").length === 0 && (
                    <div className="col-span-2 text-center text-xs text-slate-500 py-12">
                      Tiada kursus video aktif ditemui. Anda perlu membeli modul di halaman katalog terlebih dahulu.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Service Progress Tracker */}
          {activeTab === "servicetracker" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Jejak Status Servis Digital</h2>
                <p className="text-xs text-slate-500 mt-1">Pantau kemajuan pembinaan bot atau konfigurasi sistem syarikat secara telus.</p>
              </div>

              {myServices.length === 0 ? (
                <Card className="border-white/5 bg-zinc-950/60 text-center py-12 text-slate-500 text-xs">
                  Tiada tempahan servis digital kustom yang sedang diproses ketika ini.
                </Card>
              ) : (
                <div className="space-y-6">
                  {myServices.map((s: any) => (
                    <Card key={s.id} className="border-white/5 bg-zinc-950/60 p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-bold text-white">{s.serviceName}</h3>
                          <span className="text-[10px] text-slate-500 mt-1 block">Tugasan ID: {s.id}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          s.status === "completed" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" :
                          s.status === "in-progress" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400" :
                          "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        }`}>
                          {s.status}
                        </span>
                      </div>

                      {/* Line Graphic */}
                      <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-[2px] bg-white/5 z-1"></div>
                        <div className="flex justify-between items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            s.status === "pending" || s.status === "in-progress" || s.status === "completed" ? "bg-cyan-500 text-black" : "bg-zinc-900 text-slate-500"
                          }`}>1</div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            s.status === "in-progress" || s.status === "completed" ? "bg-cyan-500 text-black" : "bg-zinc-900 text-slate-500"
                          }`}>2</div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            s.status === "completed" ? "bg-emerald-500 text-white" : "bg-zinc-900 text-slate-500"
                          }`}>3</div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-3">
                          <span className="w-20 text-left">Pemeriksaan / Pending</span>
                          <span className="w-20 text-center">Sedang Dilatih / Bina</span>
                          <span className="w-20 text-right">Selesai / Live</span>
                        </div>
                      </div>

                      {/* Log text updates */}
                      <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-1 text-left">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Maklumat Kemas Kini:</div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">{s.progressNotes}</p>
                      </div>

                      <div className="text-right text-[9px] text-slate-600">
                        Kemas Kini Terakhir: {new Date(s.updatedAt).toLocaleString()}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Support Tickets */}
          {activeTab === "tickets" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Hub Bantuan Sokongan</h2>
                <p className="text-xs text-slate-500 mt-1">Dapatkan bantuan teknikal perisian atau konfigurasi daripada pentadbir perkhidmatan kami.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Send Ticket Form & list */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Create Ticket */}
                  <Card className="border-white/5 bg-zinc-950/60 p-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Buka Tiket Baru</h3>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Tajuk Masalah</label>
                        <input 
                          type="text" 
                          placeholder="Tajuk isu" 
                          value={ticketTitle} 
                          onChange={(e) => setTicketTitle(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                          required
                        />
                      </div>
                      
                      {/* Select Related Order */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Pesanan Berkaitan (Pilihan)</label>
                        <select
                          value={selectedOrderId}
                          onChange={(e) => setSelectedOrderId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        >
                          <option value="">-- Tiada (Bantuan Umum) --</option>
                          {myCompletedOrders.map((o: any) => (
                            <option key={o.id} value={o.id}>
                              {o.productName} (ID: {o.id.slice(0, 8)}...)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Terangkan Masalah</label>
                        <textarea 
                          placeholder="Sila terangkan ralat atau bantuan..." 
                          value={ticketMessage} 
                          onChange={(e) => setTicketMessage(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 min-h-[90px] resize-none"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold py-3.5">
                        Hantar Tiket
                      </Button>
                    </form>
                  </Card>

                  {/* Previous Tickets */}
                  <div className="space-y-3 text-left">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tiket Anda ({myTickets.length})</h3>
                    {myTickets.length === 0 ? (
                      <p className="text-xs text-slate-500">Tiada tiket dibuka.</p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {myTickets.map((t: any) => (
                          <div 
                            key={t.id} 
                            onClick={() => setSelectedTicket(t)}
                            className={`rounded-xl border p-3 cursor-pointer transition-all ${
                              selectedTicket?.id === t.id
                                ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500 text-cyan-300"
                                : "bg-zinc-950/60 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{t.subject || t.title}</div>
                            <div className="flex justify-between items-center mt-2.5 text-[9px] font-bold">
                              <span className={`px-2 py-0.5 rounded-full ${
                                t.status === "closed" ? "bg-rose-500/10 text-rose-400" :
                                t.status === "replied" ? "bg-emerald-500/10 text-emerald-400" :
                                "bg-cyan-500/10 text-cyan-400"
                              }`}>
                                {t.status === "closed" ? "CLOSED" : t.status === "replied" ? "REPLIED" : "OPEN"}
                              </span>
                              <span className="text-slate-600">{t.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message display panel */}
                <div className="lg:col-span-7">
                  <Card className="border-white/5 bg-zinc-950/60 p-5 flex flex-col h-[480px]">
                    {selectedTicket ? (
                      <>
                        <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center text-left">
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight">
                              {selectedTicket.subject || selectedTicket.title}
                            </h3>
                            <span className="text-[9px] text-slate-500 mt-1 block">
                              Tiket ID: {selectedTicket.id}
                              {selectedTicket.orderId && ` • Pesanan: ${selectedTicket.orderId.slice(0, 8)}...`}
                              • Status:{" "}
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                selectedTicket.status === "closed" ? "bg-rose-500/10 text-rose-400" :
                                selectedTicket.status === "replied" ? "bg-emerald-500/10 text-emerald-400" :
                                "bg-cyan-500/10 text-cyan-400"
                              }`}>
                                {selectedTicket.status === "closed" ? "CLOSED" :
                                 selectedTicket.status === "replied" ? "REPLIED" :
                                 "OPEN"}
                              </span>
                            </span>
                          </div>
                          {selectedTicket.status !== "closed" && (
                            <Button 
                              onClick={async () => {
                                if (confirm("Adakah anda pasti mahu menutup tiket sokongan ini?")) {
                                  await closeTicket(selectedTicket.id);
                                  setSelectedTicket((prev: any) => prev ? { ...prev, status: "closed" } : null);
                                  alert("Tiket berjaya ditutup.");
                                }
                              }}
                              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg text-[10px] font-bold px-3 py-1.5"
                            >
                              Tutup Tiket
                            </Button>
                          )}
                        </div>

                        {/* Replies message box */}
                        <div className="flex-grow overflow-y-auto pr-1 space-y-4 mb-4 text-xs">
                          {/* Original Query */}
                          <div className="max-w-[85%] bg-zinc-900 border border-white/5 p-3 rounded-2xl rounded-tl-none mr-auto text-left leading-relaxed">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">Anda (Soalan Asal)</span>
                            <p className="mt-1 text-slate-200">{selectedTicket.description || selectedTicket.message}</p>
                          </div>

                          {/* Replies */}
                          {selectedTicket.replies?.map((rep: any, idx: number) => (
                            <div 
                              key={idx}
                              className={`max-w-[85%] p-3 rounded-2xl text-left leading-relaxed ${
                                rep.sender === "client" 
                                  ? "bg-zinc-900 border border-white/5 mr-auto rounded-tl-none" 
                                  : "bg-cyan-500/10 border border-cyan-500/20 ml-auto rounded-tr-none"
                              }`}
                            >
                              <span className={`text-[9px] font-bold uppercase tracking-widest block ${
                                rep.sender === "client" ? "text-cyan-400" : "text-amber-400"
                              }`}>
                                {rep.sender === "client" ? "Anda" : rep.sender === "system" ? "Sistem AI" : "Bantuan Admin"}
                              </span>
                              <p className="mt-1 text-slate-200">{rep.message}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        {selectedTicket.status === "closed" ? (
                          <div className="border-t border-white/5 pt-3 mt-auto text-center text-xs text-rose-400 bg-rose-500/5 rounded-xl py-3 font-semibold">
                            Tiket ini telah ditutup. Sila buka tiket baru jika anda memerlukan bantuan lanjut.
                          </div>
                        ) : (
                          <form onSubmit={handleReplyTicket} className="flex gap-2 border-t border-white/5 pt-3 mt-auto">
                            <input 
                              type="text" 
                              placeholder="Mesej maklum balas..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-grow bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                              required
                            />
                            <Button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold px-5 py-2.5">
                              Hantar
                            </Button>
                          </form>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 text-xs">
                        <MessageSquare className="w-10 h-10 text-slate-700" />
                        <span>Sila pilih tiket bantuan dari panel sebelah kiri untuk memulakan sembang.</span>
                      </div>
                    )}
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* Tab 6: Referral Rewards */}
          {activeTab === "referral" && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Program Referral & Ganjaran Komisen</h2>
                <p className="text-xs text-slate-500 mt-1">Kongsi kod rujukan peribadi anda dan terima komisen tunai 10% daripada setiap belian rujukan anda.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Stats points */}
                <Card className="border-white/5 bg-zinc-950/60 p-6 flex flex-col justify-center items-center text-center">
                  <Sparkles className="w-10 h-10 text-amber-400 mb-2" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Points Terkumpul</span>
                  <div className="text-3xl font-black text-amber-400 mt-3">{referralPoints} Points</div>
                  <p className="text-[10px] text-slate-600 mt-2 max-w-xs leading-relaxed">
                    Kumpul 500 points untuk menebus diskaun RM 50 pada bil atau pembelian seterusnya.
                  </p>
                </Card>

                {/* Stats commission */}
                <Card className="border-white/5 bg-zinc-950/60 p-6 flex flex-col justify-center items-center text-center">
                  <DollarSign className="w-10 h-10 text-emerald-400 mb-2" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Baki Komisen Tunai</span>
                  <div className="text-3xl font-black text-emerald-400 mt-3">RM {(currentUser.referralBalance || 0).toFixed(2)}</div>
                  <p className="text-[10px] text-slate-600 mt-2 max-w-xs leading-relaxed">
                    Minima RM 50 diperlukan untuk membuat tuntutan pengeluaran (payout) tunai.
                  </p>
                </Card>

                {/* Copy referral links */}
                <Card className="border-white/5 bg-zinc-950/60 p-6 space-y-4 text-left">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pautan Unik Anda</h3>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-slate-500">Kod Rujukan Anda</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={currentUser.referralCode || referralCode} 
                        className="flex-grow bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-center font-bold font-mono text-cyan-300 focus:outline-none"
                      />
                      <Button 
                        onClick={() => { navigator.clipboard.writeText(currentUser.referralCode || referralCode); alert("Kod referral disalin!"); }}
                        className="bg-zinc-900 border border-white/10 text-white rounded-xl text-xs font-bold px-3 hover:bg-zinc-800"
                      >
                        Salin
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-black text-slate-500">Pautan Pendaftaran</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={`${typeof window !== "undefined" ? window.location.origin : "https://aagroup.ai"}/register?ref=${currentUser.referralCode || referralCode}`} 
                        className="flex-grow bg-black border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-slate-400 focus:outline-none"
                      />
                      <Button 
                        onClick={() => { 
                          const link = `${typeof window !== "undefined" ? window.location.origin : "https://aagroup.ai"}/register?ref=${currentUser.referralCode || referralCode}`;
                          navigator.clipboard.writeText(link); 
                          alert("Pautan pendaftaran rujukan disalin!"); 
                        }}
                        className="bg-zinc-900 border border-white/10 text-white rounded-xl text-xs font-bold px-3 hover:bg-zinc-800"
                      >
                        Salin
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Request Payout Form */}
                <Card className="border-white/5 bg-zinc-950/60 p-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tuntut Pengeluaran Komisen (Payout)</h3>
                  <form onSubmit={handlePayoutRequest} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black text-slate-500">Butiran Pindahan Bank</label>
                      <input 
                        type="text"
                        placeholder="Contoh: Maybank 164012345678 (Ahmad Danish)"
                        value={bankInfo}
                        onChange={(e) => setBankInfo(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black text-slate-500">Amaun Pengeluaran (RM)</label>
                      <input 
                        type="number"
                        min="50"
                        step="0.01"
                        placeholder="Minima RM 50"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={payoutProcessing || (currentUser.referralBalance || 0) < 50}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:brightness-110 font-bold py-3 rounded-xl text-xs"
                    >
                      {payoutProcessing ? "Memproses..." : "Hantar Tuntutan Payout"}
                    </Button>
                  </form>
                </Card>

                {/* Claim Points */}
                <div className="space-y-6">
                  <Card className="border-white/5 bg-zinc-950/60 p-6 text-left">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Tuntut Kod Rujukan</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Menerima kod daripada rakan anda? Masukkan kod rujukan di bawah untuk menebus bonus 100 points.
                    </p>
                    <form onSubmit={handleClaimPoints} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Contoh: AA-AI-VIP"
                        value={claimInput}
                        onChange={(e) => setClaimInput(e.target.value)}
                        className="flex-grow bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        required
                      />
                      <Button type="submit" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 font-bold rounded-xl text-xs px-5 py-2.5">
                        Tuntut
                      </Button>
                    </form>
                    <span className="text-[9px] text-slate-600 block mt-2">Tip: Taip &quot;AA-AI-VIP&quot; untuk menguji tuntutan mata ganjaran.</span>
                  </Card>

                  {/* Payout History List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Log Pengeluaran Anda</h4>
                    {payouts.length === 0 ? (
                      <p className="text-[11px] text-slate-600">Tiada log tuntutan pengeluaran ditemui.</p>
                    ) : (
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {payouts.map((p: any) => (
                          <div key={p.id} className="bg-zinc-950/40 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs">
                            <div className="text-left">
                              <div className="font-bold text-white">RM {p.amount.toFixed(2)}</div>
                              <span className="text-[9px] text-slate-500 block">{new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${
                              p.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                              p.status === "rejected" ? "bg-rose-500/10 text-rose-400" :
                              "bg-amber-500/10 text-amber-400"
                            }`}>
                              {p.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Notification Center */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Notifikasi & Log Sistem</h2>
                <p className="text-xs text-slate-500 mt-1">Maklumat pengesahan bayaran dan pelepasan lesen terkini.</p>
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">Tiada notifikasi ditemui.</p>
                ) : (
                  notifications.map((n: any) => (
                    <Card key={n.id} className="border-white/5 bg-zinc-950/60 p-4">
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          n.type === "success" ? "bg-emerald-500/10 text-emerald-400" :
                          n.type === "warning" ? "bg-amber-500/10 text-amber-400" :
                          "bg-cyan-500/10 text-cyan-400"
                        }`}>
                          {n.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">{n.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                          <span className="text-[9px] text-slate-600 block mt-1">{new Date(n.createdAt).toLocaleTimeString()} • {new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 8: Profile Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Profil & Tetapan Akaun</h2>
                <p className="text-xs text-slate-500 mt-1">Kemaskini maklumat profil dan kunci keselamatan akaun digital anda.</p>
              </div>

              <Card className="border-white/5 bg-zinc-950/60 p-6 max-w-lg">
                <form 
                  onSubmit={(e) => { e.preventDefault(); alert("Maklumat profil dikemas kini!"); }} 
                  className="space-y-4"
                >
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                    <span className="text-4xl p-3 bg-white/5 border border-white/10 rounded-2xl">{profileEmoji}</span>
                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-500">Avatar Emoji</label>
                      <input 
                        type="text" 
                        value={profileEmoji} 
                        onChange={(e) => setProfileEmoji(e.target.value)} 
                        className="w-12 bg-black border border-white/10 rounded-xl px-2.5 py-1 text-center font-bold text-xs text-white focus:outline-none focus:border-cyan-500/50 mt-1 block"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black text-slate-500">Nama Penuh</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black text-slate-500">E-mel Berdaftar</label>
                    <input 
                      type="email" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      required
                    />
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:brightness-110 font-bold rounded-xl text-xs px-6 py-4">
                    Simpan Perubahan
                  </Button>
                </form>
              </Card>

            </div>
          )}

        </main>
      </div>

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
