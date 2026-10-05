import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { API_BASE_URL, MobileProduct } from '../lib/constants';

export interface MobileWishlistItem {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  price: number;
  image: string;
  badge?: string;
  tag?: string;
  weightInfo?: string;
  is_digital?: boolean;
}

interface WishlistContextType {
  items: MobileWishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: MobileProduct | MobileWishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const [items, setItems] = useState<MobileWishlistItem[]>([]);

  const broadcastSync = () => {
    try {
      supabase.channel('sawfy_wishlist_sync').send({
        type: 'broadcast',
        event: 'wishlist_sync',
        payload: { source: 'mobile', timestamp: Date.now() },
      });
    } catch (_) {}
  };

  const refreshWishlist = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const q = new URLSearchParams();
      if (user?.id) q.set('userId', user.id);
      if (user?.email) q.set('email', user.email);
      const url = q.toString()
        ? `${API_BASE_URL}/api/wishlist?${q.toString()}`
        : `${API_BASE_URL}/api/wishlist`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
          AsyncStorage.setItem('sawfy_mobile_wishlist', JSON.stringify(data.items));
        }
      }
    } catch (e) {
      console.warn('Mobile wishlist refresh warning:', e);
    }
  }, [session, user]);

  useEffect(() => {
    AsyncStorage.getItem('sawfy_mobile_wishlist').then((cached) => {
      if (cached) {
        try {
          setItems(JSON.parse(cached));
        } catch (_) {}
      }
    });

    refreshWishlist();

    const channel = supabase
      .channel('sawfy_wishlist_sync')
      .on('broadcast', { event: 'wishlist_sync' }, () => {
        refreshWishlist();
      })
      .subscribe();

    const pollTimer = setInterval(refreshWishlist, 2000);

    return () => {
      clearInterval(pollTimer);
      supabase.removeChannel(channel);
    };
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((i) => i.id === productId);
    },
    [items]
  );

  const toggleWishlist = async (product: MobileProduct | MobileWishlistItem) => {
    const exists = isInWishlist(product.id);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    if (exists) {
      setItems((prev) => prev.filter((i) => i.id !== product.id));
      try {
        await fetch(`${API_BASE_URL}/api/wishlist`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({
            productId: product.id,
            userId: user?.id,
            email: user?.email,
          }),
        });
        broadcastSync();
      } catch (_) {}
    } else {
      const newItem: MobileWishlistItem = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        base_price: product.base_price,
        price: product.base_price,
        image: product.image,
        badge: product.badge,
        weightInfo: product.weightInfo,
        is_digital: !!product.is_digital,
      };
      setItems((prev) => [newItem, ...prev]);
      try {
        await fetch(`${API_BASE_URL}/api/wishlist`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            product: newItem,
            userId: user?.id,
            email: user?.email,
          }),
        });
        broadcastSync();
      } catch (_) {}
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          productId,
          userId: user?.id,
          email: user?.email,
        }),
      });
      broadcastSync();
    } catch (_) {}
  };


  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
