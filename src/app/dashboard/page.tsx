'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JarvisChatbot from '@/components/JarvisChatbot';
import { 
  ShoppingBag, Key, Video, FileText, Send, 
  MessageSquare, Info, User
} from 'lucide-react';

interface Order {
  id: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentReference: string | null;
  createdDate: string;
  items: {
    itemId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

interface DigitalAccess {
  id: string;
  productName: string;
  productId: string;
  accessStatus: string;
  accessUrl: string | null;
  licenseKey: string | null;
}

interface ServiceRequest {
  id: string;
  productName: string;
  productId: string;
  orderId: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  adminNotes: string | null;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  createdAt: number;
}

interface TicketReply {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'customer';
  message: string;
  createdAt: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  sortOrder: number;
  isPreview: boolean;
}

export default function Dashboard() {
  const { user, refetchUser } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'access' | 'videos' | 'services' | 'tickets'>('orders');
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [accesses, setAccesses] = useState<DigitalAccess[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // States for Video Course player
  const [selectedCourse, setSelectedCourse] = useState<DigitalAccess | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // States for Support Tickets
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // States for Service Requests
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [newRequirements, setNewRequirements] = useState('');

  // Semak log masuk
  useEffect(() => {
    if (!user) {
      refetchUser().then(() => {
        if (!user) router.push('/login');
      });
    }
  }, [user, refetchUser, router]);

  // Load data mengikut tab aktif
  const loadDashboardData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'orders') {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrdersList(data.orders || []);
        }
      } else if (activeTab === 'access') {
        const res = await fetch('/api/digital-access');
        if (res.ok) {
          const data = await res.json();
          setAccesses(data.accesses || []);
        }
      } else if (activeTab === 'services') {
        const res = await fetch('/api/service-requests');
        if (res.ok) {
          const data = await res.json();
          setServices(data.requests || []);
        }
      } else if (activeTab === 'tickets') {
        const res = await fetch('/api/tickets');
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, [activeTab]);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (user) loadDashboardData();
    });
  }, [user, loadDashboardData]);

  // Load lessons for a course
  const loadLessons = async (course: DigitalAccess) => {
    setSelectedCourse(course);
    try {
      const res = await fetch(`/api/products/${course.productId}/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
        if (data.lessons && data.lessons.length > 0) {
          setActiveLesson(data.lessons[0]);
        } else {
          setActiveLesson(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load replies for a ticket
  const loadTicketReplies = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/replies`);
      if (res.ok) {
        const data = await res.json();
        setTicketReplies(data.replies || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyInput.trim()) return;

    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setTicketReplies((prev) => [...prev, data.reply]);
        setReplyInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newTicketSubject,
          message: newTicketMessage,
        }),
      });

      if (res.ok) {
        setShowNewTicketModal(false);
        setNewTicketSubject('');
        setNewTicketMessage('');
        loadDashboardData(); // Refresh list
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateServiceRequirements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !newRequirements.trim()) return;

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedService.orderId,
          productId: selectedService.productId,
          requirements: newRequirements,
        }),
      });

      if (res.ok) {
        setSelectedService(null);
        setNewRequirements('');
        loadDashboardData(); // Refresh list
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary">
        <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabClass = (tab: typeof activeTab) => {
    return activeTab === tab
      ? 'flex items-center gap-2 p-3 px-5 rounded-xl text-xs font-bold bg-primary-color text-white shadow-md shadow-primary-glow transition-all'
      : 'flex items-center gap-2 p-3 px-5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-border-color transition-all';
  };

  return (
    <>
      <Navbar onCartToggle={() => setCartOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-card-bg border border-card-border rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Selamat Kembali, {user.name}!
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Pantau lesen premium, mulakan modul video education AI anda, atau hantar keperluan servis digital.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-muted font-bold block uppercase">Peranan Akaun</span>
            <span className="bg-primary-color/10 border border-primary-color/25 text-primary-color text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider block mt-1">
              {user.role}
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1.5 pb-4 mb-8 border-b border-border-color scrollbar-none">
          <button onClick={() => { setActiveTab('orders'); setSelectedCourse(null); setSelectedTicket(null); }} className={tabClass('orders')}>
            <ShoppingBag className="w-4 h-4" /> Pesanan Saya
          </button>
          <button onClick={() => { setActiveTab('access'); setSelectedCourse(null); setSelectedTicket(null); }} className={tabClass('access')}>
            <Key className="w-4 h-4" /> Akses Lesen & Muat Turun
          </button>
          <button onClick={() => { setActiveTab('videos'); setSelectedCourse(null); setSelectedTicket(null); }} className={tabClass('videos')}>
            <Video className="w-4 h-4" /> Video Pembelajaran
          </button>
          <button onClick={() => { setActiveTab('services'); setSelectedCourse(null); setSelectedTicket(null); }} className={tabClass('services')}>
            <FileText className="w-4 h-4" /> Servis Projek
          </button>
          <button onClick={() => { setActiveTab('tickets'); setSelectedCourse(null); setSelectedTicket(null); }} className={tabClass('tickets')}>
            <MessageSquare className="w-4 h-4" /> Bantuan & Tiket
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {loadingData ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-text-secondary text-sm">Memuatkan data dashboard...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Orders History */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {ordersList.length === 0 ? (
                    <div className="py-12 text-center bg-card-bg border border-card-border rounded-3xl">
                      <p className="text-text-secondary text-sm">Anda belum membuat sebarang pesanan lagi.</p>
                    </div>
                  ) : (
                    ordersList.map((order) => (
                      <div key={order.id} className="p-6 bg-card-bg border border-card-border rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-color pb-4">
                          <div>
                            <span className="font-extrabold text-sm text-text-primary block">{order.id}</span>
                            <span className="text-[10px] text-text-muted mt-1 block">Dipesan pada: {order.createdDate}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-text-secondary">
                              Kaedah: {order.paymentMethod === 'manual_transfer' ? 'Manual Transfer' : 'Gateway'}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                              order.status === 'paid' || order.status === 'completed'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                : order.status === 'pending'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.itemId} className="flex justify-between text-xs">
                              <div>
                                <span className="font-bold text-text-primary">{item.productName}</span>
                                <span className="text-text-muted ml-1.5">(x{item.quantity})</span>
                              </div>
                              <span className="font-extrabold">RM{(item.unitPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-border-color">
                          <span className="text-xs font-bold text-text-secondary">Jumlah Bayaran</span>
                          <span className="font-black text-sm text-primary-color">RM{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Digital Access */}
              {activeTab === 'access' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accesses.length === 0 ? (
                    <div className="col-span-2 py-12 text-center bg-card-bg border border-card-border rounded-3xl">
                      <p className="text-text-secondary text-sm">Tiada lesen atau fail sedia ada.</p>
                    </div>
                  ) : (
                    accesses.map((acc) => (
                      <div key={acc.id} className="p-6 bg-card-bg border border-card-border rounded-2xl space-y-4">
                        <div>
                          <span className="text-[10px] text-primary-color font-bold block uppercase">Lesen Aktif</span>
                          <h4 className="font-extrabold text-sm text-text-primary mt-1">{acc.productName}</h4>
                        </div>

                        {/* Display License Key if any */}
                        {acc.licenseKey && (
                          <div className="p-3 bg-bg-primary border border-border-color rounded-xl">
                            <span className="text-[10px] text-text-secondary font-bold block mb-1 uppercase">Kod Lesen / Kunci Aktivasi</span>
                            <code className="text-xs font-mono font-bold text-text-primary select-all">{acc.licenseKey}</code>
                          </div>
                        )}

                        {/* Display Access Link / Download Link if any */}
                        {acc.accessUrl && (
                          <a
                            href={acc.accessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full p-3 rounded-xl bg-primary-color hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary-glow flex items-center justify-center gap-1.5 transition-all text-center"
                          >
                            🔗 Klik Untuk Akses / Pautan Muat Turun
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Video Course Player */}
              {activeTab === 'videos' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Side: Course Selector & Syllabus */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-extrabold text-sm text-text-primary mb-3">Kursus Anda</h3>
                    {/* Filter accesses to show only video_courses */}
                    {accesses.length === 0 ? (
                      <div className="p-4 bg-card-bg border border-card-border rounded-2xl text-center text-xs text-text-muted">
                        Tiada kursus dijumpai. Anda perlu memiliki digital course untuk membuka video.
                      </div>
                    ) : (
                      accesses.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => loadLessons(acc)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            selectedCourse?.id === acc.id
                              ? 'bg-primary-color/5 border-primary-color text-primary-color font-bold'
                              : 'bg-card-bg border-card-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {acc.productName}
                        </button>
                      ))
                    )}

                    {/* Lesson selection if course is selected */}
                    {selectedCourse && (
                      <div className="space-y-2 pt-4 border-t border-border-color">
                        <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider">Silabus Kursus</h4>
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                          {lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full text-left p-3 rounded-xl text-xs border transition-all ${
                                activeLesson?.id === lesson.id
                                  ? 'bg-border-color border-primary-color font-bold text-text-primary'
                                  : 'bg-bg-primary/50 border-border-color text-text-secondary hover:bg-border-color'
                              }`}
                            >
                              {lesson.sortOrder}. {lesson.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Player Screen */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedCourse && activeLesson ? (
                      <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4">
                        {/* Video Embed Frame */}
                        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-lg">
                          <iframe
                            src={activeLesson.videoUrl}
                            title={activeLesson.title}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                          ></iframe>
                        </div>

                        {/* Video Info */}
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-base text-text-primary">
                            {activeLesson.sortOrder}. {activeLesson.title}
                          </h3>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {activeLesson.description || 'Tiada penerangan tambahan untuk video modul ini.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-24 text-center bg-card-bg border border-card-border rounded-3xl flex flex-col items-center justify-center gap-2">
                        <Video className="w-12 h-12 text-text-muted opacity-50" />
                        <p className="text-text-secondary text-sm font-semibold">Sila pilih kursus dan video pelajaran untuk memulakan.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Service Request Management */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Side: Services List */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-extrabold text-sm text-text-primary mb-3">Servis Ditempah</h3>
                    {services.length === 0 ? (
                      <div className="p-4 bg-card-bg border border-card-border rounded-2xl text-center text-xs text-text-muted">
                        Tiada permintaan servis dijumpai.
                      </div>
                    ) : (
                      services.map((req) => (
                        <button
                          key={req.id}
                          onClick={() => {
                            setSelectedService(req);
                            setNewRequirements(req.requirements);
                          }}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            selectedService?.id === req.id
                              ? 'bg-primary-color/5 border-primary-color text-primary-color font-bold'
                              : 'bg-card-bg border-card-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-text-muted font-mono">{req.orderId}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              req.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : req.status === 'in_progress'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <span className="text-xs text-text-primary font-bold block truncate">{req.productName}</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right Side: Service Details & Requirements Form */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedService ? (
                      <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6">
                        <div className="border-b border-border-color pb-4 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-text-muted block font-mono">ID Servis: {selectedService.id}</span>
                            <h4 className="font-extrabold text-sm text-text-primary mt-1">{selectedService.productName}</h4>
                          </div>
                        </div>

                        {/* Requirements Form */}
                        <form onSubmit={handleUpdateServiceRequirements} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wide">
                              Keperluan Projek / Spesifikasi Penuh
                            </label>
                            <textarea
                              rows={6}
                              value={newRequirements}
                              onChange={(e) => setNewRequirements(e.target.value)}
                              placeholder="Masukkan butiran projek yang anda mahu kami siapkan..."
                              className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-color"
                            />
                          </div>

                          <button
                            type="submit"
                            className="p-3 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center gap-1.5 transition-all"
                          >
                            💾 Kemaskini Spesifikasi Projek
                          </button>
                        </form>

                        {/* Admin progress Notes */}
                        {selectedService.adminNotes && (
                          <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl space-y-1">
                            <span className="text-[10px] text-indigo-400 font-bold block uppercase flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" /> Log Nota Progress Pihak Admin
                            </span>
                            <p className="text-xs text-text-primary whitespace-pre-line leading-relaxed">
                              {selectedService.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-24 text-center bg-card-bg border border-card-border rounded-3xl flex flex-col items-center justify-center gap-2">
                        <FileText className="w-12 h-12 text-text-muted opacity-50" />
                        <p className="text-text-secondary text-sm font-semibold">Sila pilih rekod servis digital untuk mengurus projek.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Support Tickets */}
              {activeTab === 'tickets' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Side: Ticket List */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-extrabold text-sm text-text-primary">Tiket Sokongan</h3>
                      <button
                        onClick={() => setShowNewTicketModal(true)}
                        className="bg-primary-color/10 border border-primary-color/20 text-primary-color hover:bg-primary-color/20 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        ➕ Buka Tiket Baru
                      </button>
                    </div>

                    {tickets.length === 0 ? (
                      <div className="p-4 bg-card-bg border border-card-border rounded-2xl text-center text-xs text-text-muted">
                        Tiada tiket dijumpai.
                      </div>
                    ) : (
                      tickets.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => loadTicketReplies(t)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            selectedTicket?.id === t.id
                              ? 'bg-primary-color/5 border-primary-color text-primary-color font-bold'
                              : 'bg-card-bg border-card-border text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-text-muted font-mono">{t.id}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              t.status === 'closed'
                                ? 'bg-gray-500/10 text-gray-500'
                                : t.status === 'replied'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                          <span className="text-xs text-text-primary font-bold block truncate">{t.subject}</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right Side: Conversation Chat thread */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedTicket ? (
                      <div className="p-6 bg-card-bg border border-card-border rounded-3xl h-[520px] flex flex-col justify-between">
                        {/* Conversation Header */}
                        <div className="border-b border-border-color pb-3 mb-4 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-text-muted block font-mono">Tiket: {selectedTicket.id}</span>
                            <h4 className="font-extrabold text-sm text-text-primary mt-0.5">{selectedTicket.subject}</h4>
                          </div>
                        </div>

                        {/* Thread list */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
                          {/* User original ticket message */}
                          <div className="flex gap-2.5 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="max-w-[80%]">
                              <span className="text-[9px] text-text-muted block mb-1 font-semibold">{user.name}</span>
                              <div className="p-3 bg-bg-primary border border-border-color rounded-2xl rounded-tl-none text-xs leading-relaxed text-text-primary">
                                {selectedTicket.message}
                              </div>
                            </div>
                          </div>

                          {/* Replies list */}
                          {ticketReplies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`flex gap-2.5 ${reply.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              {reply.senderRole !== 'admin' && (
                                <div className="w-8 h-8 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                              <div className="max-w-[80%]">
                                <span className={`text-[9px] block mb-1 font-semibold ${
                                  reply.senderRole === 'admin' ? 'text-right text-accent-cyan' : 'text-left text-text-muted'
                                }`}>
                                  {reply.senderRole === 'admin' ? '⚙️ Admin support' : reply.senderName}
                                </span>
                                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                  reply.senderRole === 'admin'
                                    ? 'bg-primary-color text-white rounded-tr-none'
                                    : 'bg-bg-primary border border-border-color text-text-primary rounded-tl-none'
                                }`}>
                                  {reply.message}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply Form */}
                        {selectedTicket.status !== 'closed' ? (
                          <form onSubmit={handleSendTicketReply} className="flex gap-2 border-t border-border-color pt-3 bg-card-bg">
                            <input
                              type="text"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              placeholder="Tulis balasan..."
                              className="flex-1 bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary-color"
                            />
                            <button
                              type="submit"
                              className="p-2.5 bg-primary-color hover:bg-primary-hover text-white rounded-xl flex items-center justify-center"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        ) : (
                          <div className="text-center p-3 border border-dashed border-border-color rounded-xl text-xs text-text-muted">
                            🔒 Tiket bantuan ini telah ditutup.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-24 text-center bg-card-bg border border-card-border rounded-3xl flex flex-col items-center justify-center gap-2">
                        <MessageSquare className="w-12 h-12 text-text-muted opacity-50" />
                        <p className="text-text-secondary text-sm font-semibold">Sila pilih tiket bantuan untuk melihat perbualan.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewTicketModal(false)} />
          
          <form onSubmit={handleCreateTicket} className="relative w-full max-w-md bg-bg-secondary border border-border-color rounded-3xl shadow-2xl p-6 overflow-hidden z-10 space-y-4">
            <h3 className="font-extrabold text-base text-text-primary">Buka Tiket Bantuan Baru</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Subjek / Masalah Utama</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="Contoh: Lesen Canva Pro gagal diaktifkan"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 text-xs focus:outline-none focus:border-primary-color"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Mesej Perincian Isu</label>
                <textarea
                  rows={4}
                  required
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  placeholder="Sila nyatakan masalah anda secara terperinci untuk tindakan segera admin."
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 text-xs focus:outline-none focus:border-primary-color"
                />
              </div>
            </div>

            <div className="flex gap-2 border-t border-border-color pt-4 justify-end">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2.5 border border-border-color text-text-secondary rounded-xl text-xs font-bold hover:bg-border-color"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary-color hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md shadow-primary-glow"
              >
                Hantar Tiket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Jarvis Chatbot */}
      <JarvisChatbot />

      <Footer />
    </>
  );
}
