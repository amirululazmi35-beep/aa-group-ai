'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Plus, Minus, Trash2, QrCode, Send, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, settings, clearCart, user } = useApp();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [note, setNote] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Pemampatan imej resit secara pintar
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Kompres kepada kualiti optimum JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setReceiptBase64(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (checkoutStep === 'cart') {
      if (!user) {
        setError('Sila daftar atau log masuk terlebih dahulu sebelum membuat pesanan.');
        return;
      }
      setCheckoutStep('details');
      setError('');
      return;
    }

    if (checkoutStep === 'details') {
      setCheckoutStep('payment');
      return;
    }

    // Fasa Hantar Pesanan (payment step)
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          paymentMethod: 'manual_transfer',
          paymentReference,
          paymentReceiptBase64: receiptBase64,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan.');
      }

      // Format mesej WhatsApp
      const itemsList = cart
        .map((i) => `• ${i.name} (x${i.quantity}) - RM${(i.price * i.quantity).toFixed(2)}`)
        .join('\n');
      
      const whatsappText = `Hai Admin ${settings.brandName} 👋\n\nSaya telah membuat pesanan produk digital:\n\n*ID Pesanan:* ${data.orderId}\n\n*Senarai Produk:*\n${itemsList}\n\n*Jumlah Bayaran:* RM${cartTotal.toFixed(2)}\n*Rujukan Pembayaran:* ${paymentReference || 'Tiada'}\n*Nota:* ${note || 'Tiada'}\n\nSila sahkan pesanan dan berikan akses lesen digital saya. Terima kasih!`;
      
      const encodedMsg = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMsg}`;

      // Reset troli & tutup
      clearCart();
      setCheckoutStep('cart');
      setNote('');
      setPaymentReference('');
      setReceiptBase64(null);
      onClose();

      // Buka pautan WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Berlaku ralat pelayan.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Cart Panel */}
      <div className="relative w-full max-w-md h-full bg-bg-secondary border-l border-border-color shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b border-border-color flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-text-primary">Troli Anda</span>
            <span className="bg-primary-color/10 text-primary-color text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} Item
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-border-color rounded-lg text-text-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs mx-4 mt-4 rounded-xl font-semibold">
            {error}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-border-color flex items-center justify-center text-text-muted">
                🛒
              </div>
              <p className="text-text-secondary text-sm font-semibold">Troli anda kosong.</p>
            </div>
          ) : (
            <>
              {checkoutStep === 'cart' && (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-card-bg border border-card-border rounded-2xl">
                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary truncate">{item.name}</h4>
                        <p className="text-xs text-primary-color font-extrabold mt-1">RM{item.price.toFixed(2)}</p>
                        
                        {/* Quantity selector */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-border-color rounded-lg hover:bg-border-color"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-border-color rounded-lg hover:bg-border-color"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-2 text-text-muted hover:text-red-500 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {checkoutStep === 'details' && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary-color/5 border border-primary-color/10 rounded-2xl">
                    <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary-color" /> Maklumat Pelanggan
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Maklumat ini digunakan untuk pendaftaran lesen digital anda.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Nama Penuh</label>
                      <input
                        type="text"
                        disabled
                        value={user?.name || ''}
                        className="w-full bg-border-color border border-border-color text-text-secondary rounded-xl p-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Emel Pendaftaran</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-border-color border border-border-color text-text-secondary rounded-xl p-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Nota Tambahan (Optional)</label>
                      <textarea
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Contoh: No Telegram anda, atau request khas."
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 text-sm focus:outline-none focus:border-primary-color"
                      />
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-4 text-center">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-xl font-semibold flex items-center justify-center gap-1.5">
                    <QrCode className="w-4 h-4" /> MANUAL TRANSFER / DUITNOW QR
                  </div>

                  {/* QR Image */}
                  <div className="max-w-[200px] mx-auto p-3 bg-white border border-gray-200 rounded-2xl shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.qrUrl || '/qr.jpg'}
                      alt="DuitNow QR Code"
                      width={180}
                      height={180}
                      className="mx-auto object-contain"
                      onError={(e) => {
                        // Fallback jika QR code tiada
                        (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';
                      }}
                    />
                    <span className="text-[10px] text-gray-800 font-extrabold tracking-widest block mt-2 uppercase">
                      DUITNOW QR
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed px-4">
                    Sila imbas kod QR di atas untuk membuat bayaran berjumlah <span className="font-extrabold text-primary-color">RM{cartTotal.toFixed(2)}</span>.
                  </p>

                  <div className="space-y-3 text-left pt-2 border-t border-border-color">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Rujukan Pembayaran (Reference No)</label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Contoh: 81294829"
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-3 text-sm focus:outline-none focus:border-primary-color"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary mb-1">Muat Naik Resit Transaksi</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="w-full bg-bg-primary border border-border-color text-text-primary rounded-xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-color/10 file:text-primary-color hover:file:bg-primary-color/20"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Controls */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border-color space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-text-secondary">Jumlah Kasar</span>
              <span className="font-extrabold text-lg text-text-primary">RM{cartTotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {checkoutStep !== 'cart' && (
                <button
                  onClick={() => {
                    if (checkoutStep === 'payment') setCheckoutStep('details');
                    else if (checkoutStep === 'details') setCheckoutStep('cart');
                  }}
                  className="w-full p-3 rounded-xl border border-border-color text-text-secondary font-bold text-sm hover:bg-border-color"
                >
                  Kembali
                </button>
              )}
              <button
                onClick={handleCheckoutSubmit}
                disabled={loading}
                className={`p-3 rounded-xl bg-primary-color hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-primary-glow flex items-center justify-center gap-1.5 ${
                  checkoutStep !== 'cart' ? 'col-span-1' : 'col-span-2'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : checkoutStep === 'cart' ? (
                  <span>Teruskan Pembelian</span>
                ) : checkoutStep === 'details' ? (
                  <span>Ke Pembayaran</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Sahkan di WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
