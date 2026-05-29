'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, Lock, Heart, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const { settings, user } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg-secondary border-t border-border-color py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-color to-accent-cyan flex items-center justify-center text-white font-extrabold text-sm">
                AA
              </div>
              <span className="font-extrabold text-lg text-text-primary tracking-tight">
                {settings.brandName}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Penyedia rasmi lesen aplikasi premium stabil, video pendidikan kecerdasan buatan (AI), dan servis digital profesional.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-text-primary uppercase tracking-wider">
              Pautan Pantas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary-color transition-colors">
                  Halaman Utama
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="text-text-secondary hover:text-primary-color transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-secondary hover:text-primary-color transition-colors">
                  Akses Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-text-primary uppercase tracking-wider">
              Sokongan Pelanggan
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-color" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-color transition-colors"
                >
                  {settings.supportPhone} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-color" />
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="hover:text-primary-color transition-colors"
                >
                  {settings.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-color mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted flex items-center gap-1">
            &copy; {currentYear} {settings.brandName}. Hak Cipta Terpelihara. Dibangunkan dengan
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            oleh AA Team.
          </p>

          {/* Admin Lock Button */}
          <div className="flex items-center gap-2">
            {user && user.role === 'admin' ? (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-xs text-accent-gold border border-accent-gold/20 bg-accent-gold/5 px-2.5 py-1 rounded-lg hover:bg-accent-gold/10 transition-all font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Urus Platform
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="text-text-muted hover:text-text-primary transition-all p-1.5 rounded-lg hover:bg-border-color"
                title="Akses Portal Pentadbir"
              >
                <Lock className="w-4 h-4 opacity-30 hover:opacity-100 transition-opacity" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
