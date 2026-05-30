"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Layers, 
  PlayCircle, 
  Cpu, 
  Sparkles, 
  Settings, 
  LogOut, 
  Plus, 
  Trash, 
  Check, 
  X, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertCircle, 
  Video, 
  Briefcase, 
  FileText, 
  Bell, 
  TrendingDown, 
  Lock,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const {
    currentUser,
    products,
    orders,
    services,
    tickets,
    notifications,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    approveOrder,
    rejectOrder,
    updateServiceStatus,
    replyToTicket,
    updateTicketStatus,
    allUsers,
    payouts,
    updateUserMembership,
    processPayout,
    addNotification
  } = useApp() as any;

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [emailInput, setEmailInput] = useState<string>("admin@aagroup.ai");
  const [passwordInput, setPasswordInput] = useState<string>("admin123");

  // Add Product Form State
  const [prodName, setProdName] = useState<string>("");
  const [prodCategory, setProdCategory] = useState<string>("app");
  const [prodPrice, setProdPrice] = useState<string>("");
  const [prodDesc, setProdDesc] = useState<string>("");
  const [prodFeatures, setProdFeatures] = useState<string>("");
  const [prodImage, setProdImage] = useState<string>("🤖");
  const [prodUrl, setProdUrl] = useState<string>("");

  // Edit Product Mode
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Upload Video Lesson Form State
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("https://www.w3schools.com/html/movie.mp4");

  // Service Progress Update State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceStatus, setServiceStatus] = useState<string>("in-progress");
  const [progressNotes, setProgressNotes] = useState<string>("");

  // Support Ticket Reply State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>("");
  const [ticketFilter, setTicketFilter] = useState<string>("all");

  // Manage Membership Form State
  const [editingUserId, setEditingUserId] = useState<string>("");
  const [memberTier, setMemberTier] = useState<string>("free");
  const [memberExpiry, setMemberExpiry] = useState<string>("");
  const [memberDiscount, setMemberDiscount] = useState<string>("0");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#030303] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[80px] top-1/4 left-1/4 pointer-events-none"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] bottom-1/4 right-1/4 pointer-events-none"></div>

        <Card className="w-full max-w-md border-white/10 bg-zinc-950/70 backdrop-blur-md relative z-10">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-extrabold text-xl mx-auto shadow-lg shadow-yellow-500/20">
              AA
            </div>
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex justify-center items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Admin Portal Access</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Uruskan ekosistem digital AA AI GROUP. Portal disulitkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => { e.preventDefault(); login(emailInput, passwordInput); }} 
              className="space-y-4"
            >
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500">E-mel Pentadbir</label>
                <input 
                  type="email" 
                  value={emailInput} 
                  onChange={(e) => setEmailInput(e.target.value)} 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  placeholder="admin@aagroup.ai"
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

              <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 hover:brightness-110 font-bold py-6 rounded-xl text-xs mt-2 text-black">
                Log Masuk Pentadbir
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analytics Helpers
  const totalSales = orders.filter((o: any) => o.status === "completed").reduce((sum: number, o: any) => sum + o.price, 0);
  const totalUsers = new Set(orders.map((o: any) => o.userId)).size || 1;
  const pendingPayments = orders.filter((o: any) => o.status === "pending");
  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const activeSubs = orders.filter((o: any) => o.productName.includes("VIP") && o.status === "completed").length;
  const activeServices = services.filter((s: any) => s.status !== "completed");
  const activeTickets = tickets.filter((t: any) => t.status === "open");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDesc) return;

    const featureList = prodFeatures.split(",").map(f => f.trim()).filter(Boolean);

    addProduct({
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      description: prodDesc,
      features: featureList.length > 0 ? featureList : ["Akses Pro", "Kemas Kini Mingguan"],
      image: prodImage,
      downloadUrl: prodUrl || "https://github.com",
      published: true
    });

    setProdName("");
    setProdPrice("");
    setProdDesc("");
    setProdFeatures("");
    setProdUrl("");
    alert("Produk digital baharu berjaya didaftarkan.");
  };

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !videoTitle || !videoDuration) return;

    const course = products.find((p: any) => p.id === selectedCourseId);
    if (course) {
      const updatedVideos = [...(course.videos || []), {
        id: `v-${Date.now()}`,
        title: videoTitle,
        duration: videoDuration,
        url: videoUrl
      }];
      updateProduct({ ...course, videos: updatedVideos });
      addNotification("Video Kursus Dimuat Naik", `Video "${videoTitle}" dimasukkan ke dalam ${course.name}.`, "info");
      
      setVideoTitle("");
      setVideoDuration("");
      alert("Video pembelajaran baharu berjaya dimuat naik.");
    }
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    updateServiceStatus(selectedService.id, serviceStatus, progressNotes);
    setSelectedService(null);
    setProgressNotes("");
    alert("Status progress servis telah berjaya dikemas kini.");
  };

  const handleAdminTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedTicket) return;

    replyToTicket(selectedTicket.id, adminReplyText);

    setSelectedTicket((prev: any) => ({
      ...prev,
      status: "replied",
      replies: [...prev.replies, {
        sender: "admin",
        message: adminReplyText,
        createdAt: new Date().toISOString()
      }]
    }));

    setAdminReplyText("");
    alert("Maklum balas sokongan admin dihantar.");
  };

  const toggleProductPublish = (p: any) => {
    updateProduct({ ...p, published: p.published === false ? true : false });
  };

  return (
    <div className="bg-[#030303] text-slate-100 min-height-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-300">
      
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[100px] top-0 left-[-10vw] pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] bottom-0 right-[-10vw] pointer-events-none"></div>

      {/* Admin Header */}
      <header className="border-b border-white/5 bg-zinc-950/40 backdrop-blur-md py-4 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 px-3 py-1 rounded-lg text-black font-extrabold text-sm tracking-wider">
                AA
              </span>
              <span className="font-extrabold text-lg text-white">AA AI GROUP</span>
            </Link>
            <span className="text-slate-700 text-sm">|</span>
            <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              👑 Super Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right leading-tight hidden sm:block">
              <div className="text-xs font-bold text-white">{currentUser.name}</div>
              <span className="text-[9px] text-slate-500 block">{currentUser.email}</span>
            </div>
            <button 
              onClick={logout} 
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-amber-400 flex items-center justify-center transition-colors"
              title="Log Keluar Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Grid Layout for Admin Dashboard */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 grid md:grid-cols-12 gap-8 flex-grow relative z-10">
        
        {/* Sidebar Nav */}
        <aside className="md:col-span-3 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard Metrik", icon: Cpu },
            { id: "products", label: "Urus Produk", icon: Bot },
            { id: "categories", label: "Kategori Produk", icon: Layers },
            { id: "payments", label: "Kelulusan FPX / Bank", icon: DollarSign, badge: pendingPayments.length },
            { id: "customers", label: "Urus Pelanggan", icon: Users },
            { id: "payouts", label: "Payout Referral", icon: DollarSign, badge: payouts.filter((p: any) => p.status === "pending").length },
            { id: "videocourses", label: "Papan Video Kursus", icon: Video },
            { id: "servicerequests", label: "Log Progress Servis", icon: Briefcase, badge: activeServices.length },
            { id: "supporttickets", label: "Tiket Bantuan", icon: MessageSquare, badge: activeTickets.length },
            { id: "notifications", label: "Notifikasi Sistem", icon: Bell },
            { id: "settings", label: "Tetapan Portal", icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/5"
                  : "bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/5"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-amber-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="ml-auto w-4 h-4 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </aside>

        {/* Admin Content Area */}
        <main className="md:col-span-9">
          
          {/* Tab 1: Dashboard Widgets & Analytics */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Sistem Metrik & Analitis Prestasi</h2>
                <p className="text-xs text-slate-500 mt-1">Pantau prestasi jualan, status keahlian, dan kemajuan tiket bantuan ekosistem.</p>
              </div>

              {/* Metric Widgets Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Revenue", value: `RM ${totalSales}`, sub: "+12.4% vs bulan lepas", icon: DollarSign, color: "text-emerald-400" },
                  { title: "Total Customers", value: `${totalUsers} Pengguna`, sub: "Log masuk aktif", icon: Users, color: "text-cyan-400" },
                  { title: "Total Orders", value: `${completedOrders.length} Pembelian`, sub: "FPX & Bank manual", icon: ShoppingBag, color: "text-blue-400" },
                  { title: "Active VIP", value: `${activeSubs} Ahli`, sub: "VIP Memberships", icon: Sparkles, color: "text-amber-400" }
                ].map((wid, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-zinc-950/60 p-6 flex flex-col justify-between min-h-[130px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{wid.title}</span>
                      <wid.icon className={`w-4 h-4 ${wid.color}`} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white mt-4">{wid.value}</div>
                      <span className="text-[9px] text-slate-600 block mt-1">{wid.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly sales chart mockup & Top products */}
              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Simulated Chart */}
                <div className="lg:col-span-8 rounded-2xl border border-white/5 bg-zinc-950/60 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Carta Jualan Bulanan (Simulasi)</h3>
                    <span className="text-[10px] text-emerald-400 font-bold">+18.2% Jualan AI</span>
                  </div>
                  
                  {/* Visual Chart Bars */}
                  <div className="h-40 flex items-end justify-between pt-6 border-b border-white/5 pb-2">
                    {[
                      { month: "Jan", val: 40 },
                      { month: "Feb", val: 55 },
                      { month: "Mar", val: 70 },
                      { month: "Apr", val: 90 },
                      { month: "May", val: 120 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-12 group">
                        <div 
                          className="w-8 rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:brightness-110 transition-all duration-300"
                          style={{ height: `${bar.val}px` }}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top selling products list */}
                <div className="lg:col-span-4 rounded-2xl border border-white/5 bg-zinc-950/60 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Produk Terlaris</h3>
                  <div className="space-y-3.5">
                    {products.slice(0, 3).map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{p.image}</span>
                          <div className="leading-tight text-left">
                            <span className="text-xs font-bold text-white block">{p.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase">{p.category}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-cyan-400">RM {p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Orders table */}
              <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Senarai Tempahan Terkini</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500">Tiada log tempahan dijumpai.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                          <th className="pb-3 pr-2">ID</th>
                          <th className="pb-3 px-2">Pelanggan</th>
                          <th className="pb-3 px-2">Produk</th>
                          <th className="pb-3 px-2">Harga</th>
                          <th className="pb-3 px-2">Kaedah</th>
                          <th className="pb-3 pl-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o: any) => (
                          <tr key={o.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                            <td className="py-3.5 pr-2 font-mono text-[10px] text-slate-500">{o.id}</td>
                            <td className="py-3.5 px-2">
                              <div className="font-bold text-white">{o.userName}</div>
                              <div className="text-[9px] text-slate-500 mt-0.5">{o.userEmail}</div>
                            </td>
                            <td className="py-3.5 px-2">{o.productName}</td>
                            <td className="py-3.5 px-2 font-extrabold text-white">RM {o.price}</td>
                            <td className="py-3.5 px-2 uppercase text-slate-400 text-[10px]">{o.paymentMethod}</td>
                            <td className="py-3.5 pl-2">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                o.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                o.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                "bg-rose-500/10 text-rose-400"
                              }`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Tab 2: Products CRUD Management */}
          {activeTab === "products" && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">Pendaftaran & CRUD Produk</h2>
                  <p className="text-xs text-slate-500 mt-1">Uruskan inventori aplikasi premium, kursus modular, dan pakej servis digital.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Product List */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Senarai Produk</h3>
                  <div className="space-y-3">
                    {products.map((p: any) => (
                      <div key={p.id} className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{p.image}</span>
                          <div className="text-left leading-tight">
                            <h4 className="text-xs font-bold text-white">{p.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-cyan-400 font-bold">RM {p.price}</span>
                              <span className="text-slate-600 text-[10px]">•</span>
                              <span className="bg-white/5 text-slate-500 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">{p.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleProductPublish(p)}
                            className={`p-2 rounded-lg border transition-colors ${
                              p.published !== false 
                                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20" 
                                : "bg-zinc-900 border-white/5 text-slate-600 hover:bg-zinc-800"
                            }`}
                            title={p.published !== false ? "Nyahterbit (Unpublish)" : "Terbitkan (Publish)"}
                          >
                            {p.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg border border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
                            title="Padam"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Form Add Product */}
                <div className="lg:col-span-5">
                  <Card className="border-white/5 bg-zinc-950/60 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Tambah Produk</h3>
                    
                    <form onSubmit={handleAddProduct} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Nama Produk</label>
                        <input 
                          type="text" 
                          value={prodName} 
                          onChange={(e) => setProdName(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                          placeholder="Contoh: AA AutoBot v2"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Kategori</label>
                        <select 
                          value={prodCategory} 
                          onChange={(e) => setProdCategory(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                        >
                          <option value="app">Aplikasi Premium (App)</option>
                          <option value="course">Video Education AI (Course)</option>
                          <option value="service">Digital Services (Service)</option>
                          <option value="subscription">VIP Keahlian (Subscription)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-500">Harga (RM)</label>
                          <input 
                            type="number" 
                            value={prodPrice} 
                            onChange={(e) => setProdPrice(e.target.value)} 
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                            placeholder="199"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-500">Emoji Icon</label>
                          <input 
                            type="text" 
                            value={prodImage} 
                            onChange={(e) => setProdImage(e.target.value)} 
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none"
                            placeholder="🤖"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Pautan Download / Repo</label>
                        <input 
                          type="text" 
                          value={prodUrl} 
                          onChange={(e) => setProdUrl(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Ciri-ciri Utama (Pisah dengan koma)</label>
                        <input 
                          type="text" 
                          value={prodFeatures} 
                          onChange={(e) => setProdFeatures(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                          placeholder="Automasi 24/7, Penjana Kandungan"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Penerangan Produk</label>
                        <textarea 
                          value={prodDesc} 
                          onChange={(e) => setProdDesc(e.target.value)} 
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 min-h-[60px] resize-none"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:brightness-110 font-bold py-3.5 mt-2 rounded-xl text-xs">
                        Daftar Produk Baru
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Categories */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Pengurusan Kategori Sistem</h2>
                <p className="text-xs text-slate-500 mt-1">Urus senarai pengkategorian ekosistem untuk penapisan katalog pengguna.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-white/5 bg-zinc-950/60 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Kategori Ekosistem Aktif</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Software App", key: "app", count: products.filter((p: any) => p.category === "app").length },
                      { name: "Video Education AI", key: "course", count: products.filter((p: any) => p.category === "course").length },
                      { name: "Digital Services", key: "service", count: products.filter((p: any) => p.category === "service").length },
                      { name: "VIP Subscriptions", key: "subscription", count: products.filter((p: any) => p.category === "subscription").length }
                    ].map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-black/40">
                        <span className="text-xs font-bold text-white">{c.name} (`{c.key}`)</span>
                        <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">{c.count} Produk</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border-white/5 bg-zinc-950/60 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Daftar Kategori Baru</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Penyediaan pangkalan data dinamik baharu bagi penapisan sub-produk digital.</p>
                  <div className="space-y-3">
                    <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" placeholder="Contoh: Mobile Apps" />
                    <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" placeholder="Kod ID Kategori (e.g. mobile)" />
                    <Button onClick={() => alert("Kategori baharu berjaya didaftarkan secara simulasi.")} className="w-full bg-amber-400 text-black font-bold text-xs py-3.5 rounded-xl">
                      Daftar Kategori
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 4: Manual Payment Approvals */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Kelulusan Bayaran Bank Transfer</h2>
                <p className="text-xs text-slate-500 mt-1">Sahkan pindahan dana manual daripada resit dan rujukan transaksi pelanggan.</p>
              </div>

              {pendingPayments.length === 0 ? (
                <Card className="border-white/5 bg-zinc-950/60 text-center py-12 text-slate-500 text-xs">
                  Tiada pembayaran manual menanti pengesahan buat masa ini.
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((o: any) => (
                    <Card key={o.id} className="border-white/5 bg-zinc-950/60 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">Pesanan #{o.id}</h4>
                          <span className="bg-amber-400/10 text-amber-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Pending Transfer</span>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                          Pelanggan: <strong className="text-slate-200">{o.userName} ({o.userEmail})</strong><br />
                          Pakej: <strong className="text-slate-200">{o.productName}</strong> bernilai <strong className="text-cyan-400 font-bold">RM {o.price}</strong><br />
                          Masa: {new Date(o.createdAt).toLocaleString()}<br />
                          {o.receiptUrl && (
                            <span className="block mt-1">
                              Bukti Rujukan: <code className="bg-black/60 px-2 py-0.5 rounded text-amber-400 font-mono text-[10px] border border-white/5">{o.receiptUrl}</code>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button 
                          onClick={() => {
                            const reason = prompt("Masukkan alasan penolakan bayaran:", "Bukti pindahan/rujukan transaksi tidak sah.");
                            if (reason !== null) {
                              rejectOrder(o.id, reason);
                            }
                          }}
                          className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-xl px-4 py-2"
                        >
                          Tolak
                        </Button>
                        <Button 
                          onClick={() => approveOrder(o.id)}
                          className="bg-emerald-500 text-white hover:brightness-110 text-xs font-bold rounded-xl px-4 py-2"
                        >
                          Sahkan & Sah
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Video Lessons Uploader */}
          {activeTab === "videocourses" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Papan Upload Pelajaran Video</h2>
                <p className="text-xs text-slate-500 mt-1">Masukkan video pembelajaran baharu ke dalam senarai main kursus modular di dashboard pelanggan.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-8">
                
                {/* Course List & Moduls */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Senarai Kursus Aktif</h3>
                  {products.filter((p: any) => p.category === "course").map((p: any) => (
                    <div key={p.id} className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{p.image}</span>
                          <span className="text-xs font-bold text-white">{p.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{p.videos?.length || 0} Video Pelajaran</span>
                      </div>
                      
                      {/* Short list of modules */}
                      <div className="space-y-1.5 pl-8 border-l border-white/5">
                        {p.videos?.map((v: any, idx: number) => (
                          <div key={v.id} className="text-[11px] text-slate-400 flex justify-between">
                            <span>{idx + 1}. {v.title}</span>
                            <span className="text-slate-600">{v.duration} minit</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Video Lesson Form */}
                <div className="md:col-span-5">
                  <Card className="border-white/5 bg-zinc-950/60 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Upload Pelajaran Baru</h3>
                    
                    <form onSubmit={handleUploadVideo} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Pilih Pakej Kursus</label>
                        <select 
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        >
                          <option value="">-- Pilih Kursus --</option>
                          {products.filter((p: any) => p.category === "course").map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Tajuk Video Pelajaran</label>
                        <input 
                          type="text" 
                          placeholder="Tajuk modul pelajaran" 
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Durasi Video (e.g. 15:30)</label>
                        <input 
                          type="text" 
                          placeholder="12:45" 
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-500">Pautan Fail Video (MP4)</label>
                        <input 
                          type="text" 
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:brightness-110 font-bold py-3.5 mt-2 rounded-xl text-xs">
                        Upload Video Pelajaran
                      </Button>
                    </form>
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* Tab 6: Service Requests progress manager */}
          {activeTab === "servicerequests" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Log progress Servis Digital</h2>
                <p className="text-xs text-slate-500 mt-1">Urus garis masa status kerja reka bentuk atau konfigurasi bot bagi pelanggan.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-8">
                
                {/* List services requests */}
                <div className="md:col-span-6 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Senarai Tugasan Aktif</h3>
                  {services.length === 0 ? (
                    <p className="text-xs text-slate-500">Tiada tugasan servis direkodkan.</p>
                  ) : (
                    services.map((s: any) => (
                      <div 
                        key={s.id}
                        onClick={() => { setSelectedService(s); setServiceStatus(s.status); setProgressNotes(s.progressNotes); }}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                          selectedService?.id === s.id
                            ? "bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border-amber-500/50 text-amber-300"
                            : "bg-zinc-950/60 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        <div className="text-xs font-bold">{s.serviceName}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Pelanggan: {s.userName}</div>
                        <div className="flex justify-between items-center mt-3 text-[9px] font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${
                            s.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                            s.status === "in-progress" ? "bg-cyan-500/10 text-cyan-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>{s.status.toUpperCase()}</span>
                          <span className="text-slate-600">{s.id}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Edit progress notes form */}
                <div className="md:col-span-6">
                  <Card className="border-white/5 bg-zinc-950/60 p-5">
                    {selectedService ? (
                      <form onSubmit={handleUpdateService} className="space-y-4 text-left">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">Update Status Progress</h3>
                        <div>
                          <div className="text-xs font-bold text-white">{selectedService.serviceName}</div>
                          <span className="text-[9px] text-slate-500 mt-1 block">Pelanggan: {selectedService.userName}</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-500">Status Servis</label>
                          <select 
                            value={serviceStatus}
                            onChange={(e) => setServiceStatus(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">Sedang Diproses (In Progress)</option>
                            <option value="completed">Selesai (Completed)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-500">Nota Progress Semasa</label>
                          <textarea 
                            value={progressNotes}
                            onChange={(e) => setProgressNotes(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white min-h-[100px] resize-none"
                            placeholder="Maklumkan perkara yang sedang dilakukan..."
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-3.5 rounded-xl">
                          Simpan Kemaskini
                        </Button>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-2 text-xs">
                        <Briefcase className="w-8 h-8 text-slate-700" />
                        <span>Pilih tugasan servis di sebelah kiri untuk mengemas kini kemajuan projek.</span>
                      </div>
                    )}
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* Tab 7: Support Tickets replying portal */}
          {activeTab === "supporttickets" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Tiket Sokongan Pelanggan</h2>
                <p className="text-xs text-slate-500 mt-1">Balas dan berikan sokongan teknikal terus kepada perbualan tiket aktif pelanggan.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Tickets list */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tiket Masuk</h3>
                  
                  {/* Status Filters */}
                  <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                    {[
                      { id: "all", label: "Semua" },
                      { id: "open", label: "Terbuka" },
                      { id: "replied", label: "Dibalas" },
                      { id: "closed", label: "Ditutup" }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTicketFilter(f.id)}
                        className={`flex-grow text-[9px] font-bold py-1.5 px-1 rounded transition-all ${
                          ticketFilter === f.id
                            ? "bg-amber-400 text-black shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {tickets.filter((t: any) => ticketFilter === "all" || t.status === ticketFilter).length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">Tiada tiket sokongan mengikut penapisan.</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {tickets
                        .filter((t: any) => ticketFilter === "all" || t.status === ticketFilter)
                        .map((t: any) => (
                          <div 
                            key={t.id} 
                            onClick={() => setSelectedTicket(t)}
                            className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                              selectedTicket?.id === t.id
                                ? "bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border-amber-500/50 text-amber-300"
                                : "bg-zinc-950/60 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{t.subject || t.title}</div>
                            <div className="text-[10px] text-slate-500 mt-1">Oleh: {t.userName}</div>
                            <div className="flex justify-between items-center mt-3 text-[9px] font-bold">
                              <span className={`px-2 py-0.5 rounded-full ${
                                t.status === "closed" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                t.status === "replied" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              }`}>
                                {t.status.toUpperCase()}
                              </span>
                              <span className="text-slate-600">{t.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Reply panel */}
                <div className="lg:col-span-7">
                  <Card className="border-white/5 bg-zinc-950/60 p-5 flex flex-col h-[450px]">
                    {selectedTicket ? (
                      <>
                        <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-start text-left">
                          <div>
                            <h3 className="text-sm font-bold text-white leading-tight">
                              {selectedTicket.subject || selectedTicket.title}
                            </h3>
                            <span className="text-[9px] text-slate-500 mt-1 block">
                              Oleh: {selectedTicket.userName} • Tiket ID: {selectedTicket.id}
                            </span>
                            {selectedTicket.orderId && (
                              <span className="text-[10px] text-amber-400/90 font-bold block mt-1">
                                Rujukan Pesanan: <code className="bg-black/40 px-1 py-0.5 rounded border border-white/5 font-mono">{selectedTicket.orderId}</code>
                              </span>
                            )}
                          </div>
                          
                          {/* Status changer dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-500 uppercase font-black">Status:</span>
                            <select 
                              value={selectedTicket.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                const success = await updateTicketStatus(selectedTicket.id, newStatus);
                                if (success) {
                                  setSelectedTicket((prev: any) => prev ? { ...prev, status: newStatus } : null);
                                  alert(`Status tiket berjaya ditukar kepada ${newStatus.toUpperCase()}.`);
                                } else {
                                  alert("Gagal menukar status tiket.");
                                }
                              }}
                              className="bg-black border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500/50"
                            >
                              <option value="open">Open</option>
                              <option value="replied">Replied</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        {/* Message Box */}
                        <div className="flex-grow overflow-y-auto pr-1 space-y-4 mb-4 text-xs">
                          {/* Original Query */}
                          <div className="max-w-[85%] bg-zinc-900 border border-white/5 p-3 rounded-2xl rounded-tl-none mr-auto text-left leading-relaxed">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">{selectedTicket.userName}</span>
                            <p className="mt-1 text-slate-200">{selectedTicket.description || selectedTicket.message}</p>
                          </div>

                          {/* Replies */}
                          {selectedTicket.replies?.map((rep: any, idx: number) => (
                            <div 
                              key={idx}
                              className={`max-w-[85%] p-3 rounded-2xl text-left leading-relaxed ${
                                rep.sender === "admin" 
                                  ? "bg-amber-500/10 border border-amber-500/20 ml-auto rounded-tr-none" 
                                  : "bg-zinc-900 border border-white/5 mr-auto rounded-tl-none"
                              }`}
                            >
                              <span className={`text-[9px] font-bold uppercase tracking-widest block ${
                                rep.sender === "admin" ? "text-amber-400" : "text-cyan-400"
                              }`}>
                                {rep.sender === "admin" ? "Anda (Admin)" : rep.sender === "system" ? "Sistem AI" : selectedTicket.userName}
                              </span>
                              <p className="mt-1 text-slate-200">{rep.message}</p>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleAdminTicketReply} className="flex gap-2 border-t border-white/5 pt-3 mt-auto">
                          <input 
                            type="text" 
                            placeholder="Taip jawapan atau maklum balas bantuan..."
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            className="flex-grow bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            required
                          />
                          <Button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold px-5 py-2.5">
                            Hantar Balasan
                          </Button>
                        </form>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 text-xs">
                        <MessageSquare className="w-8 h-8 text-slate-700" />
                        <span>Sila pilih tiket sokongan masuk di sebelah kiri untuk melihat dan membalas perbualan.</span>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Tab 8: System Notifications logs */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Log Notifikasi Sistem</h2>
                <p className="text-xs text-slate-500 mt-1">Urusan rekod notifikasi aktiviti pendaftaran dan log keluar masuk.</p>
              </div>

              <div className="space-y-3">
                {notifications.map((n: any) => (
                  <Card key={n.id} className="border-white/5 bg-zinc-950/60 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white">{n.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-600 block mt-1">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tab 9: General Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Tetapan Portal Pentadbir</h2>
                <p className="text-xs text-slate-500 mt-1">Sediakan konfigurasi utama dan kawalan keselamatan portal admin.</p>
              </div>

              <Card className="border-white/5 bg-zinc-950/60 p-6 max-w-lg space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-white/5">Tetapan Ekosistem</h3>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Nama Organisasi</span>
                    <span className="font-bold text-white">AA AI GROUP Enterprise</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Mata Tukaran Referral</span>
                    <span className="font-bold text-amber-400">100 Points = RM 10</span>
                  </div>
                </div>

                <Button 
                  onClick={() => alert("Sistem tetapan berjaya disimpan secara simulasi.")}
                  className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-bold text-xs px-6 py-4 rounded-xl"
                >
                  Simpan Semua Tetapan
                </Button>
              </Card>
            </div>
          )}

          {/* Tab 10: Urus Pelanggan (Membership Upgrade/Downgrade) */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Pengurusan Ahli & Pelanggan</h2>
                <p className="text-xs text-slate-500 mt-1">Uruskan tier keahlian pelanggan, diskaun khas, dan tetapkan tarikh luput langganan.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Customers list */}
                <div className="lg:col-span-7 space-y-3">
                  <Card className="border-white/5 bg-zinc-950/60 p-4 overflow-hidden">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Senarai Pengguna ({allUsers.length})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-slate-500 uppercase text-[9px] font-black tracking-wider">
                            <th className="pb-2.5">Pelanggan</th>
                            <th className="pb-2.5">Tier Keahlian</th>
                            <th className="pb-2.5">Diskaun</th>
                            <th className="pb-2.5">Baki Komisen</th>
                            <th className="pb-2.5 text-right">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {allUsers.map((u: any) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3">
                                <div className="font-bold text-white">{u.fullName || "Pelanggan"}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  u.membershipTier === "vip" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" :
                                  u.membershipTier === "premium" ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" :
                                  u.membershipTier === "basic" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25" :
                                  "bg-slate-500/10 text-slate-400"
                                }`}>
                                  {u.membershipTier || "FREE"}
                                </span>
                                {u.membershipExpiresAt && (
                                  <div className="text-[8px] text-slate-500 mt-1">
                                    Hingga: {new Date(u.membershipExpiresAt).toLocaleDateString()}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 font-semibold text-white">
                                {u.specialDiscount || 0}%
                              </td>
                              <td className="py-3 font-semibold text-amber-400">
                                RM {(u.referralBalance || 0).toFixed(2)}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setEditingUserId(u.id);
                                    setMemberTier(u.membershipTier || "free");
                                    setMemberExpiry(u.membershipExpiresAt ? u.membershipExpiresAt.slice(0, 10) : "");
                                    setMemberDiscount(String(u.specialDiscount || 0));
                                  }}
                                  className="bg-amber-400 hover:bg-amber-300 text-black rounded px-2.5 py-1 text-[10px] font-bold"
                                >
                                  Ubah Ahli
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-5">
                  <Card className="border-white/5 bg-zinc-950/60 p-5">
                    {editingUserId ? (
                      (() => {
                        const targetUser = allUsers.find((u: any) => u.id === editingUserId);
                        return (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const expires = memberExpiry ? new Date(memberExpiry).toISOString() : null;
                              const success = await updateUserMembership(editingUserId, memberTier, expires, memberDiscount);
                              if (success) {
                                alert("Keahlian pengguna berjaya dikemaskini.");
                                setEditingUserId("");
                              } else {
                                alert("Gagal mengemaskini keahlian.");
                              }
                            }}
                            className="space-y-4 text-left"
                          >
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">
                              Kemaskini Keahlian Ahli
                            </h3>
                            <div>
                              <div className="text-xs font-bold text-white">{targetUser?.fullName}</div>
                              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{targetUser?.email}</span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-black text-slate-500">Tier Keahlian</label>
                              <select
                                value={memberTier}
                                onChange={(e) => setMemberTier(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                              >
                                <option value="free">Free Member</option>
                                <option value="basic">Basic Member</option>
                                <option value="premium">Premium Member (Diskaun 10%)</option>
                                <option value="vip">VIP Member (Diskaun 20% & Akses VIP)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-black text-slate-500">Diskaun Kustom (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={memberDiscount}
                                onChange={(e) => setMemberDiscount(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-black text-slate-500">Tarikh Luput Keahlian</label>
                              <input
                                type="date"
                                value={memberExpiry}
                                onChange={(e) => setMemberExpiry(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                              />
                              <span className="text-[8px] text-slate-600 block">Kosongkan jika keahlian seumur hidup (lifetime).</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUserId("")}
                                className="w-1/2 border-white/10 text-white rounded-xl text-xs py-3.5"
                              >
                                Batal
                              </Button>
                              <Button
                                type="submit"
                                className="w-1/2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-3.5 rounded-xl"
                              >
                                Simpan Ahli
                              </Button>
                            </div>
                          </form>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-2 text-xs">
                        <Users className="w-8 h-8 text-slate-700" />
                        <span>Pilih salah satu pelanggan di sebelah kiri untuk menguruskan pangkat keahlian mereka.</span>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Tab 11: Payout Referral (Approvals) */}
          {activeTab === "payouts" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h2 className="text-2xl font-black text-white">Kelulusan Payout Komisen Referral</h2>
                <p className="text-xs text-slate-500 mt-1">Uruskan tuntutan komisen tunai oleh perujuk program referral.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Pending Payout requests */}
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Permohonan Menunggu Kelulusan</h3>
                  {payouts.filter((p: any) => p.status === "pending").length === 0 ? (
                    <Card className="border-white/5 bg-zinc-950/60 p-8 text-center text-xs text-slate-500">
                      Tiada tuntutan payout komisen yang baru ketika ini.
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {payouts
                        .filter((p: any) => p.status === "pending")
                        .map((p: any) => (
                          <Card key={p.id} className="border-white/5 bg-zinc-950/60 p-4 flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-white">{p.userName}</div>
                              <span className="text-[9px] text-slate-500 block mt-0.5">{p.userEmail}</span>
                              <div className="text-[11px] text-slate-300 mt-2 bg-black/40 border border-white/5 rounded p-2 font-mono">
                                <strong>Butiran Bank:</strong> {p.paymentDetails}
                              </div>
                            </div>
                            <div className="text-right space-y-2 flex-shrink-0 ml-4">
                              <div className="text-sm font-black text-amber-400">RM {p.amount.toFixed(2)}</div>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={async () => {
                                    if (confirm(`Sahkan pembayaran RM ${p.amount} kepada ${p.userName} telah berjaya dilakukan?`)) {
                                      await processPayout(p.id, "approved");
                                      alert("Permohonan payout diluluskan.");
                                    }
                                  }}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-white rounded px-2.5 py-1 text-[9px] font-bold"
                                >
                                  Lulus
                                </button>
                                <button
                                  onClick={async () => {
                                    const reason = confirm(`Adakah anda pasti mahu menolak permohonan payout komisen ini? Wang tuntutan akan dikembalikan ke baki referral pengguna.`);
                                    if (reason) {
                                      await processPayout(p.id, "rejected");
                                      alert("Permohonan payout ditolak.");
                                    }
                                  }}
                                  className="bg-rose-500 hover:bg-rose-400 text-white rounded px-2.5 py-1 text-[9px] font-bold"
                                >
                                  Tolak
                                </button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>

                {/* History Payout requests */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sejarah Payout</h3>
                  {payouts.filter((p: any) => p.status !== "pending").length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">Tiada rekod lama.</p>
                  ) : (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {payouts
                        .filter((p: any) => p.status !== "pending")
                        .map((p: any) => (
                          <div
                            key={p.id}
                            className="bg-zinc-950/40 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs"
                          >
                            <div>
                              <div className="font-bold text-white">{p.userName}</div>
                              <div className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-extrabold text-white">RM {p.amount.toFixed(2)}</div>
                              <span className={`text-[8px] font-black uppercase tracking-wider block mt-0.5 ${
                                p.status === "approved" ? "text-emerald-400" : "text-rose-400"
                              }`}>
                                {p.status === "approved" ? "BERJAYA" : "DITOLAK"}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
