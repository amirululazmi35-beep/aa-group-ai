'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import JarvisChatbot from '@/components/JarvisChatbot';
import { Search, ShoppingBag, Eye, X, Check, ShoppingCart, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  type: 'app' | 'video_course' | 'service' | 'bundle' | 'other';
  shortDescription: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  thumbnailUrl: string | null;
  status: string;
  accessType: string;
  accessValue: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  sortOrder: number;
  isPreview: boolean;
}

export default function Katalog() {
  const { addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = React.useRef(searchQuery);
  useEffect(() => {
    searchRef.current = searchQuery;
  }, [searchQuery]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Fetch Kategori & Produk
  const fetchData = React.useCallback(async (category: string, search: string) => {
    setLoading(true);
    try {
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories);
      }

      const prodRes = await fetch(`/api/products?category=${category}&search=${search}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchData(selectedCategory, searchRef.current);
    });
  }, [selectedCategory, fetchData]);

  // Fetch lessons for course preview
  useEffect(() => {
    Promise.resolve().then(() => {
      if (selectedProduct && selectedProduct.type === 'video_course') {
        const fetchLessons = async () => {
          setLoadingLessons(true);
          try {
            const res = await fetch(`/api/products/${selectedProduct.id}/lessons`);
            if (res.ok) {
              const data = await res.json();
              setLessons(data.lessons || []);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoadingLessons(false);
          }
        };
        fetchLessons();
      } else {
        setLessons([]);
      }
    });
  }, [selectedProduct]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(selectedCategory, searchQuery);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <>
      <Navbar onCartToggle={() => setCartOpen(true)} />
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Katalog Produk & Servis</h1>
          <p className="text-sm text-text-secondary mt-2">
            Pilih lesen aplikasi, video course kecerdasan buatan, atau tempah servis automasi digital kami.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mb-8">
          {/* Category Tabs (Desktop Sidebar) */}
          <div className="lg:col-span-1 glass-card rounded-2xl p-4 border border-glass-border space-y-2">
            <h3 className="font-bold text-xs text-text-muted uppercase tracking-wider px-2.5 mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Kategori
            </h3>
            
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-color text-white shadow-md shadow-primary-glow'
                  : 'text-text-secondary hover:bg-border-color'
              }`}
            >
              Semua Produk
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-color text-white shadow-md shadow-primary-glow'
                    : 'text-text-secondary hover:bg-border-color'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Canva Pro, Video Course..."
                  className="w-full bg-card-bg border border-card-border text-text-primary rounded-xl p-3.5 pl-11 text-xs focus:outline-none focus:border-primary-color"
                />
                <Search className="w-5 h-5 text-text-muted absolute left-4 top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-primary-color hover:bg-primary-hover text-white font-bold text-xs px-6 rounded-xl shadow-md shadow-primary-glow"
              >
                Cari
              </button>
            </form>

            {/* Loading Indicator */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-4 border-primary-color border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-text-secondary text-sm">Memuatkan katalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center bg-card-bg border border-card-border rounded-3xl">
                <p className="text-text-secondary text-sm font-semibold">Tiada produk dijumpai.</p>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="glass-card rounded-2xl overflow-hidden border border-glass-border flex flex-col group hover:shadow-lg hover:shadow-primary-glow/5 transition-all"
                  >
                    {/* Thumbnail Image placeholder vector representation */}
                    <div className="relative aspect-video w-full bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-center border-b border-glass-border overflow-hidden">
                      <div className="absolute top-3 left-3 bg-primary-color/10 border border-primary-color/30 text-primary-color font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {product.categoryName}
                      </div>

                      <div className="text-center p-4">
                        <ShoppingBag className="w-10 h-10 text-primary-color mx-auto opacity-50 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-text-muted font-bold block mt-2 uppercase tracking-wide">
                          {product.type === 'video_course' ? 'ONLINE COURSE' : product.type === 'service' ? 'DIGITAL SERVICE' : 'LICENSE KEY'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-text-primary line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {product.shortDescription || 'Tiada penerangan ringkas disediakan.'}
                        </p>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="mt-5 pt-4 border-t border-border-color flex items-center justify-between">
                        <div>
                          {product.comparePrice && (
                            <span className="text-xs text-text-muted line-through mr-1.5 font-medium">
                              RM{product.comparePrice.toFixed(2)}
                            </span>
                          )}
                          <span className="font-black text-sm text-primary-color">
                            RM{product.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="p-2 border border-border-color rounded-xl hover:bg-border-color text-text-secondary hover:text-text-primary"
                            title="Lihat Butiran"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                thumbnailUrl: product.thumbnailUrl,
                              });
                              triggerToast(`${product.name} telah ditambah ke troli!`);
                            }}
                            className="flex items-center gap-1 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs p-2 px-3 rounded-xl shadow-sm shadow-primary-glow"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Beli
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative w-full max-w-xl bg-bg-secondary border border-border-color rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col animate-in scale-in-5">
            {/* Header */}
            <div className="p-4 border-b border-border-color flex items-center justify-between">
              <span className="font-bold text-xs text-primary-color uppercase tracking-widest">
                {selectedProduct.categoryName}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 hover:bg-border-color rounded-lg text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h2 className="text-xl font-black text-text-primary">{selectedProduct.name}</h2>
              
              <div className="flex items-center gap-3">
                <span className="font-black text-lg text-primary-color">
                  RM{selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.comparePrice && (
                  <span className="text-sm text-text-muted line-through">
                    Asal: RM{selectedProduct.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="border-t border-border-color pt-4 space-y-2">
                <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider">Butiran Produk</h4>
                <div className="text-xs text-text-primary leading-relaxed whitespace-pre-line bg-bg-primary/50 border border-border-color p-4 rounded-xl">
                  {selectedProduct.description || 'Tiada butiran lengkap untuk produk ini.'}
                </div>
              </div>

              {/* Video Lessons Syllabus Preview (Jika produk adalah course) */}
              {selectedProduct.type === 'video_course' && (
                <div className="border-t border-border-color pt-4 space-y-2">
                  <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider">Silabus Kursus & Preview</h4>
                  {loadingLessons ? (
                    <p className="text-xs text-text-muted">Memuatkan silabus...</p>
                  ) : lessons.length === 0 ? (
                    <p className="text-xs text-text-muted">Tiada video pelajaran dimuat naik lagi.</p>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-3 bg-bg-primary/50 border border-border-color rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-text-primary">{lesson.sortOrder}. {lesson.title}</span>
                            {lesson.description && <p className="text-[10px] text-text-secondary mt-0.5">{lesson.description}</p>}
                          </div>
                          <div>
                            {lesson.isPreview ? (
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25 font-bold px-2 py-1 rounded text-[10px] hover:bg-accent-cyan/25 transition-all flex items-center gap-1"
                              >
                                📺 Tonton Preview
                              </a>
                            ) : (
                              <span className="text-[10px] text-text-muted flex items-center gap-1">
                                🔒 Terkunci
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-color bg-bg-primary/50 flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-1/2 p-3 border border-border-color rounded-xl text-text-secondary font-bold text-xs hover:bg-border-color"
              >
                Tutup
              </button>
              
              <button
                onClick={() => {
                  addToCart({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    thumbnailUrl: selectedProduct.thumbnailUrl,
                  });
                  setSelectedProduct(null);
                  triggerToast(`${selectedProduct.name} telah ditambah ke troli!`);
                }}
                className="w-1/2 p-3 bg-primary-color hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-md shadow-primary-glow flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> Beli Sekarang
              </button>
            </div>
          </div>
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
