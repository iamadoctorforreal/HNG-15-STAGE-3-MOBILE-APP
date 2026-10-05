import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { API_BASE_URL, MobileProduct } from '../lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MobileCartItem {
  id: string; // Product UUID
  title: string;
  slug: string;
  base_price: number;
  image: string;
  is_digital: boolean;
  price: number;
  quantity: number;
  variantId?: string;
  variantTitle?: string;
}

interface CartContextType {
  items: MobileCartItem[];
  isLoading: boolean;
  addToCart: (product: MobileProduct, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, delta: number, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuth();
  const [items, setItems] = useState<MobileCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cached cart from AsyncStorage on boot
  useEffect(() => {
    AsyncStorage.getItem('sawfy_mobile_cart').then((saved) => {
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (_) {}
      }
    });
  }, []);

  // Fetch cart from shared backend
  const refreshCart = useCallback(async () => {
    try {
      let headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // If user is logged in, query via API or directly from Supabase
      if (user?.id) {
        // Direct Supabase query
        const { data: cart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cart) {
          const { data: cartItems } = await supabase
            .from('cart_items')
            .select('id, product_id, variant_id, quantity, product:products(*), variant:product_variants(*)')
            .eq('cart_id', cart.id);

          if (cartItems) {
            const formatted: MobileCartItem[] = cartItems.map((ci: any) => {
              const p = ci.product || {};
              const meta = p.metadata || {};
              const img = meta.images?.[0] || 'https://shop.sawfywhite.com/images/catfish-real-glass-plate.png';
              return {
                id: p.id || ci.product_id,
                title: p.title || 'Abeokuta Dried Catfish',
                slug: p.slug || 'dried-catfish',
                base_price: Number(p.base_price) || 0,
                image: img.startsWith('http') ? img : `https://shop.sawfywhite.com${img}`,
                is_digital: p.is_digital || false,
                price: Number(ci.variant?.price || p.base_price || 0),
                quantity: ci.quantity || 1,
                variantId: ci.variant_id || undefined,
                variantTitle: ci.variant?.title || undefined,
              };
            });
            setItems(formatted);
            AsyncStorage.setItem('sawfy_mobile_cart', JSON.stringify(formatted));
            return;
          }
        }
      }

      // Fallback: Query /api/cart endpoint
      const res = await fetch(`${API_BASE_URL}/api/cart`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
          AsyncStorage.setItem('sawfy_mobile_cart', JSON.stringify(data.items));
        }
      }
    } catch (e) {
      console.warn('Mobile refresh cart error:', e);
    }
  }, [user, session]);

  // Real-time synchronization: Listen to changes in cart_items table
  useEffect(() => {
    refreshCart();

    const channel = supabase
      .channel('mobile:cart_items_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        () => {
          // Immediately refetch whenever cart_items changes (e.g. from web or another device)
          refreshCart();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshCart]);

  const addToCart = async (product: MobileProduct, quantity = 1) => {
    // 1. Optimistic UI update
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          slug: product.slug,
          base_price: product.base_price,
          image: product.image,
          is_digital: product.is_digital,
          price: product.base_price,
          quantity,
        },
      ];
    });

    // 2. Persist to shared Supabase backend
    try {
      if (user?.id) {
        // Ensure cart exists
        let { data: cart } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!cart) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();
          cart = newCart;
        }

        if (cart) {
          // Check existing item
          const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cart.id)
            .eq('product_id', product.id)
            .maybeSingle();

          if (existing) {
            await supabase
              .from('cart_items')
              .update({ quantity: existing.quantity + quantity })
              .eq('id', existing.id);
          } else {
            await supabase.from('cart_items').insert({
              cart_id: cart.id,
              product_id: product.id,
              quantity,
            });
          }
        }
      }

      // Also call web API with auth token
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      // Refetch after 300ms to guarantee sync
      setTimeout(refreshCart, 300);
    } catch (err) {
      console.warn('Failed to sync added item from mobile:', err);
    }
  };

  const removeFromCart = async (productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === productId && i.variantId === variantId)));

    try {
      if (user?.id) {
        const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle();
        if (cart) {
          await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('product_id', productId);
        }
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ productId, variantId }),
      });
    } catch (e) {
      console.warn('Remove error:', e);
    }
  };

  const updateQuantity = async (productId: string, delta: number, variantId?: string) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId && item.variantId === variantId) {
            const nQty = item.quantity + delta;
            return nQty > 0 ? { ...item, quantity: nQty } : null;
          }
          return item;
        })
        .filter(Boolean) as MobileCartItem[]
    );

    try {
      if (user?.id) {
        const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle();
        if (cart) {
          const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cart.id)
            .eq('product_id', productId)
            .maybeSingle();

          if (existing) {
            const nextQ = existing.quantity + delta;
            if (nextQ > 0) {
              await supabase.from('cart_items').update({ quantity: nextQ }).eq('id', existing.id);
            } else {
              await supabase.from('cart_items').delete().eq('id', existing.id);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Update quantity error:', e);
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      if (user?.id) {
        const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle();
        if (cart) {
          await supabase.from('cart_items').delete().eq('cart_id', cart.id);
        }
      }
    } catch (e) {
      console.warn('Clear cart error:', e);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
