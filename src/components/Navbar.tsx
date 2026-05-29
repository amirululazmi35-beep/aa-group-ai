'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Sun, Moon, ShoppingCart, Menu, X, User, LogOut, ShieldAlert,
  Compass, LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  onCartToggle?: () => void;
}

export default function Navbar({ onCartToggle }: NavbarProps) {
  const { user, setUser, theme, toggleTheme, cartCount, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Jangan tunjuk navbar jika di dalam API routes
  if (pathname?.startsWith('/api')) return null;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (e) {
      console.error('Gagal log keluar:', e);
    }
  };

  const activeClass = (path: string) => {
    return pathname === path
      ? 'text-primary-color font-bold border-b-2 border-primary-color pb-1'
      : 'text-text-secondary hover:text-text-primary transition-colors pb-1';
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-color to-accent-cyan flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-glow">
                AA
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-text-primary via-primary-color to-accent-cyan bg-clip-text text-transparent">
                {settings.brandName}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={activeClass('/')}> Utama </Link>
            <Link href="/katalog" className={activeClass('/katalog')}> Katalog </Link>
            {user && (
              <Link href="/dashboard" className={activeClass('/dashboard')}>
                Dashboard Pelanggan
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-1 text-accent-gold hover:text-amber-500 font-semibold transition-colors">
                <ShieldAlert className="w-4 h-4" /> Admin Settings
              </Link>
            )}
          </div>

          {/* Desktop Utility Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-border-color transition-all"
              aria-label="Tukar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onCartToggle}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-border-color relative transition-all"
              aria-label="Buka troli"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-bg-primary shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 p-2 px-3 rounded-xl border border-border-color hover:bg-border-color transition-all text-sm font-medium">
                  <User className="w-4 h-4 text-primary-color" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 p-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-sm font-bold transition-all"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="p-2 px-4 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
                >
                  Log Masuk
                </Link>
                <Link
                  href="/register"
                  className="p-2.5 px-5 rounded-xl text-sm font-bold bg-primary-color hover:bg-primary-hover text-white shadow-md shadow-primary-glow transition-all"
                >
                  Daftar Akaun
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text-secondary"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={onCartToggle}
              className="p-2 rounded-xl text-text-secondary relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-bg-primary">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text-secondary hover:bg-border-color"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-glass-border bg-bg-secondary/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border-color"
            >
              <Compass className="w-5 h-5" /> Utama
            </Link>
            <Link
              href="/katalog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border-color"
            >
              <Compass className="w-5 h-5" /> Katalog
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border-color"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard Pelanggan
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-base font-bold text-accent-gold hover:bg-border-color"
              >
                <ShieldAlert className="w-5 h-5" /> Admin Settings
              </Link>
            )}

            <div className="border-t border-border-color my-2 pt-2"></div>

            {user ? (
              <div className="px-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <User className="w-4 h-4" /> Logged in as <span className="font-bold text-text-primary">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20"
                >
                  <LogOut className="w-5 h-5" /> Keluar
                </button>
              </div>
            ) : (
              <div className="px-3 grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3 rounded-xl border border-border-color text-text-secondary font-bold text-center text-sm"
                >
                  Log Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3 rounded-xl bg-primary-color text-white font-bold text-center text-sm shadow-md shadow-primary-glow"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
