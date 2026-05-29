'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Message {
  sender: 'jarvis' | 'user';
  text: string;
  timestamp: string;
}

export default function JarvisChatbot() {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMessages([
        {
          sender: 'jarvis',
          text: 'Hai! Saya **JARVIS**, pembantu pintar kecerdasan buatan (AI) di **AA AI GROUP**! ⚡\n\nSaya boleh membantu menjawab soalan anda berkaitan:\n\n* 🎨 **Canva Pro (Lifetime & Monthly)**\n* 🎬 **CapCut Pro Premium**\n* ☁️ **Google AI Pro 5TB / Gemini**\n* 🛒 **Cara Order & Pembayaran**\n* 🛡️ **Jaminan Waranti & Support**',
          timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    });
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const quickQuestions = [
    '🎨 Canva Pro',
    '🎬 CapCut Pro',
    '☁️ Google 5TB',
    '🛒 Cara Order',
    '🛡️ Waranti & Refund',
    '💬 Chat WhatsApp Admin',
  ];

  const handleSendMessage = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Tambah mesej user
    const userMsg: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // AI Simulation Responses
    setTimeout(() => {
      let reply = '';
      const cleanText = trimmed.toLowerCase();

      if (cleanText.includes('canva') || cleanText.includes('lifetime') || cleanText.includes('cava')) {
        reply = `🎨 **Canva Pro (Edu Lifetime & Invite Link)**\n\n• **1 Bulan (Email Invite) - RM20.00**\n• **Lifetime (999 Hari) - RM50.00**\n\n**Ciri Canva Pro:** Unlock all premium templates, remove background in 1 click, resize tools, PNG transparent background, brand kit & massive cloud storage. \n\n*Jaminan akaun 100% stabil dengan waranti penuh!*`;
      } else if (cleanText.includes('capcut') || cleanText.includes('capcut pro') || cleanText.includes('video')) {
        reply = `🎬 **CapCut Pro Premium**\n\n• **1 Bulan - RM20.00**\n• **3 Bulan (Best Value) - RM40.00**\n\n**Ciri CapCut Pro:** Render 60fps, remove watermark, dynamic neon video transitions, voice-to-text smart translation & multi-device compatibility (PC & Mobile).\n\n*Aktivasi pantas dalam tempoh <10 minit!*`;
      } else if (cleanText.includes('google') || cleanText.includes('gemini') || cleanText.includes('5tb')) {
        reply = `☁️ **Google AI Pro & 5TB Cloud Storage**\n\n• **4 Bulan (Trial Promo) - RM30.00**\n• **1.5 Tahun (Best Deal) - RM65.00**\n\n**Kelebihan:** Gemini Advanced (Model 1.5 Pro) bersepadu, storan cloud mega 5TB kongsi merentasi Google Drive, Photos, & Gmail. Waranti penuh!`;
      } else if (cleanText.includes('order') || cleanText.includes('beli') || cleanText.includes('bayar') || cleanText.includes('troli') || cleanText.includes('cara')) {
        reply = `🛒 **Cara Membuat Pembelian & Bayaran**\n\n1. Pilih produk di **Katalog** & klik **Beli**.\n2. Klik ikon troli di kanan atas navbar.\n3. Masukkan maklumat pendaftaran lesen digital.\n4. Imbas **QR DuitNow** & buat bayaran.\n5. Masukkan reference no resit & klik **Sahkan di WhatsApp**.\n\n⚡ Admin akan verify dan mengaktifkan lesen digital anda sepantas kilat. Status boleh disemak di **Dashboard Pelanggan**!`;
      } else if (cleanText.includes('waranti') || cleanText.includes('warranty') || cleanText.includes('jaminan') || cleanText.includes('refund')) {
        reply = `🛡️ **Jaminan Waranti Platform**\n\nKami menawarkan **100% Jaminan Waranti Penuh** sepanjang tempoh langganan produk. Sekiranya lesen anda bermasalah, kami akan menggantikannya dengan lesen baru dalam tempoh kurang 24 jam.\n\nHubungi VIP Support di WhatsApp: \`+${settings.supportPhone}\``;
      } else if (cleanText.includes('whatsapp') || cleanText.includes('admin') || cleanText.includes('contact') || cleanText.includes('hubungi') || cleanText.includes('chat')) {
        reply = `💬 **Sokongan Langsung Admin**\n\nAnda boleh chat terus dengan Admin manusia di WhatsApp:\n\n👉 **Hubungi WhatsApp:** https://wa.me/${settings.whatsappNumber}\n📞 **No Telefon:** ${settings.supportPhone}\n✉️ **Emel:** ${settings.supportEmail}`;
      } else {
        reply = `🤖 **Pembantu AI Jarvis**\n\nTerima kasih atas mesej anda! Soalan anda telah diterima.\n\nUntuk mendapatkan respon segera, sila pilih salah satu butang soalan lazim di bawah atau klik **Chat WhatsApp Admin** untuk bercakap dengan wakil khidmat pelanggan kami secara langsung.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'jarvis',
          text: reply,
          timestamp: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-bg-secondary border border-border-color rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary-color to-accent-cyan text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1">
                  Jarvis AI Assistant <Sparkles className="w-3.5 h-3.5" />
                </h4>
                <span className="text-[10px] text-white/80">Hidup Sentiasa • Live AI</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'jarvis' && (
                  <div className="w-7 h-7 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-primary-color text-white rounded-tr-none'
                        : 'bg-card-bg border border-card-border text-text-primary rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-text-muted mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-lg bg-primary-color/10 flex items-center justify-center text-primary-color flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card-bg border border-card-border p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ buttons */}
          <div className="p-2 border-t border-border-color bg-bg-primary/50 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.replace(/[^\w\s\+]/g, ''))}
                className="whitespace-nowrap bg-card-bg border border-card-border px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-text-secondary hover:text-primary-color hover:border-primary-color transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 border-t border-border-color flex gap-2 bg-bg-secondary"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya soalan..."
              className="flex-1 bg-bg-primary border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-primary-color"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-primary-color hover:bg-primary-hover text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-color to-accent-cyan hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg shadow-primary-glow border border-white/10"
        aria-label="Tanya Jarvis AI"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
