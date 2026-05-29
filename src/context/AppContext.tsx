'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnailUrl?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string | null;
}

export interface Settings {
  brandName: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  themeColor: string;
  qrUrl: string;
  whatsappNumber: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; price: number; thumbnailUrl?: string | null }) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

const defaultSettings: Settings = {
  brandName: 'AA AI GROUP',
  logoUrl: '/logo.png',
  supportEmail: 'support@aa-aigroup.com',
  supportPhone: '+601118715341',
  themeColor: '#6366f1',
  qrUrl: '/qr.jpg',
  whatsappNumber: '601118715341',
  maintenanceMode: false,
  maintenanceMessage: 'Website sedang dinaik taraf.',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Semak User Session & Cart
  const refetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // Semak Settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch {
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refetchUser();
      await fetchSettings();
      
      // Load cart
      try {
        const savedCart = localStorage.getItem('aa_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch {}

      // Load theme
      try {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        if (savedTheme) {
          setTheme(savedTheme);
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else {
          // default is dark
          document.documentElement.classList.add('dark');
        }
      } catch {}

      setLoading(false);
    };
    init();
  }, []);

  // Simpan cart
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('aa_cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (item: { id: string; name: string; price: number; thumbnailUrl?: string | null }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        theme,
        toggleTheme,
        settings,
        updateSettings,
        loading,
        refetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
