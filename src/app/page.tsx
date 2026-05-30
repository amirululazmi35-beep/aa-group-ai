'use client';
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  PlayCircle, 
  Code, 
  User, 
  Settings, 
  Shield, 
  Plus, 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  Database, 
  MessageSquare, 
  Upload, 
  ExternalLink, 
  Lock, 
  RefreshCw, 
  Sliders, 
  DollarSign, 
  Users, 
  BookOpen, 
  Phone, 
  Mail, 
  ChevronRight, 
  Search, 
  Filter, 
  Info,
  Trash2,
  FileText
} from 'lucide-react';

// ==========================================
// MOCK INITIAL DATA & SETTINGS
// ==========================================

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'App Premium', slug: 'app-premium', description: 'Aplikasi AI premium siap guna untuk melonjakkan produktiviti.', is_active: true },
  { id: 'cat-2', name: 'Video Education AI', slug: 'video-education-ai', description: 'Kuasai teknik menjana karya, teks, dan visual digital.', is_active: true },
  { id: 'cat-3', name: 'Servis Digital', slug: 'servis-digital', description: 'Sistem automasi & pembangunan tersuai mengikut keperluan anda.', is_active: true }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'AA AI Copywriter Pro',
    slug: 'aa-ai-copywriter-pro',
    type: 'app',
    short_description: 'Penulisan iklan & konten media sosial automatik berkuasa tinggi.',
    description: 'Aplikasi web premium yang menjana copywriting jualan berasaskan formula terbukti (AIDA, PAS) dalam masa kurang 10 saat. Dilengkapi dengan modul analisis pasaran Malaysia.',
    price: 149,
    compare_price: 299,
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    access_type: 'license_key',
    access_value: 'LICENSE-AACWRITE-8891-XP41',
    features: ['Formula AIDA & PAS Bahasa Melayu', 'Sokongan 30+ Templat Iklan', 'Kemas Kini Percuma Setahun']
  },
  {
    id: 'prod-2',
    category_id: 'cat-2',
    name: 'Masterclass Midjourney v6 & Stable Diffusion',
    slug: 'masterclass-midjourney-stable-diffusion',
    type: 'video_course',
    short_description: 'Siri video tutorial menjana imej realistik gred komersial.',
    description: 'Kuasai teknik prompt engineering yang mendalam untuk menghasilkan imej seni digital, reka bentuk produk, dan visual pengiklanan menggunakan enjin kecerdasan buatan terkini.',
    price: 99,
    compare_price: 199,
    thumbnail_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    access_type: 'video_access',
    access_value: 'video-playlist-mj6',
    features: ['12 Siri Video HD Lengkap', 'Akses Seumur Hidup', 'Sertai Komuniti Discord Eksklusif'],
    videos: [
      { id: 'v1', title: 'Bab 1: Pengenalan Interface & Setup Server', duration: '12:40', is_preview: true, url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'v2', title: 'Bab 2: Formulasi Prompt Asas & Parameter Rahsia', duration: '18:15', is_preview: false, url: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'v3', title: 'Bab 3: Teknik Inpainting & Outpainting Terperinci', duration: '22:05', is_preview: false, url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'v4', title: 'Bab 4: Pengkomersialan Hasil Seni AI', duration: '15:30', is_preview: false, url: 'https://www.w3schools.com/html/movie.mp4' }
    ]
  },
  {
    id: 'prod-3',
    category_id: 'cat-3',
    name: 'Pembangunan AI Chatbot & Automasi WhatsApp',
    slug: 'ai-chatbot-whatsapp-automation',
    type: 'service',
    short_description: 'Sistem auto-reply pelanggan interaktif dengan integrasi OpenAI API.',
    description: 'Kami bina dan integrasikan chatbot pintar yang mampu menjawab soalan pelanggan, mengurus tempahan, dan menghantar notifikasi secara automatik 24/7.',
    price: 1299,
    compare_price: 2500,
    thumbnail_url: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    access_type: 'service_request',
    access_value: 'Panduan: Isikan borang ringkas selepas pembelian untuk sesi kick-off panggilan Zoom bersama jurutera kami.',
    features: ['Integrasi API WhatsApp & Telegram', 'Latihan Dataset Khusus Bisnes Anda', 'Jaminan Penyelenggaraan 3 Bulan']
  },
  {
    id: 'prod-4',
    category_id: 'cat-1',
    name: 'AA SEO Ranker - AI Content Suite',
    slug: 'aa-seo-ranker-content-suite',
    type: 'app',
    short_description: 'Sistem automasi artikel mesra SEO dengan analisis kata kunci.',
    description: 'Cipta berpuluh artikel blog berkualiti tinggi yang dioptimumkan untuk carian Google dalam masa singkat dengan bantuan data Google Trends langsung.',
    price: 189,
    compare_price: 350,
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    access_type: 'download_link',
    access_value: 'https://download.aa-ai-group.com/files/seo-suite-v2.zip',
    features: ['Analisis Kata Kunci Automatik', 'Sistem Pengeksportan Terus ke WordPress', 'Penjana Meta Description Berskala Besar']
  },
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Masterclass Bisnes Automasi Make.com & Zapier',
    slug: 'masterclass-automasi-make-zapier',
    type: 'video_course',
    short_description: 'Belajar membina sistem automasi tanpa kod untuk bisnes harian.',
    description: 'Ketahui cara menghubungkan ratusan aplikasi seperti Google Sheets, Gmail, Notion, WhatsApp, dan Stripe tanpa sebarang baris kod bagi menjimatkan masa operasi anda.',
    price: 79,
    compare_price: 149,
    thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    access_type: 'video_access',
    access_value: 'video-playlist-automation',
    features: ['8 Jam Sesi Kuliah Terperinci', 'Templat Aliran Kerja Siap Guna', 'Group Support Sembang Telegram'],
    videos: [
      { id: 'va1', title: 'Pengenalan: Apakah Kuasa Automasi Aliran Kerja?', duration: '15:20', is_preview: true, url: 'https://www.w3schools.com/html/movie.mp4' },
      { id: 'va2', title: 'Asas Make.com: Memahami Triggers, Actions & Routers', duration: '28:10', is_preview: false, url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'va3', title: 'Projek Praktikal: Sistem Lead Generation Automatik', duration: '35:45', is_preview: false, url: 'https://www.w3schools.com/html/movie.mp4' }
    ]
  }
];

const INITIAL_SETTINGS = {
  brand_name: 'AA AI GROUP',
  tagline: 'Pemecah Revolusi Digital Anda',
  logo_url: '',
  support_email: 'support@aa-ai-group.com',
  support_phone: '+6011-55543210',
  theme_color: 'violet', // default violet/indigo accent
  notice: '⚡ PROMO RAMADHAN: Diskaun sehingga 50% untuk semua Pembelajaran Video AI & Apps! Daftar akaun sekarang.'
};

export default function App() {
  // --- STATE SYSTEM ---
  const [activeTab, setActiveTab] = useState('home'); // home, catalog, my-dashboard, admin-dashboard
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  
  // Auth state
  const [user, setUser] = useState(null); // { id: 'usr-1', name: 'Ali bin Ahmad', email: 'ali@gmail.com', role: 'customer' } / 'admin'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login / register
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // Product filter
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product detail view modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Checkout flow state
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('manual_transfer'); // manual_transfer, bank_gateway
  const [paymentRef, setPaymentRef] = useState('');
  const [serviceRequirements, setServiceRequirements] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Interactive simulator orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1001',
      user_id: 'usr-1',
      user_name: 'Ali bin Ahmad',
      product_id: 'prod-1',
      product_name: 'AA AI Copywriter Pro',
      total_amount: 149,
      status: 'paid',
      payment_method: 'manual_transfer',
      payment_reference: 'REF-BANK-7789012',
      created_at: '2026-05-15 14:32'
    },
    {
      id: 'ORD-1002',
      user_id: 'usr-1',
      user_name: 'Ali bin Ahmad',
      product_id: 'prod-3',
      product_name: 'Pembangunan AI Chatbot & Automasi WhatsApp',
      total_amount: 1299,
      status: 'pending',
      payment_method: 'manual_transfer',
      payment_reference: 'REF-BANK-2210984',
      created_at: '2026-05-29 09:15',
      requirements: 'Saya perlukan chatbot WhatsApp untuk kedai kek saya bagi mengendalikan tempahan menu harian.'
    }
  ]);

  // Support Tickets State
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-201',
      user_id: 'usr-1',
      subject: 'Isu Pengaktifan Lesen Copywriter',
      message: 'Saya sudah menerima kod lesen tetapi ia memaparkan ralat "Expired". Mohon bantu.',
      status: 'replied',
      created_at: '2026-05-18 10:00',
      replies: [
        { sender: 'admin', message: 'Hi Ali, kami telah menetapkan semula (reset) token had lesen anda. Sila cuba masukkan kod lesen sekali lagi pada aplikasi.', time: '2026-05-18 14:00' }
      ]
    }
  ]);
  
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMsg, setNewTicketMsg] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Course Player State (For Customers)
  const [activeCoursePlaylist, setActiveCoursePlaylist] = useState(null); // product course
  const [activeVideo, setActiveVideo] = useState(null); // video lesson object
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Admin state additions
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('cat-1');
  const [newProdType, setNewProdType] = useState('app');
  const [newProdShortDesc, setNewProdShortDesc] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCompare, setNewProdCompare] = useState('');
  const [newProdAccessType, setNewProdAccessType] = useState('license_key');
  const [newProdAccessVal, setNewProdAccessVal] = useState('');
  const [newProdFeatures, setNewProdFeatures] = useState('');

  // Service Request Status Manager
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 'SRV-301',
      user_id: 'usr-1',
      product_id: 'prod-3',
      product_name: 'Pembangunan AI Chatbot & Automasi WhatsApp',
      order_id: 'ORD-1002',
      requirements: 'Saya perlukan chatbot WhatsApp untuk kedai kek saya bagi mengendalikan tempahan menu harian.',
      status: 'pending', // pending, in_progress, completed, cancelled
      admin_notes: 'Menunggu pengesahan resit pembayaran daripada admin.',
      created_at: '2026-05-29 09:15'
    }
  ]);

  // Temporary system logs for nice interactivity feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Quick setup authentication demo helper
  const handleQuickLogin = (role) => {
    if (role === 'customer') {
      setUser({
        id: 'usr-1',
        name: 'Ali bin Ahmad',
        email: 'ali@gmail.com',
        role: 'customer',
        phone: '+6012-3456789'
      });
      showToast('Log masuk sebagai pelanggan Ali bin Ahmad berjaya!', 'success');
    } else if (role === 'admin') {
      setUser({
        id: 'usr-admin',
        name: 'Dato Azman (AA AI Admin)',
        email: 'admin@aa-ai-group.com',
        role: 'admin'
      });
      showToast('Selamat Datang Dato Azman! Panel Admin AA AI GROUP diaktifkan.', 'info');
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    showToast('Anda telah log keluar sistem.', 'info');
  };

  // Simulate Custom User Authentication Signup
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authEmail) {
      showToast('Sila masukkan alamat emel.', 'error');
      return;
    }
    if (authMode === 'login') {
      // Allow any login for simplicity & testing ease
      const nameFromEmail = authEmail.split('@')[0];
      const isMockAdmin = authEmail.toLowerCase().includes('admin');
      
      setUser({
        id: isMockAdmin ? 'usr-admin' : 'usr-' + Date.now(),
        name: isMockAdmin ? 'Dato Azman (AA AI Admin)' : nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        email: authEmail,
        role: isMockAdmin ? 'admin' : 'customer'
      });
      showToast(`Log masuk berjaya! Sebagai ${isMockAdmin ? 'Admin' : 'Pelanggan'}`, 'success');
    } else {
      setUser({
        id: 'usr-' + Date.now(),
        name: authName || 'Pengguna Baharu',
        email: authEmail,
        role: 'customer'
      });
      showToast('Pendaftaran akaun baharu AA AI GROUP berjaya!', 'success');
    }
    setShowAuthModal(false);
    // reset form
    setAuthEmail('');
    setAuthName('');
    setAuthPassword('');
  };

  // Handling checkout process (simulation)
  const triggerCheckout = (product) => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      showToast('Sila daftar atau log masuk untuk meneruskan pembelian.', 'info');
      return;
    }
    setCheckoutProduct(product);
    setServiceRequirements('');
    setPaymentRef('');
    setIsCheckingOut(true);
  };

  const submitOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === 'manual_transfer' && !paymentRef) {
      showToast('Sila masukkan rujukan transaksi/nombor rujukan bank.', 'error');
      return;
    }

    const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 19).replace('T', ' ').slice(0, 16);

    const newOrder = {
      id: newOrderId,
      user_id: user.id,
      user_name: user.name,
      product_id: checkoutProduct.id,
      product_name: checkoutProduct.name,
      total_amount: checkoutProduct.price,
      status: paymentMethod === 'bank_gateway' ? 'paid' : 'pending',
      payment_method: paymentMethod,
      payment_reference: paymentRef || 'SYS-ONLINE-' + Math.floor(Math.random() * 1000000),
      created_at: dateStr,
      requirements: checkoutProduct.type === 'service' ? serviceRequirements : undefined
    };

    // Add Order
    setOrders([newOrder, ...orders]);

    // If product is digital service, create a service request record
    if (checkoutProduct.type === 'service') {
      const newServiceReq = {
        id: 'SRV-' + Math.floor(300 + Math.random() * 700),
        user_id: user.id,
        product_id: checkoutProduct.id,
        product_name: checkoutProduct.name,
        order_id: newOrderId,
        requirements: serviceRequirements || 'Tiada spesifikasi khusus diletakkan.',
        status: newOrder.status === 'paid' ? 'pending' : 'pending',
        admin_notes: newOrder.status === 'paid' ? 'Pembayaran disahkan. Menunggu tindakan jurutera.' : 'Menunggu pembayaran disahkan oleh pihak pengurusan.',
        created_at: dateStr
      };
      setServiceRequests([newServiceReq, ...serviceRequests]);
    }

    // Auto-grant digital access if paid instantly (Gateway payment simulated)
    showToast(
      paymentMethod === 'bank_gateway' 
        ? 'Pembayaran FPX Berjaya! Akses produk telah diaktifkan di Dashboard anda.' 
        : 'Pesanan berjaya dihantar! Sila tunggu admin mengesahkan resit pembayaran anda.',
      'success'
    );

    setIsCheckingOut(false);
    setSelectedProduct(null);
    setActiveTab('my-dashboard'); // Redirect to dashboard to see results
  };

  // Support Ticket Form Submit
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMsg) {
      showToast('Sila isi semua ruangan tiket.', 'error');
      return;
    }

    const dateStr = new Date().toISOString().slice(0, 19).replace('T', ' ').slice(0, 16);
    const newTck = {
      id: 'TCK-' + Math.floor(200 + Math.random() * 800),
      user_id: user.id,
      subject: newTicketSubject,
      message: newTicketMsg,
      status: 'open',
      created_at: dateStr,
      replies: []
    };

    setTickets([newTck, ...tickets]);
    setNewTicketSubject('');
    setNewTicketMsg('');
    showToast('Tiket sokongan berjaya dihantar. Admin akan membalas segera.', 'success');
  };

  // Admin: Approve manual order
  const handleApproveOrder = (orderId) => {
    // update order status
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'paid' };
      }
      return ord;
    });
    setOrders(updatedOrders);

    // Update corresponding service request notes if it exists
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedSrv = serviceRequests.map(srv => {
        if (srv.order_id === orderId) {
          return { ...srv, admin_notes: 'Pembayaran disahkan. Sesi kick-off dijadualkan.' };
        }
        return srv;
      });
      setServiceRequests(updatedSrv);
      showToast(`Pesanan ${orderId} telah diluluskan. Akses digital dibuka secara automatik!`, 'success');
    }
  };

  // Admin: Cancel/Reject order
  const handleCancelOrder = (orderId) => {
    setOrders(orders.map(ord => ord.id === orderId ? { ...ord, status: 'cancelled' } : ord));
    showToast(`Pesanan ${orderId} telah dibatalkan.`, 'info');
  };

  // Admin: Update service progress
  const handleUpdateServiceStatus = (srvId, newStatus) => {
    setServiceRequests(serviceRequests.map(srv => {
      if (srv.id === srvId) {
        let note = '';
        if (newStatus === 'in_progress') note = 'Pasukan teknikal sedang membangunkan integrasi sistem.';
        if (newStatus === 'completed') note = 'Projek telah siap sepenuhnya & diserahkan kepada klien.';
        if (newStatus === 'cancelled') note = 'Projek ini dibatalkan.';
        return { ...srv, status: newStatus, admin_notes: note };
      }
      return srv;
    }));
    showToast(`Status servis ${srvId} dikemaskini kepada: ${newStatus}`, 'success');
  };

  // Admin: Reply to ticket
  const handleAdminReply = (ticketId) => {
    if (!adminReplyText.trim()) return;

    setTickets(tickets.map(tck => {
      if (tck.id === ticketId) {
        return {
          ...tck,
          status: 'replied',
          replies: [...tck.replies, { sender: 'admin', message: adminReplyText, time: 'Baru sahaja' }]
        };
      }
      return tck;
    }));
    setAdminReplyText('');
    showToast('Balasan sokongan telah dihantar kepada pelanggan.', 'success');
  };

  // Admin: Create/Edit Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Sila masukkan nama dan harga produk.', 'error');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    const comparePriceNum = newProdCompare ? parseFloat(newProdCompare) : null;
    const featsArray = newProdFeatures ? newProdFeatures.split(',').map(f => f.trim()) : [];

    if (editingProduct) {
      // Edit
      setProducts(products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: newProdName,
            category_id: newProdCategory,
            type: newProdType,
            short_description: newProdShortDesc,
            description: newProdDesc,
            price: priceNum,
            compare_price: comparePriceNum,
            access_type: newProdAccessType,
            access_value: newProdAccessVal,
            features: featsArray
          };
        }
        return p;
      }));
      showToast('Produk berjaya dikemaskini!', 'success');
    } else {
      // Add New
      const newId = 'prod-' + Date.now();
      const newP = {
        id: newId,
        category_id: newProdCategory,
        name: newProdName,
        slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: newProdType,
        short_description: newProdShortDesc,
        description: newProdDesc,
        price: priceNum,
        compare_price: comparePriceNum,
        thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        status: 'published',
        access_type: newProdAccessType,
        access_value: newProdAccessVal,
        features: featsArray,
        videos: newProdType === 'video_course' ? [
          { id: 'v-new-1', title: 'Bab 1: Pengenalan Modul Pembelajaran', duration: '10:00', is_preview: true, url: 'https://www.w3schools.com/html/movie.mp4' }
        ] : []
      };
      setProducts([...products, newP]);
      showToast('Produk baharu berjaya diterbitkan!', 'success');
    }

    // Reset Form
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setNewProdName('');
    setNewProdCategory('cat-1');
    setNewProdType('app');
    setNewProdShortDesc('');
    setNewProdDesc('');
    setNewProdPrice('');
    setNewProdCompare('');
    setNewProdAccessType('license_key');
    setNewProdAccessVal('');
    setNewProdFeatures('');
  };

  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdCategory(prod.category_id);
    setNewProdType(prod.type);
    setNewProdShortDesc(prod.short_description);
    setNewProdDesc(prod.description);
    setNewProdPrice(prod.price.toString());
    setNewProdCompare(prod.compare_price ? prod.compare_price.toString() : '');
    setNewProdAccessType(prod.access_type);
    setNewProdAccessVal(prod.access_value);
    setNewProdFeatures(prod.features ? prod.features.join(', ') : '');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Produk berjaya dipadam dari sistem.', 'info');
  };

  // Video Playing triggers
  const handleOpenCourse = (product) => {
    if (product.videos && product.videos.length > 0) {
      setActiveCoursePlaylist(product);
      setActiveVideo(product.videos[0]);
      setIsVideoPlaying(true);
    } else {
      showToast('Siri kursus ini belum mempunyai modul video.', 'info');
    }
  };

  // Filtration logic for Catalog
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'semua' || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Derived user statistics for client and admin dashboard
  const userOrders = user ? orders.filter(o => o.user_id === user.id) : [];
  const userAccessList = user ? orders.filter(o => o.user_id === user.id && o.status === 'paid') : [];
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.total_amount, 0);

  // ==========================================
  // SUB-RENDER SECTIONS DEFINITIONS
  // ==========================================

  const renderLandingPage = () => {
    return (
      <div className="relative overflow-hidden">
        
        {/* HERO BG GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-violet-900/15 via-indigo-950/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
          
          {/* HERO HEADER */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-950/80 border border-violet-800/60 px-4 py-1.5 rounded-full text-violet-300 text-xs font-semibold tracking-wide animate-pulse">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Peneraju Platform AI & Digital Hub
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none">
              Kuasai Dunia Digital Bersama <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {settings.brand_name}
              </span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Gabungan aplikasi premium premium, program video latihan AI eksklusif, serta servis sistem automasi pintar terbaik khas untuk mempercepatkan pertumbuhan perniagaan anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => { setActiveTab('catalog'); setSelectedCategory('semua'); }}
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-violet-600/30 hover:shadow-violet-600/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-base"
              >
                Teroka Katalog Produk
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {!user && (
                <button
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-semibold px-8 py-4 rounded-2xl transition-all hover:border-slate-700 text-base"
                >
                  Daftar Akaun Percuma
                </button>
              )}
            </div>
          </div>

          {/* STATS PRESTASI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-20 p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-900/60 backdrop-blur-sm text-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">5,000+</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Pengguna Aktif</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">15+</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Sistem AI & Apps</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">120+</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Modul Pembelajaran</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">99.8%</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Kepuasan Klien</p>
            </div>
          </div>

          {/* THREE CATEGORY FOCUS PANELS */}
          <div className="mt-28 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-4xl font-extrabold">Kepakaran Digital Utama Kami</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
                Tiga tiang utama AA AI GROUP untuk membantu usahawan, pelajar, dan pencipta kandungan mara ke hadapan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Category 1: App Premium */}
              <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-violet-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-800/40 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">App Premium AI</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Akses terus ke aplikasi web pintar khas seperti AI Copywriter, SEO Suite, dan alat automasi sosial yang siap sedia digunakan.
                </p>
                <button 
                  onClick={() => { setActiveTab('catalog'); setSelectedCategory('cat-1'); }}
                  className="text-xs font-bold text-violet-400 flex items-center gap-1.5 hover:text-violet-300"
                >
                  Teroka Aplikasi
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Category 2: Video Education */}
              <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Video Education AI</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Kuasai seni reka grafik AI, teknik prompt komersial, dan bina sistem tanpa kod menggunakan silibus video berkualiti tinggi kami.
                </p>
                <button 
                  onClick={() => { setActiveTab('catalog'); setSelectedCategory('cat-2'); }}
                  className="text-xs font-bold text-purple-400 flex items-center gap-1.5 hover:text-purple-300"
                >
                  Lihat Silibus Video
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Category 3: Custom Services */}
              <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-900 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Servis Digital Khas</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Sesi konsultasi & pembinaan sistem tersuai seperti Automasi API, Integrasi Chatbot Bisnes, dan Pembangunan AI E-Dagang.
                </p>
                <button 
                  onClick={() => { setActiveTab('catalog'); setSelectedCategory('cat-3'); }}
                  className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 hover:text-indigo-300"
                >
                  Bincang Projek
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* SHOWCASE OF PRODUCTS (HIGHLIGHT SECTION) */}
          <div className="mt-32 space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white">Produk Hangat & Popular</h2>
                <p className="text-slate-400 text-sm mt-2">Dapatkan akses premium sekarang dengan harga promosi masa terhad.</p>
              </div>
              <button 
                onClick={() => { setActiveTab('catalog'); setSelectedCategory('semua'); }}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl bg-slate-900/50"
              >
                Lihat Semua Katalog ({products.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map(prod => (
                <div 
                  key={prod.id} 
                  className="bg-slate-900/50 border border-slate-900 rounded-3xl overflow-hidden hover:border-slate-800 transition-all flex flex-col group h-full cursor-pointer"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img 
                      src={prod.thumbnail_url} 
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] uppercase tracking-wider text-violet-400 border border-violet-900/30 px-3 py-1 rounded-full font-bold">
                      {categories.find(c => c.id === prod.category_id)?.name || 'Digital'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{prod.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{prod.short_description}</p>
                    
                    <div className="pt-2 flex items-baseline gap-2 mt-auto">
                      <span className="text-xl font-extrabold text-white">RM {prod.price}</span>
                      {prod.compare_price && (
                        <span className="text-xs line-through text-slate-500">RM {prod.compare_price}</span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        Akses Segera
                      </span>
                      <span className="text-violet-400 font-bold group-hover:underline flex items-center gap-1">
                        Lihat Info
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TESTIMONIAL CLIENTS SECTION */}
          <div className="mt-32 space-y-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold">Maklum Balas Pelanggan Kami</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">Kami komited memberikan mutu produk & servis terbaik di Malaysia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 space-y-4 text-xs md:text-sm">
                <p className="text-slate-300 italic">
                  "AA AI Copywriter Pro menjimatkan kos iklan FB ads kami hampir 60%! Konten yang dijana sangat lokal, bahasa melayu santai dan natural."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white">F</div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Fariq Daniel</h4>
                    <p className="text-slate-500 text-[10px]">E-Commerce Specialist</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 space-y-4 text-xs md:text-sm">
                <p className="text-slate-300 italic">
                  "Tutorial Midjourney dalam siri modul pendidikan video sangat senang difahami. Dari tak tahu apa-apa, sekarang saya dah boleh buat servis grafik game digital."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">N</div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Nur Afiqah</h4>
                    <p className="text-slate-500 text-[10px]">Freelance Designer</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-900 space-y-4 text-xs md:text-sm">
                <p className="text-slate-300 italic">
                  "Automasi Chatbot WhatsApp yang mereka pasang di kedai online kami berfungsi cemerlang. Tiada lagi terlepas mesej prospek walaupun pada jam 3 pagi."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">R</div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Razali Ibrahim</h4>
                    <p className="text-slate-500 text-[10px]">Pemilik Bakeri Raz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderCatalogPage = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Katalog Digital</h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">Dapatkan siri aplikasi premium, video pembelajaran, dan servis tersuai.</p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
          
          {/* Category buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('semua')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'semua' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Semua ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Carian produk atau servis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid of Filtered Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(prod => {
              const cat = categories.find(c => c.id === prod.category_id);
              return (
                <div 
                  key={prod.id}
                  className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden hover:border-slate-800/80 hover:bg-slate-900/50 transition-all flex flex-col group h-full cursor-pointer"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img 
                      src={prod.thumbnail_url} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-[9px] uppercase tracking-wider text-violet-400 border border-violet-900/30 px-2.5 py-1 rounded-full font-bold">
                      {cat?.name || 'Digital'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{prod.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{prod.short_description}</p>
                      
                      {/* Mini feature chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {prod.features?.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="bg-slate-950/80 text-[10px] text-slate-400 px-2.5 py-0.5 rounded-md border border-slate-900">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-900/60 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-white">RM {prod.price}</span>
                        {prod.compare_price && (
                          <span className="text-xs line-through text-slate-600">RM {prod.compare_price}</span>
                        )}
                      </div>
                      
                      <button className="bg-slate-900 hover:bg-slate-800 text-violet-400 border border-slate-800 text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-violet-600 group-hover:text-white group-hover:border-transparent transition-all">
                        Lihat Penuh
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 rounded-3xl border border-slate-900/50 space-y-4">
            <Info className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Tiada Produk Ditemui</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Cuba gunakan kata kunci carian yang lain atau ubah penapis kategori di atas.</p>
            <button 
              onClick={() => { setSelectedCategory('semua'); setSearchQuery(''); }}
              className="bg-slate-900 border border-slate-800 text-xs px-4 py-2 rounded-xl text-slate-300"
            >
              Padam Penapis
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCustomerDashboard = () => {
    if (!user) {
      return (
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-violet-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Akses Dihalang</h2>
          <p className="text-slate-400 text-sm">
            Sila log masuk ke dalam akaun AA AI GROUP anda terlebih dahulu untuk membuka paparan dashboard, mengakses produk yang dibeli, menyemak servis, atau membuka tiket sokongan.
          </p>
          <button
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-violet-600/20 text-xs"
          >
            Log Masuk Sekarang
          </button>
        </div>
      );
    }

    // Filter database lists by current user
    const customerOrders = orders.filter(o => o.user_id === user.id);
    const customerPaidOrders = customerOrders.filter(o => o.status === 'paid');
    const customerServices = serviceRequests.filter(s => s.user_id === user.id);
    const customerTickets = tickets.filter(t => t.user_id === user.id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Dashboard Header */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">Portal Pengguna</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Selamat Datang, {user.name}</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Uruskan pembelian, siri pembelajaran video AI, servis automasi, dan khidmat pelanggan anda di sini.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 px-4 py-2 rounded-xl text-center border border-slate-800">
              <span className="text-xs text-slate-400 block">Jumlah Order</span>
              <span className="text-lg font-bold text-white">{customerOrders.length}</span>
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-xl text-center border border-slate-800">
              <span className="text-xs text-slate-400 block">Produk Aktif</span>
              <span className="text-lg font-bold text-emerald-400">{customerPaidOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: My Premium Apps & Purchased Videos */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. MY PRODUCTS (Apps & Courses) */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-violet-400" />
                Produk & Digital Akses Saya ({customerPaidOrders.length})
              </h2>

              {customerPaidOrders.length > 0 ? (
                <div className="space-y-4">
                  {customerPaidOrders.map(ord => {
                    const product = products.find(p => p.id === ord.product_id);
                    if (!product) return null;
                    
                    return (
                      <div key={ord.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-880 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 px-2 py-0.5 rounded bg-slate-950 border border-violet-900/30">
                            {product.type === 'app' ? 'App Premium' : product.type === 'video_course' ? 'Video Latihan' : 'Servis Digital'}
                          </span>
                          <h3 className="text-base font-bold text-white pt-1">{product.name}</h3>
                          <p className="text-xs text-slate-400">Pembelian ID: {ord.id} • Status: <span className="text-emerald-400 font-bold">Aktif</span></p>
                        </div>

                        {/* Dynamic Access Buttons */}
                        <div className="w-full sm:w-auto pt-2 sm:pt-0">
                          {product.access_type === 'download_link' && (
                            <a 
                              href={product.access_value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={() => showToast('Memulakan muat turun file...', 'info')}
                              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5 rotate-180" />
                              Muat Turun File
                            </a>
                          )}

                          {product.access_type === 'license_key' && (
                            <div className="space-y-1.5 text-right w-full font-sans">
                              <span className="text-[10px] text-slate-500 block">Kunci Lesen Anda:</span>
                              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                <code className="text-xs font-mono text-emerald-400">{product.access_value}</code>
                                <button 
                                  onClick={() => {
                                    // Clipboard API safe fallback
                                    try {
                                      navigator.clipboard.writeText(product.access_value);
                                    } catch (err) {
                                      const el = document.createElement('textarea');
                                      el.value = product.access_value;
                                      document.body.appendChild(el);
                                      el.select();
                                      document.execCommand('copy');
                                      document.body.removeChild(el);
                                    }
                                    showToast('Kod lesen berjaya disalin!', 'success');
                                  }}
                                  className="text-slate-400 hover:text-white"
                                  title="Salin Kod"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {product.access_type === 'video_access' && (
                            <button 
                              onClick={() => handleOpenCourse(product)}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Tonton Video Sila
                            </button>
                          )}

                          {product.access_type === 'service_request' && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                              Rujuk Status Servis
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-900/10 rounded-2xl border border-slate-900 border-dashed space-y-3">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-xs">Anda belum membeli sebarang aplikasi premium atau video pendidikan.</p>
                  <button 
                    onClick={() => { setActiveTab('catalog'); setSelectedCategory('semua'); }} 
                    className="text-xs text-violet-400 font-bold hover:underline"
                  >
                    Teroka Katalog Pertama Anda &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* VIDEO LEARNING PLAYER COMPONENT CONTAINER */}
            {activeCoursePlaylist && isVideoPlaying && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
                
                {/* Header player */}
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-violet-400 font-bold uppercase">Siri Video Pembelajaran</span>
                    <h3 className="text-sm font-bold text-white">{activeCoursePlaylist.name}</h3>
                  </div>
                  <button 
                    onClick={() => setIsVideoPlaying(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulator screen container */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  {activeVideo ? (
                    <>
                      <video 
                        src={activeVideo.url} 
                        controls 
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] text-slate-300 font-medium border border-slate-800">
                        Sedang Dimainkan: {activeVideo.title}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs">Pilih bab video di bawah untuk memulakan pembelajaran.</p>
                  )}
                </div>

                {/* Playlist lessons selector */}
                <div className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modul & Senarai Bab:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeCoursePlaylist.videos?.map(vid => (
                      <button
                        key={vid.id}
                        onClick={() => setActiveVideo(vid)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                          activeVideo?.id === vid.id 
                            ? 'bg-violet-950/50 border-violet-500 text-white font-semibold' 
                            : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="truncate">{vid.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{vid.duration} mins</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MY SERVICES REQUEST STATUS TRACKER */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Progres Servis Digital Saya ({customerServices.length})
              </h2>

              {customerServices.length > 0 ? (
                <div className="space-y-6">
                  {customerServices.map(srv => {
                    const steps = ['pending', 'in_progress', 'completed'];
                    const currentStepIndex = steps.indexOf(srv.status);
                    
                    return (
                      <div key={srv.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                        
                        {/* Service Header Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                          <div>
                            <span className="text-[10px] text-slate-500">Khas untuk Servis Pembinaan</span>
                            <h3 className="text-sm font-bold text-white">{srv.product_name}</h3>
                            <p className="text-[10px] text-slate-500">ID Servis: {srv.id} • Order ID: {srv.order_id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            srv.status === 'completed' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400' :
                            srv.status === 'in_progress' ? 'bg-amber-950/80 border border-amber-800 text-amber-400' :
                            'bg-slate-950/80 border border-slate-800 text-slate-400'
                          }`}>
                            {srv.status === 'completed' ? 'Selesai' : srv.status === 'in_progress' ? 'Dalam Proses' : 'Tertunda'}
                          </span>
                        </div>

                        {/* Requirements box */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                          <span className="text-slate-500 block font-semibold mb-1">Keperluan Anda:</span>
                          <p className="text-slate-300 italic">"{srv.requirements}"</p>
                        </div>

                        {/* Progress Visual Tracker */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-semibold text-slate-500 block">Langkah Pelaksanaan Projek:</span>
                          <div className="grid grid-cols-3 gap-2 relative">
                            
                            <div className={`p-3 rounded-xl border text-center text-xs space-y-1 ${
                              currentStepIndex >= 0 ? 'bg-violet-950/20 border-violet-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="font-bold">1. Pesanan Diterima</span>
                              <span className="text-[9px] block text-slate-400">Peringkat Permulaan</span>
                            </div>

                            <div className={`p-3 rounded-xl border text-center text-xs space-y-1 ${
                              currentStepIndex >= 1 ? 'bg-indigo-950/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="font-bold">2. Dalam Proses</span>
                              <span className="text-[9px] block text-slate-400">Jurutera Sedang Pasang</span>
                            </div>

                            <div className={`p-3 rounded-xl border text-center text-xs space-y-1 ${
                              currentStepIndex >= 2 ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-900 text-slate-500'
                            }`}>
                              <span className="font-bold">3. Selesai & Serah</span>
                              <span className="text-[9px] block text-slate-400">Sistem Sedia Guna</span>
                            </div>

                          </div>
                        </div>

                        {/* Admin Notes update */}
                        {srv.admin_notes && (
                          <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30 text-xs flex gap-2">
                            <span className="font-bold text-indigo-400">Ulasan Pengurus:</span>
                            <p className="text-slate-300">{srv.admin_notes}</p>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">Tiada rekod tempahan servis dikesan buat masa ini.</p>
              )}
            </div>

          </div>

          {/* Right Column: Support & Helpdesk Tickets */}
          <div className="space-y-8">
            
            {/* ACCOUNT PROFILE DETAILS */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Informasi Akaun</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">Nama Pelanggan</span>
                  <span className="text-slate-300 font-semibold">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">Alamat Emel</span>
                  <span className="text-slate-300 font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Telefon Support</span>
                  <span className="text-slate-300">{user.phone || 'Tiada'}</span>
                </div>
              </div>
            </div>

            {/* 3. HELP CENTER & TICKETS */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Pusat Aduan & Tiket ({customerTickets.length})
              </h2>

              {/* Create ticket form */}
              <form onSubmit={handleCreateTicket} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                <span className="text-xs font-bold text-slate-300 block">Buka Tiket Baru:</span>
                <div>
                  <input 
                    type="text" 
                    placeholder="Tajuk Isu (Contoh: Fail Download Corrupt)"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <textarea 
                    rows={3}
                    placeholder="Huraikan masalah terperinci atau sertakan order ID anda..."
                    value={newTicketMsg}
                    onChange={(e) => setNewTicketMsg(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 rounded-xl transition-all"
                >
                  Hantar Tiket Sokongan
                </button>
              </form>

              {/* Tickets list */}
              {customerTickets.length > 0 ? (
                <div className="space-y-3">
                  {customerTickets.map(tck => (
                    <div 
                      key={tck.id} 
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 cursor-pointer hover:border-slate-700 transition-all text-xs"
                      onClick={() => setActiveTicket(tck)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500">{tck.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                          tck.status === 'replied' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-amber-950/80 text-amber-400'
                        }`}>
                          {tck.status === 'replied' ? 'Dibalas' : 'Dihantar'}
                        </span>
                      </div>
                      <h4 className="font-bold text-white truncate">{tck.subject}</h4>
                      <p className="text-slate-400 line-clamp-1">{tck.message}</p>
                      <span className="text-[9px] text-slate-500 block">{tck.created_at}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">Tiada tiket sokongan dibuka.</p>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    if (!user || user.role !== 'admin') {
      return (
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-red-400">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Akses Admin Sahaja</h2>
          <p className="text-slate-400 text-sm">
            Sila log masuk menggunakan emel admin rasmi **admin@aa-ai-group.com** untuk memasuki dashboard pengurusan ini.
          </p>
          <button
            onClick={() => handleQuickLogin('admin')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 text-xs"
          >
            Log Masuk Cepat Sebagai Admin
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header Admin */}
        <div className="bg-indigo-950/40 p-6 md:p-8 rounded-3xl border border-indigo-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Sistem Admin Utama • AA AI GROUP
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Sistem Konsol Pengurus</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">Urus senarai produk, sahkan pesanan bank, pantau kemajuan servis, dan balas tiket sokongan.</p>
          </div>

          {/* Admin switch tabs */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleQuickLogin('customer')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-semibold transition-all"
            >
              Uji Paparan Pelanggan Ali
            </button>
          </div>
        </div>

        {/* KEY BUSINESS STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-800/40 flex items-center justify-center text-violet-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Jumlah Hasil Kasar</span>
              <span className="text-xl font-extrabold text-white">RM {totalRevenue}</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Jumlah Pesanan</span>
              <span className="text-xl font-extrabold text-white">{orders.length}</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Servis Aktif</span>
              <span className="text-xl font-extrabold text-white">
                {serviceRequests.filter(s => s.status !== 'completed' && s.status !== 'cancelled').length}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Tiket Terbuka</span>
              <span className="text-xl font-extrabold text-white">
                {tickets.filter(t => t.status === 'open').length}
              </span>
            </div>
          </div>

        </div>

        {/* TAB SYSTEM IN ADMIN PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Span): Orders Approval & Service Requests */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. ORDER & RECEIPT APPROVAL SECTION */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  Urus & Sahkan Pesanan Pelanggan ({orders.length})
                </h2>
                <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-slate-400">
                  Manual Bank & FPX Gateway
                </span>
              </div>

              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30 font-bold">{ord.id}</span>
                        <h3 className="text-sm font-bold text-white pt-1">{ord.product_name}</h3>
                        <p className="text-xs text-slate-400">Oleh: <span className="text-slate-300 font-semibold">{ord.user_name}</span> • Tarikh: {ord.created_at}</p>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'paid' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                        ord.status === 'pending' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                        'bg-red-950/80 text-red-400 border border-red-800'
                      }`}>
                        {ord.status === 'paid' ? 'Telah Dibayar' : ord.status === 'pending' ? 'Menunggu Kelulusan' : 'Dibatalkan'}
                      </span>
                    </div>

                    {/* Payment reference info */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap gap-x-6 gap-y-2">
                      <div>
                        <span className="text-slate-500 block">Kaedah Bayaran:</span>
                        <span className="text-slate-300 font-semibold uppercase">{ord.payment_method.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Nombor Rujukan Resit Bank:</span>
                        <span className="text-emerald-400 font-mono font-bold">{ord.payment_reference}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Jumlah Amaun:</span>
                        <span className="text-white font-extrabold">RM {ord.total_amount}</span>
                      </div>
                    </div>

                    {/* Customer uploaded Requirements (If Service product) */}
                    {ord.requirements && (
                      <div className="bg-indigo-950/10 p-3 rounded-xl border border-indigo-950 text-xs">
                        <span className="text-indigo-400 font-bold block mb-1">Keperluan Servis Dari Klien:</span>
                        <p className="text-slate-300 italic">"{ord.requirements}"</p>
                      </div>
                    )}

                    {/* Action controllers for manually approving */}
                    {ord.status === 'pending' && (
                      <div className="flex gap-2 pt-2 justify-end">
                        <button
                          onClick={() => handleCancelOrder(ord.id)}
                          className="px-3 py-1.5 bg-slate-950 hover:bg-red-950/30 text-red-400 border border-slate-800 text-xs font-semibold rounded-lg"
                        >
                          Tolak Order
                        </button>
                        <button
                          onClick={() => handleApproveOrder(ord.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Sahkan Resit & Buka Akses
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SERVICES STATUS PROGRESS WORKSPACE */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
                <Sliders className="w-5 h-5 text-violet-400" />
                Borang Permintaan & Progres Kerja Servis ({serviceRequests.length})
              </h2>

              <div className="space-y-4">
                {serviceRequests.map(srv => (
                  <div key={srv.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{srv.id}</span>
                        <h3 className="text-sm font-bold text-white">{srv.product_name}</h3>
                        <p className="text-[10px] text-slate-400">Order ID: {srv.order_id} • Pelanggan ID: {srv.user_id}</p>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                        <button 
                          onClick={() => handleUpdateServiceStatus(srv.id, 'pending')}
                          className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                            srv.status === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-500'
                          }`}
                        >
                          Pending
                        </button>
                        <button 
                          onClick={() => handleUpdateServiceStatus(srv.id, 'in_progress')}
                          className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                            srv.status === 'in_progress' ? 'bg-amber-600 text-white shadow' : 'text-slate-500'
                          }`}
                        >
                          Progress
                        </button>
                        <button 
                          onClick={() => handleUpdateServiceStatus(srv.id, 'completed')}
                          className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                            srv.status === 'completed' ? 'bg-emerald-600 text-white shadow' : 'text-slate-500'
                          }`}
                        >
                          Selesai
                        </button>
                      </div>
                    </div>

                    {/* Customer specifications */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-500 block font-semibold mb-1">Keperluan Projek (Input Pengguna):</span>
                      <p className="text-slate-300 italic">"{srv.requirements}"</p>
                    </div>

                    {/* Admin Internal notes updater */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Nota Kemas Kini Admin (Akan Dilihat Pelanggan):</label>
                      <input 
                        type="text" 
                        value={srv.admin_notes} 
                        onChange={(e) => {
                          const updatedNote = e.target.value;
                          setServiceRequests(serviceRequests.map(s => s.id === srv.id ? { ...s, admin_notes: updatedNote } : s));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                        placeholder="Contoh: Kami sedang memulakan konfigurasi server API..."
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Add/Edit Product & System Branding Customization */}
          <div className="space-y-8">
            
            {/* 3. ADD / EDIT PRODUCT FORM */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
                <Plus className="w-5 h-5 text-emerald-400" />
                {editingProduct ? 'Kemas Kini Produk' : 'Tambah Produk Baharu'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Nama Produk:</label>
                  <input 
                    type="text" 
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500"
                    placeholder="Contoh: AA SEO Suite V2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Kategori:</label>
                    <select 
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Jenis Produk:</label>
                    <select 
                      value={newProdType}
                      onChange={(e) => setNewProdType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                    >
                      <option value="app">App Premium</option>
                      <option value="video_course">Video Latihan</option>
                      <option value="service">Servis Digital</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Harga Jualan (RM):</label>
                    <input 
                      type="number" 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                      placeholder="RM 149"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Harga Asal (Rujukan):</label>
                    <input 
                      type="number" 
                      value={newProdCompare}
                      onChange={(e) => setNewProdCompare(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                      placeholder="RM 299"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Penerangan Ringkas:</label>
                  <input 
                    type="text" 
                    value={newProdShortDesc}
                    onChange={(e) => setNewProdShortDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    placeholder="Penerangan 1 baris untuk katalog..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Penerangan Penuh:</label>
                  <textarea 
                    rows={3}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    placeholder="Tuliskan spesifikasi produk, keunikan, dan apa yang pembeli terima..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Jenis Akses:</label>
                    <select 
                      value={newProdAccessType}
                      onChange={(e) => setNewProdAccessType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="download_link">Pautan Download</option>
                      <option value="license_key">Kod Lesen</option>
                      <option value="video_access">Akses Modul Video</option>
                      <option value="service_request">Borang Tempah Servis</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Nilai/Pautan Akses:</label>
                    <input 
                      type="text" 
                      value={newProdAccessVal}
                      onChange={(e) => setNewProdAccessVal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                      placeholder="Sertakan link fail / kunci lesen lalai..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Faedah Produk (Pisahkan dengan koma):</label>
                  <input 
                    type="text" 
                    value={newProdFeatures}
                    onChange={(e) => setNewProdFeatures(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    placeholder="Faedah 1, Faedah 2, Faedah 3"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingProduct && (
                    <button 
                      type="button" 
                      onClick={resetProductForm}
                      className="w-1/2 bg-slate-900 border border-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Batal
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className={`py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg ${
                      editingProduct ? 'w-1/2 bg-indigo-600' : 'w-full bg-emerald-600'
                    }`}
                  >
                    {editingProduct ? 'Simpan Kemas Kini' : 'Daftar & Terbit Produk'}
                  </button>
                </div>

              </form>
            </div>

            {/* 4. PRODUCT LIST (QUICK ACTIONS) */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Katalog Produk Semasa ({products.length})</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-none">
                {products.map(p => (
                  <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-between text-xs gap-3">
                    <div className="truncate">
                      <h4 className="font-bold text-slate-200 truncate">{p.name}</h4>
                      <span className="text-[10px] text-slate-500">RM {p.price} • {p.type}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="bg-slate-950 border border-slate-800 hover:text-indigo-400 p-1.5 rounded-lg"
                        title="Edit"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="bg-slate-950 border border-slate-800 hover:text-red-400 p-1.5 rounded-lg"
                        title="Padam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. BRANDING SETTINGS CONFIGURATOR */}
            <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Tetapan Identiti Jenama
              </h2>

              <div className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Nama Platform Rasmi:</label>
                  <input 
                    type="text" 
                    value={settings.brand_name}
                    onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Mesej Promosi Banner:</label>
                  <input 
                    type="text" 
                    value={settings.notice}
                    onChange={(e) => setSettings({ ...settings, notice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Emel Sokongan:</label>
                    <input 
                      type="email" 
                      value={settings.support_email}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Telefon WhatsApp:</label>
                    <input 
                      type="text" 
                      value={settings.support_phone}
                      onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => showToast('Tetapan konfigurasi jenama berjaya disimpan.', 'success')}
                  className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 py-2.5 rounded-xl font-bold text-xs"
                >
                  Kemaskini Tetapan Sistem
                </button>

              </div>
            </div>

          </div>

        </div>

        {/* Support Ticket Replier Box (Full Modal Style Inside Panel) */}
        <div className="bg-slate-900/20 rounded-3xl border border-slate-900 p-6 space-y-6">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            Pusat Penyelesaian Tiket Pengguna ({tickets.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tickets list */}
            <div className="space-y-2 md:col-span-1">
              {tickets.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    activeTicket?.id === t.id 
                      ? 'bg-slate-800 border-violet-500' 
                      : 'bg-slate-900 border-slate-850 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                    <span>ID: {t.id}</span>
                    <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                      t.status === 'replied' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {t.status === 'replied' ? 'Dibalas' : 'Baru'}
                    </span>
                  </div>
                  <h4 className="font-bold text-white truncate">{t.subject}</h4>
                  <p className="text-slate-400 line-clamp-1 mt-1">{t.message}</p>
                </div>
              ))}
            </div>

            {/* Ticket Reply Interface */}
            <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              {activeTicket ? (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-500">Tajuk Isu & Aduan Pelanggan:</span>
                      <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                    </div>
                    <span className="text-[10px] text-slate-500">{activeTicket.created_at}</span>
                  </div>

                  {/* Client original message */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="font-bold text-violet-400 block mb-1">Mesej Klien:</span>
                    <p className="text-slate-300">"{activeTicket.message}"</p>
                  </div>

                  {/* Existing replies */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Aliran Mesej Chat:</span>
                    {activeTicket.replies?.map((rep, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-indigo-900/30 flex flex-col space-y-1">
                        <span className="font-bold text-indigo-400 text-[10px]">AA Support Agent • {rep.time}</span>
                        <p className="text-slate-300 italic">"{rep.message}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply inputs */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <textarea 
                      rows={3}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
                      placeholder="Taip balasan rasmi kepada pelanggan..."
                    />
                    <button 
                      onClick={() => handleAdminReply(activeTicket.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all"
                    >
                      Hantar Balasan Sokongan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-700 mb-2 animate-bounce" />
                  <p className="text-sm">Sila pilih mana-mana tiket sokongan pelanggan di sebelah kiri untuk membaca aduan & menulis balasan rasmi.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    );
  };

  // --- MAIN APP COMPONENT RETURN BLOCK ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      
      {/* GLOBAL TOAST BANNER */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transform translate-y-0 transition-all duration-300">
          <div className={`px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' : 
            toast.type === 'info' ? 'bg-blue-950/90 border-blue-500 text-blue-200' :
            'bg-slate-900/95 border-emerald-500 text-emerald-200'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full animate-ping bg-current" />
            <p className="font-medium text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER PROMO NOTIFICATION */}
      {settings.notice && (
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white text-xs md:text-sm py-2 px-4 text-center font-semibold tracking-wide relative overflow-hidden flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{settings.notice}</span>
        </div>
      )}

      {/* MAIN NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* BRAND LOGO */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {settings.brand_name}
                </span>
                <span className="text-[10px] block font-semibold text-violet-400 tracking-widest uppercase -mt-1">
                  AI TECH HUB
                </span>
              </div>
            </div>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button 
                onClick={() => setActiveTab('home')}
                className={`transition-colors duration-200 ${activeTab === 'home' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                Utama
              </button>
              <button 
                onClick={() => { setActiveTab('catalog'); setSelectedCategory('semua'); }}
                className={`transition-colors duration-200 ${activeTab === 'catalog' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
              >
                Katalog Produk & Servis
              </button>
              {user && user.role === 'customer' && (
                <button 
                  onClick={() => setActiveTab('my-dashboard')}
                  className={`transition-colors duration-200 ${activeTab === 'my-dashboard' ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  Dashboard Saya
                </button>
              )}
              {user && user.role === 'admin' && (
                <button 
                  onClick={() => setActiveTab('admin-dashboard')}
                  className="bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Control
                </button>
              )}
            </div>

            {/* AUTH & PROFILE AREA */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-300">{user.name}</p>
                    <p className="text-[10px] text-violet-400 font-medium capitalize">{user.role}</p>
                  </div>
                  
                  {/* Avatar Dropdown / Quick Button */}
                  <div className="relative group">
                    <button className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:ring-2 hover:ring-violet-500 transition-all">
                      <User className="w-4 h-4 text-violet-300" />
                    </button>
                    {/* Hover menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block transition-all text-xs">
                      {user.role === 'customer' && (
                        <button 
                          onClick={() => setActiveTab('my-dashboard')} 
                          className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          Dashboard Saya
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button 
                          onClick={() => setActiveTab('admin-dashboard')} 
                          className="w-full text-left px-4 py-2 text-slate-300 hover:bg-indigo-950 hover:text-white font-semibold flex items-center gap-2"
                        >
                          <Shield className="w-3.5 h-3.5 text-indigo-400" />
                          Admin Panel
                        </button>
                      )}
                      <hr className="border-slate-800 my-1" />
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/20 hover:text-red-300"
                      >
                        Log Keluar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-xs md:text-sm px-4 py-2 rounded-xl font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40 transform hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  Mula Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* RENDER ACTIVE TAB / SCREEN */}
      <main className="flex-grow">
        {activeTab === 'home' && renderLandingPage()}
        {activeTab === 'catalog' && renderCatalogPage()}
        {activeTab === 'my-dashboard' && renderCustomerDashboard()}
        {activeTab === 'admin-dashboard' && renderAdminDashboard()}
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">{settings.brand_name}</span>
              </div>
              <p className="text-xs text-slate-500">
                Peneraju sistem kecerdasan buatan, siri modul pendidikan video AI eksklusif, dan servis pembangunan digital berprestasi tinggi di Malaysia.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Navigasi Utama</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-violet-400">Utama</button></li>
                <li><button onClick={() => { setActiveTab('catalog'); setSelectedCategory('semua'); }} className="hover:text-violet-400">Katalog Digital</button></li>
                <li><button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="hover:text-violet-400">Akses Pembeli</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Hab Pendidikan</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('catalog'); setSelectedCategory('cat-2'); }} className="hover:text-violet-400">Video Education AI</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('catalog'); setSelectedCategory('cat-1'); }} className="hover:text-violet-400">Siri App Premium</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('catalog'); setSelectedCategory('cat-3'); }} className="hover:text-violet-400">Tempahan Servis Automasi</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Hubungi Kami</h4>
              <p className="text-xs flex items-center gap-2"><Phone className="w-4 h-4 text-violet-500" /> {settings.support_phone}</p>
              <p className="text-xs flex items-center gap-2"><Mail className="w-4 h-4 text-violet-500" /> {settings.support_email}</p>
              <div className="pt-2">
                <span className="inline-block bg-slate-900 border border-slate-800 text-[10px] text-slate-500 px-3 py-1 rounded-md">
                  Hak Cipta Terpelihara © {new Date().getFullYear()} AA AI GROUP
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL: PRODUCT DETAIL SLIDEOVER
          ========================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-slate-950 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-video bg-slate-950">
              <img 
                src={selectedProduct.thumbnail_url} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-slate-950/90 px-3 py-1 rounded-full border border-violet-900/30">
                  {categories.find(c => c.id === selectedProduct.category_id)?.name || 'Digital'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">{selectedProduct.name}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penerangan Produk & Servis</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Bullet features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Apa Yang Anda Dapat:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Access type notice card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-start gap-3">
                <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">Sistem Penghantaran Automatik:</span>
                  <p className="text-slate-400 leading-relaxed">
                    {selectedProduct.access_type === 'download_link' && 'Selepas bayaran disahkan, fail ZIP aplikasi berserta dokumen panduan pemasangan akan dibuka terus pada dashboard anda.'}
                    {selectedProduct.access_type === 'license_key' && 'Kod kunci lesen premium yang unik akan dikeluarkan secara automatik untuk mengaktifkan perisian anda.'}
                    {selectedProduct.access_type === 'video_access' && 'Siri video pembelajaran HD boleh diakses secara langsung di dalam pelayar web tanpa perlu didownload.'}
                    {selectedProduct.access_type === 'service_request' && 'Sila isi borang keperluan projek semasa checkout. Pasukan jurutera kami akan segera menghubungi anda.'}
                  </p>
                </div>
              </div>

              {/* Footer action detail */}
              <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Harga Pelaburan</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">RM {selectedProduct.price}</span>
                    {selectedProduct.compare_price && (
                      <span className="text-sm line-through text-slate-600">RM {selectedProduct.compare_price}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => triggerCheckout(selectedProduct)}
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  {selectedProduct.type === 'service' ? 'Tempah Servis Ini' : 'Beli Sekarang'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CHECKOUT & PAYMENT FLOW
          ========================================== */}
      {isCheckingOut && checkoutProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative">
            
            <button 
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-4 right-4 bg-slate-950 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8 space-y-6">
              
              <div>
                <span className="text-xs text-violet-400 font-bold uppercase">Proses Checkout Pembelian</span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">Ringkasan Pesanan</h2>
              </div>

              {/* Product mini summary card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex gap-4 items-center">
                <img 
                  src={checkoutProduct.thumbnail_url} 
                  alt={checkoutProduct.name} 
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{checkoutProduct.name}</h3>
                  <span className="text-xs text-slate-500">Harga: RM {checkoutProduct.price}</span>
                </div>
              </div>

              <form onSubmit={submitOrder} className="space-y-6">
                
                {/* 1. CUSTOM REQUIREMENTS FIELD (Only if product is Service) */}
                {checkoutProduct.type === 'service' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      Huraikan Keperluan Projek / Servis Anda: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={serviceRequirements}
                      onChange={(e) => setServiceRequirements(e.target.value)}
                      placeholder="Contoh: Sila nyatakan spesifikasi platform, jangka masa siap, dan keperluan khusus syarikat anda..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}

                {/* 2. CHOOSE PAYMENT METHOD */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">Kaedah Pembayaran:</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual_transfer')}
                      className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                        paymentMethod === 'manual_transfer' 
                          ? 'bg-violet-950/20 border-violet-500 text-white' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">Bank Transfer Manual</span>
                      <span className="text-[10px] block text-slate-500">Pindahan terus melalui kaunter / Maybank2u dll</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_gateway')}
                      className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                        paymentMethod === 'bank_gateway' 
                          ? 'bg-violet-950/20 border-violet-500 text-white' 
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">Simulasi FPX Online</span>
                      <span className="text-[10px] block text-slate-500">FPX / Debit Card • Pengesahan Serta-merta</span>
                    </button>

                  </div>
                </div>

                {/* 3. CONDITIONAL BANK ACCOUNT DETAIL (FOR MANUAL TRANSFER) */}
                {paymentMethod === 'manual_transfer' && (
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 space-y-3">
                    <span className="text-xs font-bold text-indigo-300 block">Maklumat Akaun Bank AA AI GROUP:</span>
                    <div className="text-xs space-y-1 text-slate-300">
                      <p>🏦 **Maybank Berhad**</p>
                      <p>Nama Akaun: **AA AI GROUP GLOBAL SDN BHD**</p>
                      <p>Nombor Akaun: <strong className="text-white font-mono text-sm">562211090044</strong></p>
                    </div>
                    
                    <div className="pt-2 space-y-2.5">
                      <label className="text-[10px] text-slate-400 font-bold block">
                        Sila masukkan nombor rujukan pindahan / No Rujukan Bank:
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="Contoh: REF-MBB-998811"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white animate-pulse"
                      />
                    </div>
                  </div>
                )}

                {/* Total pricing tag & pay button */}
                <div className="pt-6 border-t border-slate-850 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Jumlah Bayaran</span>
                    <span className="text-xl font-extrabold text-white">RM {checkoutProduct.price}</span>
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20"
                  >
                    Hantar Bukti & Sahkan
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: VIEW SINGLE SUPPORT TICKET DETAIL (CLIENT / ADMIN)
          ========================================== */}
      {activeTicket && user && user.role === 'customer' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative p-6 space-y-6">
            
            <button 
              onClick={() => setActiveTicket(null)}
              className="absolute top-4 right-4 bg-slate-950 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-xs text-slate-500 font-mono">Tiket ID: {activeTicket.id}</span>
              <h3 className="text-xl font-bold text-white mt-1">{activeTicket.subject}</h3>
              <p className="text-slate-400 text-xs">{activeTicket.created_at}</p>
            </div>

            {/* Original message */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
              <span className="text-slate-500 block font-bold">Aduan Anda:</span>
              <p className="text-slate-300">"{activeTicket.message}"</p>
            </div>

            {/* Replies thread */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Maklum Balas Dari Admin:</span>
              {activeTicket.replies && activeTicket.replies.length > 0 ? (
                <div className="space-y-3">
                  {activeTicket.replies.map((rep, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs">
                      <span className="font-bold text-indigo-400 block mb-1">Ejen Sokongan Pelanggan ({rep.time}):</span>
                      <p className="text-slate-200">"{rep.message}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Menunggu maklum balas bertulis daripada pihak admin kami...</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: LOGIN & REGISTER AUTH OVERLAY
          ========================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 bg-slate-950 p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-violet-600/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  {authMode === 'login' ? 'Log Masuk Akaun' : 'Daftar Akaun Baharu'}
                </h2>
                <p className="text-xs text-slate-400">
                  Daftar masuk percuma untuk mula mengakses katalog digital AA AI GROUP.
                </p>
              </div>

              {/* Quick Logins for Testing Ease */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-center">Butang Ujian Akses Pantas (PENTING):</span>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleQuickLogin('customer')}
                    className="bg-slate-900 hover:bg-slate-850 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-all border border-slate-800"
                  >
                    🔑 Klien Ali (Customer)
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('admin')}
                    className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 font-semibold py-2 px-3 rounded-lg text-xs transition-all border border-indigo-900/40"
                  >
                    🛡️ Dato Azman (Admin)
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase absolute">ATAU EMEL MANUAL</span>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-bold">Nama Penuh:</label>
                    <input 
                      type="text" 
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                      placeholder="Contoh: Muhammad Imran"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Alamat Emel:</label>
                  <input 
                    type="email" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    placeholder="Contoh: imran@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-bold">Kata Laluan (Simulasi):</label>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-xl transition-all"
                >
                  {authMode === 'login' ? 'Log Masuk Akaun' : 'Daftar Sekarang'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-violet-400 hover:underline"
                >
                  {authMode === 'login' ? 'Belum mempunyai akaun? Daftar Sini' : 'Sudah mempunyai akaun? Log Masuk'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}