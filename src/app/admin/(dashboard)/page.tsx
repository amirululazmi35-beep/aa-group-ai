'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BarChart3, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
  MessageSquare, FileText, Settings, ShoppingBag, 
  Search, Eye, Save, AlertTriangle
} from 'lucide-react';

interface Stats {
  totalEarnings: number;
  customersCount: number;
  productsCount: number;
  pendingOrdersCount: number;
  openTicketsCount: number;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  type: 'app' | 'video_course' | 'service' | 'bundle' | 'other';
  shortDescription: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  thumbnailUrl: string | null;
  status: 'draft' | 'published' | 'archived';
  accessType: 'download_link' | 'license_key' | 'video_access' | 'service_request' | 'external_link';
  accessValue: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: number;
}

interface OrderItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  thumbnailUrl: string | null;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentReference: string | null;
  paymentReceiptUrl: string | null;
  createdDate: string;
  createdAt: number;
  items: OrderItem[];
}

interface ServiceRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail: string;
  requirements: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  adminNotes: string | null;
  createdAt: number;
}

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  createdAt: number;
  userName: string;
  userEmail: string;
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

export default function AdminDashboard() {
  const { user, refetchUser, settings, updateSettings } = useApp();
  const router = useRouter();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'produk' | 'kategori' | 'pesanan' | 'servis' | 'bantuan' | 'tetapan'>('ringkasan');
  
  // Lists data
  const [stats, setStats] = useState<Stats>({ totalEarnings: 0, customersCount: 0, productsCount: 0, pendingOrdersCount: 0, openTicketsCount: 0 });
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [servicesList, setServicesList] = useState<ServiceRequest[]>([]);
  const [ticketsList, setTicketsList] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [prodSearch, setProdSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  // Brand Tetapan fields state
  const [brandForm, setBrandForm] = useState({
    brandName: '',
    logoUrl: '',
    supportEmail: '',
    supportPhone: '',
    themeColor: '',
    qrUrl: '',
    whatsappNumber: '',
    maintenanceMode: false,
    maintenanceMessage: '',
  });

  // Modal control states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [serviceStatusInput, setServiceStatusInput] = useState<'pending' | 'in_progress' | 'completed' | 'cancelled'>('pending');
  const [serviceNotesInput, setServiceNotesInput] = useState('');

  // Support ticket thread
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyText, setReplyText] = useState('');

  // Product form states
  const [prodForm, setProdForm] = useState<{
    name: string;
    categoryId: string;
    type: 'app' | 'video_course' | 'service' | 'bundle' | 'other';
    shortDescription: string;
    description: string;
    price: string;
    comparePrice: string;
    thumbnailUrl: string;
    status: 'draft' | 'published' | 'archived';
    accessType: 'download_link' | 'license_key' | 'video_access' | 'service_request' | 'external_link';
    accessValue: string;
  }>({
    name: '',
    categoryId: '',
    type: 'app',
    shortDescription: '',
    description: '',
    price: '',
    comparePrice: '',
    thumbnailUrl: '',
    status: 'published',
    accessType: 'download_link',
    accessValue: '',
  });

  // Category form states
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
  });

  // Security Check
  useEffect(() => {
    if (!user) {
      refetchUser().then(() => {
        if (!user) router.push('/admin/login');
      });
    } else if (user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, refetchUser, router]);

  // Load stats and settings
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setProductsList(data.products || []);
        setCategoriesList(data.categories || []);
        setCustomersList(data.customers || []);
        setOrdersList(data.orders || []);
        setServicesList(data.services || []);
        setTicketsList(data.tickets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      if (user && user.role === 'admin') {
        fetchAdminData();
        setBrandForm({
          brandName: settings.brandName,
          logoUrl: settings.logoUrl,
          supportEmail: settings.supportEmail,
          supportPhone: settings.supportPhone,
          themeColor: settings.themeColor,
          qrUrl: settings.qrUrl,
          whatsappNumber: settings.whatsappNumber,
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMessage,
        });
      }
    });
  }, [user, activeTab, settings]);

  // Fetch ticket replies
  const fetchReplies = async (ticket: Ticket) => {
    setActiveTicket(ticket);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/replies`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.replies || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reply to ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    try {
      const res = await fetch(`/api/tickets/${activeTicket.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplies((prev) => [...prev, data.reply]);
        setReplyText('');
        // Refresh ticket list to show 'replied' status
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Approve Order Payment
  const handleApproveOrder = async (orderId: string) => {
    if (!confirm('Adakah anda pasti mahu MENGESAHKAN pembayaran bagi pesanan ini?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      if (res.ok) {
        alert('Pesanan berjaya diluluskan!');
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reject/Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Adakah anda pasti mahu MEMBATALKAN pesanan ini?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        alert('Pesanan telah dibatalkan.');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Service progress notes
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const res = await fetch(`/api/admin/service-requests/${selectedService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: serviceStatusInput,
          adminNotes: serviceNotesInput,
        }),
      });

      if (res.ok) {
        alert('Rekod progress servis berjaya dikemaskini!');
        setSelectedService(null);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandForm),
      });

      if (res.ok) {
        const data = await res.json();
        updateSettings(data.settings);
        alert('Tetapan jenama sistem berjaya disimpan!');
      } else {
        const data = await res.json();
        alert(`Ralat: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product CRUD save handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingProduct;
    const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodForm),
      });

      if (res.ok) {
        alert(isEdit ? 'Produk dikemaskini!' : 'Produk ditambah!');
        setShowProductModal(false);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(`Ralat: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Product CRUD delete handler
  const handleProductDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu memadam/mengarkib produk ini?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Produk berjaya diarkibkan.');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Category CRUD save handler
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingCategory;
    const url = isEdit ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });

      if (res.ok) {
        alert(isEdit ? 'Kategori dikemaskini!' : 'Kategori ditambah!');
        setShowCategoryModal(false);
        setEditingCategory(null);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(`Ralat: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Category CRUD delete handler
  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu menyahaktifkan kategori ini?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Kategori berjaya dinyahaktifkan.');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Edit Product Modal setup
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      categoryId: prod.categoryId,
      type: prod.type,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price.toString(),
      comparePrice: prod.comparePrice?.toString() || '',
      thumbnailUrl: prod.thumbnailUrl || '',
      status: prod.status,
      accessType: prod.accessType,
      accessValue: prod.accessValue || '',
    });
    setShowProductModal(true);
  };

  // Add Product Modal setup
  const startAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      categoryId: categoriesList[0]?.id || '',
      type: 'app',
      shortDescription: '',
      description: '',
      price: '',
      comparePrice: '',
      thumbnailUrl: '',
      status: 'published',
      accessType: 'download_link',
      accessValue: '',
    });
    setShowProductModal(true);
  };

  // Edit Category Modal setup
  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      description: cat.description || '',
    });
    setShowCategoryModal(true);
  };

  // Add Category Modal setup
  const startAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      description: '',
    });
    setShowCategoryModal(true);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabClass = (tab: typeof activeTab) => {
    return activeTab === tab
      ? 'flex items-center gap-2 p-3 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-purple to-primary-color text-white shadow-md shadow-primary-glow transition-all'
      : 'flex items-center gap-2 p-3 px-5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-border-color transition-all';
  };

  // Filters lists
  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase())
  );
  
  const filteredOrders = ordersList.filter((o) =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredTickets = ticketsList.filter((t) =>
    t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
    t.userName.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Section */}
        <div className="mb-8 p-6 bg-card-bg border border-card-border rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Portal Kawalan Pentadbir
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Urus lesen digital, sahkan resit bayaran transfer manual, jejak projek servis, dan balas tiket bantuan pelanggan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              Sistem Aktif (Live)
            </span>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex overflow-x-auto gap-1.5 pb-4 mb-8 border-b border-border-color scrollbar-none">
          <button onClick={() => setActiveTab('ringkasan')} className={tabClass('ringkasan')}>
            <BarChart3 className="w-4 h-4" /> Ringkasan
          </button>
          <button onClick={() => setActiveTab('pesanan')} className={tabClass('pesanan')}>
            <ShoppingBag className="w-4 h-4" /> Pengesahan Pesanan {stats.pendingOrdersCount > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">{stats.pendingOrdersCount}</span>}
          </button>
          <button onClick={() => setActiveTab('produk')} className={tabClass('produk')}>
            <Plus className="w-4 h-4" /> Urus Produk
          </button>
          <button onClick={() => setActiveTab('kategori')} className={tabClass('kategori')}>
            <Settings className="w-4 h-4" /> Urus Kategori
          </button>
          <button onClick={() => setActiveTab('servis')} className={tabClass('servis')}>
            <FileText className="w-4 h-4" /> Permintaan Servis
          </button>
          <button onClick={() => setActiveTab('bantuan')} className={tabClass('bantuan')}>
            <MessageSquare className="w-4 h-4" /> Balas Tiket {stats.openTicketsCount > 0 && <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{stats.openTicketsCount}</span>}
          </button>
          <button onClick={() => setActiveTab('tetapan')} className={tabClass('tetapan')}>
            <Settings className="w-4 h-4" /> Tetapan Sistem
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-text-secondary text-sm">Memuatkan data admin...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Tab 1: Ringkasan */}
            {activeTab === 'ringkasan' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="p-6 bg-card-bg border border-card-border rounded-2xl">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Jumlah Jualan (RM)</span>
                    <h3 className="text-xl sm:text-2xl font-black text-primary-color mt-2">RM{stats.totalEarnings.toFixed(2)}</h3>
                  </div>
                  <div className="p-6 bg-card-bg border border-card-border rounded-2xl">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Jumlah Pelanggan</span>
                    <h3 className="text-xl sm:text-2xl font-black text-text-primary mt-2">{stats.customersCount}</h3>
                  </div>
                  <div className="p-6 bg-card-bg border border-card-border rounded-2xl">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Produk Aktif</span>
                    <h3 className="text-xl sm:text-2xl font-black text-accent-cyan mt-2">{stats.productsCount}</h3>
                  </div>
                  <div className="p-6 bg-card-bg border border-card-border rounded-2xl">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Menunggu Pengesahan</span>
                    <h3 className="text-xl sm:text-2xl font-black text-red-500 mt-2">{stats.pendingOrdersCount}</h3>
                  </div>
                </div>

                {/* Simulated activity feeds */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4">
                    <h4 className="font-extrabold text-sm text-text-primary">Pelanggan Baru Mendaftar</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {customersList.slice(0, 5).map((cust) => (
                        <div key={cust.id} className="flex justify-between items-center text-xs p-3 bg-bg-primary/50 border border-border-color rounded-xl">
                          <div>
                            <span className="font-bold text-text-primary block">{cust.name}</span>
                            <span className="text-text-muted text-[10px]">{cust.email}</span>
                          </div>
                          <span className="text-text-muted">{new Date(cust.createdAt).toLocaleDateString('ms-MY')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4">
                    <h4 className="font-extrabold text-sm text-text-primary">Pesanan Terkini</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {ordersList.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="flex justify-between items-center text-xs p-3 bg-bg-primary/50 border border-border-color rounded-xl">
                          <div>
                            <span className="font-bold text-text-primary block">{ord.id}</span>
                            <span className="text-text-muted text-[10px]">{ord.customerName} - RM{ord.totalAmount.toFixed(2)}</span>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ord.status === 'paid' || ord.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : ord.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Pengesahan Pesanan */}
            {activeTab === 'pesanan' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <h3 className="font-extrabold text-sm text-text-primary mr-auto">Senarai Pesanan Masuk</h3>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Cari ID pesanan / nama..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-bg-primary border border-border-color rounded-xl p-2.5 pl-9 text-xs text-text-primary focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center bg-card-bg border border-card-border rounded-3xl">
                      <p className="text-text-secondary text-sm">Tiada rekod pesanan dijumpai.</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={order.id} className="p-6 bg-card-bg border border-card-border rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-color pb-4">
                          <div>
                            <span className="font-extrabold text-sm text-text-primary block">{order.id}</span>
                            <span className="text-[10px] text-text-muted mt-1 block">
                              Pelanggan: <strong className="text-text-primary">{order.customerName}</strong> ({order.customerEmail})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
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
                        <div className="space-y-2 text-xs">
                          <span className="text-[10px] text-text-secondary font-bold block uppercase tracking-wide">Item Pesanan</span>
                          {order.items.map((item) => (
                            <div key={item.itemId} className="flex justify-between items-center bg-bg-primary/40 p-2.5 rounded-lg border border-border-color/50">
                              <span>{item.productName} <strong className="text-text-muted ml-1">(x{item.quantity})</strong></span>
                              <span className="font-bold">RM{(item.unitPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-border-color gap-4">
                          <div className="text-xs">
                            <span className="text-text-muted block">Rujukan Transaksi:</span>
                            <code className="font-mono font-bold text-text-primary block mt-0.5">{order.paymentReference || 'TIADA'}</code>
                          </div>
                          
                          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                            {order.paymentReceiptUrl && (
                              <button
                                onClick={() => setSelectedReceiptUrl(order.paymentReceiptUrl)}
                                className="p-2.5 px-4 bg-border-color hover:bg-border-color/80 text-text-primary font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" /> Lihat Resit
                              </button>
                            )}
                            
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="p-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Tolak
                                </button>
                                <button
                                  onClick={() => handleApproveOrder(order.id)}
                                  className="p-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Luluskan Pembayaran
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Urus Produk */}
            {activeTab === 'produk' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    onClick={startAddProduct}
                    className="p-3 px-5 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center gap-1.5 transition-all mr-auto"
                  >
                    <Plus className="w-4 h-4" /> Tambah Produk Baru
                  </button>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="w-full bg-bg-primary border border-border-color rounded-xl p-2.5 pl-9 text-xs text-text-primary focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-bg-primary/55 border-b border-border-color text-text-secondary font-bold uppercase tracking-wider">
                          <th className="p-4">Nama Produk</th>
                          <th className="p-4">Jenis</th>
                          <th className="p-4">Harga (RM)</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Akses Penerimaan</th>
                          <th className="p-4 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-bg-primary/20 text-text-primary font-medium">
                            <td className="p-4 flex items-center gap-3">
                              {prod.thumbnailUrl && (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={prod.thumbnailUrl} alt={prod.name} className="w-8 h-8 rounded-lg object-cover border border-border-color" />
                                </>
                              )}
                              <div>
                                <span className="font-extrabold text-sm block">{prod.name}</span>
                                <span className="text-[10px] text-text-secondary font-mono">{prod.id}</span>
                              </div>
                            </td>
                            <td className="p-4 capitalize">{prod.type.replace('_', ' ')}</td>
                            <td className="p-4 font-extrabold">RM{prod.price.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                prod.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : prod.status === 'draft'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}>
                                {prod.status}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px]">{prod.accessType}</td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => startEditProduct(prod)}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg inline-flex items-center"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleProductDelete(prod.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg inline-flex items-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Urus Kategori */}
            {activeTab === 'kategori' && (
              <div className="space-y-4">
                <button
                  onClick={startAddCategory}
                  className="p-3 px-5 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center gap-1.5 transition-all mr-auto"
                >
                  <Plus className="w-4 h-4" /> Tambah Kategori Baru
                </button>

                <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-bg-primary/55 border-b border-border-color text-text-secondary font-bold uppercase tracking-wider">
                          <th className="p-4">Nama Kategori</th>
                          <th className="p-4">Slug</th>
                          <th className="p-4">Penerangan</th>
                          <th className="p-4">Status Aktif</th>
                          <th className="p-4 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {categoriesList.map((cat) => (
                          <tr key={cat.id} className="hover:bg-bg-primary/20 text-text-primary font-medium">
                            <td className="p-4 font-bold">{cat.name}</td>
                            <td className="p-4 font-mono">{cat.slug}</td>
                            <td className="p-4 max-w-xs truncate">{cat.description || 'Tiada Penerangan'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                cat.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {cat.isActive ? 'Aktif' : 'Nyahaktif'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => startEditCategory(cat)}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg inline-flex items-center"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCategoryDelete(cat.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg inline-flex items-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Permintaan Servis */}
            {activeTab === 'servis' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Services list */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="font-extrabold text-sm text-text-primary mb-3">Pesanan Servis Masuk</h3>
                  {servicesList.length === 0 ? (
                    <div className="p-4 bg-card-bg border border-card-border rounded-2xl text-center text-xs text-text-muted">
                      Tiada tempahan servis dijumpai.
                    </div>
                  ) : (
                    servicesList.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => {
                          setSelectedService(req);
                          setServiceStatusInput(req.status);
                          setServiceNotesInput(req.adminNotes || '');
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
                        <span className="text-[10px] text-text-secondary block mt-1">Oleh: {req.userName}</span>
                      </button>
                    ))
                  )}
                </div>

                {/* Progress manager screen */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedService ? (
                    <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6">
                      <div className="border-b border-border-color pb-4">
                        <span className="text-[10px] text-text-muted block font-mono">ID Servis: {selectedService.id}</span>
                        <h4 className="font-extrabold text-sm text-text-primary mt-1">{selectedService.productName}</h4>
                        <span className="text-xs text-text-secondary mt-1 block">Pelanggan: <strong>{selectedService.userName}</strong> ({selectedService.userEmail})</span>
                      </div>

                      {/* Requirements display */}
                      <div className="p-4 bg-bg-primary border border-border-color rounded-xl">
                        <span className="text-[10px] text-text-secondary font-bold block uppercase mb-1">Keperluan Projek (Pelanggan)</span>
                        <p className="text-xs text-text-primary whitespace-pre-line leading-relaxed">
                          {selectedService.requirements}
                        </p>
                      </div>

                      {/* Status / Notes edit form */}
                      <form onSubmit={handleUpdateService} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase">Status Kemajuan Projek</label>
                          <select
                            value={serviceStatusInput}
                            onChange={(e) => setServiceStatusInput(e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                            className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 text-xs focus:outline-none focus:border-primary-color"
                          >
                            <option value="pending">Pending (Menunggu spesifikasi/kelulusan)</option>
                            <option value="in_progress">In Progress (Sedang disiapkan)</option>
                            <option value="completed">Completed (Selesai dihantar)</option>
                            <option value="cancelled">Cancelled (Batal)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase">Log Nota Progress / Maklumat Pautan Hantaran</label>
                          <textarea
                            rows={5}
                            value={serviceNotesInput}
                            onChange={(e) => setServiceNotesInput(e.target.value)}
                            placeholder="Tuliskan perkembangan semasa projek, nota reka bentuk, atau pautan download fail/hasil rekaan untuk pelanggan..."
                            className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-color"
                          />
                        </div>

                        <button
                          type="submit"
                          className="p-3 bg-gradient-to-r from-accent-purple to-primary-color hover:from-accent-purple/90 hover:to-primary-hover text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center gap-1.5 transition-all"
                        >
                          <Save className="w-4 h-4" /> Simpan Perkembangan Projek
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-card-bg border border-card-border rounded-3xl flex flex-col items-center justify-center gap-2">
                      <FileText className="w-12 h-12 text-text-muted opacity-50" />
                      <p className="text-text-secondary text-sm font-semibold">Sila pilih rekod tempahan servis untuk mengurus.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 6: Bantuan Pelanggan */}
            {activeTab === 'bantuan' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets list */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex flex-col gap-2 mb-3">
                    <h3 className="font-extrabold text-sm text-text-primary">Tiket Bantuan Pelanggan</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cari tiket..."
                        value={ticketSearch}
                        onChange={(e) => setTicketSearch(e.target.value)}
                        className="w-full bg-bg-primary border border-border-color rounded-xl p-2.5 pl-9 text-xs text-text-primary focus:outline-none"
                      />
                      <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {filteredTickets.length === 0 ? (
                    <div className="p-4 bg-card-bg border border-card-border rounded-2xl text-center text-xs text-text-muted">
                      Tiada tiket sokongan dijumpai.
                    </div>
                  ) : (
                    filteredTickets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => fetchReplies(t)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                          activeTicket?.id === t.id
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
                        <span className="text-[10px] text-text-secondary block mt-1">Oleh: {t.userName}</span>
                      </button>
                    ))
                  )}
                </div>

                {/* Conversation board */}
                <div className="lg:col-span-2 space-y-4">
                  {activeTicket ? (
                    <div className="p-6 bg-card-bg border border-card-border rounded-3xl h-[520px] flex flex-col justify-between">
                      {/* Header */}
                      <div className="border-b border-border-color pb-3 mb-4 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-text-muted block font-mono">Tiket: {activeTicket.id}</span>
                          <h4 className="font-extrabold text-sm text-text-primary mt-0.5">{activeTicket.subject}</h4>
                          <span className="text-xs text-text-secondary mt-0.5 block">Pelanggan: <strong>{activeTicket.userName}</strong> ({activeTicket.userEmail})</span>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
                        {/* User original issue message */}
                        <div className="flex gap-2.5 justify-start">
                          <div className="w-8 h-8 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0 font-bold text-xs">
                            C
                          </div>
                          <div className="max-w-[80%]">
                            <span className="text-[9px] text-text-muted block mb-1 font-semibold">{activeTicket.userName}</span>
                            <div className="p-3 bg-bg-primary border border-border-color rounded-2xl rounded-tl-none text-xs leading-relaxed text-text-primary">
                              {activeTicket.message}
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`flex gap-2.5 ${reply.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            {reply.senderRole !== 'admin' && (
                              <div className="w-8 h-8 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0 font-bold text-xs">
                                C
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

                      {/* Send Form */}
                      <form onSubmit={handleSendReply} className="flex gap-2 border-t border-border-color pt-3 bg-card-bg">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tulis maklum balas sokongan..."
                          className="flex-1 bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary-color"
                        />
                        <button
                          type="submit"
                          className="p-2.5 bg-gradient-to-r from-accent-purple to-primary-color text-white rounded-xl font-bold text-xs px-5 shadow-md flex items-center justify-center"
                        >
                          Hantar
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-card-bg border border-card-border rounded-3xl flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="w-12 h-12 text-text-muted opacity-50" />
                      <p className="text-text-secondary text-sm font-semibold">Sila pilih tiket untuk memulakan perbualan bantuan.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 7: Tetapan Sistem */}
            {activeTab === 'tetapan' && (
              <div className="max-w-2xl bg-card-bg border border-card-border rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-border-color pb-4">
                  <h3 className="font-extrabold text-sm text-text-primary">Tetapan Penjenamaan & Cawangan Bayaran</h3>
                  <p className="text-[11px] text-text-secondary mt-1">
                    Ubah suai butiran platform utama, maklumat hubungan sokongan, pautan QR DuitNow, serta mod penyelenggaraan secara dinamik.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Nama Kedai / Platform</label>
                      <input
                        type="text"
                        required
                        value={brandForm.brandName}
                        onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Warna Tema Utama (Hex)</label>
                      <input
                        type="text"
                        required
                        value={brandForm.themeColor}
                        onChange={(e) => setBrandForm({ ...brandForm, themeColor: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Pautan URL Logo</label>
                      <input
                        type="text"
                        required
                        value={brandForm.logoUrl}
                        onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Nombor Telefon Sokongan</label>
                      <input
                        type="text"
                        required
                        value={brandForm.supportPhone}
                        onChange={(e) => setBrandForm({ ...brandForm, supportPhone: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Emel Sokongan</label>
                      <input
                        type="email"
                        required
                        value={brandForm.supportEmail}
                        onChange={(e) => setBrandForm({ ...brandForm, supportEmail: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Nombor WhatsApp Pengarah (Format: 6011...)</label>
                      <input
                        type="text"
                        required
                        value={brandForm.whatsappNumber}
                        onChange={(e) => setBrandForm({ ...brandForm, whatsappNumber: e.target.value })}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Pautan URL QR Code DuitNow</label>
                    <input
                      type="text"
                      required
                      value={brandForm.qrUrl}
                      onChange={(e) => setBrandForm({ ...brandForm, qrUrl: e.target.value })}
                      className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                    />
                  </div>

                  <div className="border-t border-border-color pt-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-text-primary block">Mod Penyelenggaraan (Maintenance Mode)</span>
                          <span className="text-[10px] text-text-secondary mt-0.5 block">Kunci platform luar kepada paparan makluman sahaja.</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={brandForm.maintenanceMode}
                        onChange={(e) => setBrandForm({ ...brandForm, maintenanceMode: e.target.checked })}
                        className="w-4 h-4 text-primary-color"
                      />
                    </div>

                    {brandForm.maintenanceMode && (
                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase">Mesej Notis Penyelenggaraan</label>
                        <textarea
                          rows={3}
                          value={brandForm.maintenanceMessage}
                          onChange={(e) => setBrandForm({ ...brandForm, maintenanceMessage: e.target.value })}
                          className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3.5 bg-gradient-to-r from-accent-purple to-primary-color text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" /> Simpan Semua Tetapan
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>

      {/* MODAL 1: Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          
          <form onSubmit={handleProductSubmit} className="relative w-full max-w-lg bg-bg-secondary border border-border-color rounded-3xl shadow-2xl p-6 overflow-hidden z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-text-primary">
              {editingProduct ? 'Edit Maklumat Produk' : 'Tambah Produk Baru'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="Contoh: Canva Pro Access 1-Year"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Kategori</label>
                <select
                  value={prodForm.categoryId}
                  onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Jenis Produk</label>
                <select
                  value={prodForm.type}
                  onChange={(e) => setProdForm({ ...prodForm, type: e.target.value as 'app' | 'video_course' | 'service' | 'bundle' | 'other' })}
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                >
                  <option value="app">App Premium License</option>
                  <option value="video_course">Video Education Course</option>
                  <option value="service">Digital Service</option>
                  <option value="bundle">Bundle App & Course</option>
                  <option value="other">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Harga Jualan (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={prodForm.price}
                  onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                  placeholder="19.90"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Harga Pembanding (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={prodForm.comparePrice}
                  onChange={(e) => setProdForm({ ...prodForm, comparePrice: e.target.value })}
                  placeholder="39.90"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-text-secondary mb-1">URL Gambar Thumbnail</label>
                <input
                  type="text"
                  value={prodForm.thumbnailUrl}
                  onChange={(e) => setProdForm({ ...prodForm, thumbnailUrl: e.target.value })}
                  placeholder="Contoh: https://example.com/image.jpg"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Penerangan Ringkas</label>
                <input
                  type="text"
                  value={prodForm.shortDescription}
                  onChange={(e) => setProdForm({ ...prodForm, shortDescription: e.target.value })}
                  placeholder="Ringkasan ciri-ciri produk untuk katalog..."
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Penerangan Terperinci</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Masukkan penerangan format panjang, pautan sokongan, tutorial aktivasi, dll..."
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Kaedah Akses</label>
                <select
                  value={prodForm.accessType}
                  onChange={(e) => setProdForm({ ...prodForm, accessType: e.target.value as 'download_link' | 'license_key' | 'video_access' | 'service_request' | 'external_link' })}
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                >
                  <option value="download_link">Download Link / Cloud Folder</option>
                  <option value="license_key">Autoprovide License Key</option>
                  <option value="video_access">Video Learning Module</option>
                  <option value="service_request">Digital Custom Service</option>
                  <option value="external_link">External Store Link</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Nilai Akses (Pautan / Lesen Utama)</label>
                <input
                  type="text"
                  value={prodForm.accessValue}
                  onChange={(e) => setProdForm({ ...prodForm, accessValue: e.target.value })}
                  placeholder="Contoh: https://download.com/file atau activation_code"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Status Produk</label>
                <select
                  value={prodForm.status}
                  onChange={(e) => setProdForm({ ...prodForm, status: e.target.value as 'draft' | 'published' | 'archived' })}
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                >
                  <option value="published">Published (Paparan awam)</option>
                  <option value="draft">Draft (Draf / Tersembunyi)</option>
                  <option value="archived">Archived (Diarkibkan)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 border-t border-border-color pt-4 justify-end text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2.5 border border-border-color text-text-secondary rounded-xl hover:bg-border-color"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary-color hover:bg-primary-hover text-white rounded-xl shadow-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Category Add/Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
          
          <form onSubmit={handleCategorySubmit} className="relative w-full max-w-md bg-bg-secondary border border-border-color rounded-3xl shadow-2xl p-6 overflow-hidden z-10 space-y-4">
            <h3 className="font-extrabold text-base text-text-primary">
              {editingCategory ? 'Edit Maklumat Kategori' : 'Tambah Kategori Baru'}
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="Contoh: Video Editing Tools"
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[10px] text-text-secondary mb-1">Penerangan Ringkas</label>
                <textarea
                  rows={3}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Masukkan penerangan bagi menerangkan kandungan produk dalam kategori ini..."
                  className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 border-t border-border-color pt-4 justify-end text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2.5 border border-border-color text-text-secondary rounded-xl hover:bg-border-color"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary-color hover:bg-primary-hover text-white rounded-xl shadow-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Receipt Viewing Overlay */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedReceiptUrl(null)} />
          
          <div className="relative w-full max-w-lg bg-bg-secondary border border-border-color rounded-3xl shadow-2xl p-6 overflow-hidden z-10 flex flex-col items-center gap-4">
            <h4 className="font-extrabold text-sm text-text-primary self-start">Resit Transaksi Pembayaran</h4>
            
            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-black/40 border border-border-color rounded-2xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedReceiptUrl} alt="Resit Pembayaran Manual" className="max-w-full max-h-[60vh] object-contain rounded-lg" />
            </div>

            <button
              onClick={() => setSelectedReceiptUrl(null)}
              className="p-2.5 px-6 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs rounded-xl self-end transition-all shadow-md"
            >
              Tutup Paparan Resit
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
