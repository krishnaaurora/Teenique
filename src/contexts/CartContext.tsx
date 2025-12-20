import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { products as allProducts } from '@/data/products';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  code?: string;
}

export interface CollectionItem extends Product {
  color?: string;
  size?: string;
}

interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string, variantImage?: string) => void;
  removeFromCart: (productId: number, color?: string, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  collections: CollectionItem[];
  likes: CollectionItem[];
  addToLikes: (product: Product, color?: string, size?: string, variantImage?: string) => void;
  removeFromLikes: (productId: number) => void;
  isLiked: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// LocalStorage keys
const CART_STORAGE_KEY = 'teenique_cart';
const LIKES_STORAGE_KEY = 'teenique_likes';
const COLLECTIONS_STORAGE_KEY = 'teenique_collections';

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage(CART_STORAGE_KEY, []));
  const [collections, setCollections] = useState<CollectionItem[]>(() => loadFromStorage(COLLECTIONS_STORAGE_KEY, []));
  const [likes, setLikes] = useState<CollectionItem[]>(() => loadFromStorage(LIKES_STORAGE_KEY, []));

  // Normalize persisted storage on mount: ensure valid IDs and images
  useEffect(() => {
    const normalizeId = (v: any) => {
      const n = typeof v === 'string' ? Number(v) : v;
      return Number.isNaN(Number(n)) ? null : Number(n);
    };

    const remapSize = (s: any) => {
      if (!s || typeof s !== 'string') return undefined;
      const trimmed = s.trim().toUpperCase();
      if (trimmed === 'S') return 'M';
      if (trimmed === 'XXL') return 'XL';
      return trimmed;
    };

    const normalizeCart = (raw: any[]): CartItem[] => {
      return raw
        .map((it) => {
          const id = normalizeId(it.id);
          if (id === null) return null;
          const product = allProducts.find((p) => p.id === id);
          if (!product) return null;
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: it.image || product.image,
            code: product.code,
            quantity: typeof it.quantity === 'number' && it.quantity > 0 ? it.quantity : 1,
            color: it.color || 'Default',
            size: remapSize(it.size) || 'M',
          } as CartItem;
        })
        .filter(Boolean) as CartItem[];
    };

    const normalizeCollections = (raw: any[]): CollectionItem[] => {
      const mapped = raw
        .map((it) => {
          const id = normalizeId(it.id);
          if (id === null) return null;
          const product = allProducts.find((p) => p.id === id);
          if (!product) return null;
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: it.image || product.image,
            color: it.color || undefined,
            size: remapSize(it.size) || undefined,
          } as CollectionItem;
        })
        .filter(Boolean) as CollectionItem[];

      // Deduplicate by variant key (id|color|size) so different colors/sizes are separate
      const seen = new Map<string, CollectionItem>();
      for (const item of mapped) {
        const key = `${item.id}:${item.color || ''}:${item.size || ''}`;
        if (!seen.has(key)) seen.set(key, item);
      }
      return Array.from(seen.values());
    };

    try {
      const rawCart = loadFromStorage<any[]>(CART_STORAGE_KEY, []);
      const rawLikes = loadFromStorage<any[]>(LIKES_STORAGE_KEY, []);
      const rawCollections = loadFromStorage<any[]>(COLLECTIONS_STORAGE_KEY, []);

      const nc = normalizeCart(rawCart);
      const nl = normalizeCollections(rawLikes);
      const ncol = normalizeCollections(rawCollections);

      // Only update if different to avoid extra renders
      setCart(nc);
      setLikes(nl);
      setCollections(ncol);
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  // Sync likes to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(LIKES_STORAGE_KEY, likes);
  }, [likes]);

  // Sync collections to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(COLLECTIONS_STORAGE_KEY, collections);
  }, [collections]);

  const pushToCollections = useCallback((product: Product, color?: string, size?: string, variantImage?: string) => {
    setCollections((prev) => {
      const newItem: CollectionItem = { ...product, color, size, image: variantImage || product.image };
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.color === color && item.size === size);
      if (existingIndex !== -1) {
        const updated = prev.slice();
        updated[existingIndex] = { ...updated[existingIndex], ...newItem };
        return updated;
      }
      return [...prev, newItem];
    });
  }, [setCollections]);

  const addToLikes = useCallback((product: Product, color?: string, size?: string, variantImage?: string) => {
    setLikes((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.color === color && item.size === size);
      const newItem: CollectionItem = { ...product, color, size, image: variantImage || product.image };
      if (existingIndex !== -1) {
        const updated = prev.slice();
        updated[existingIndex] = { ...updated[existingIndex], ...newItem };
        return updated;
      }
      return [...prev, newItem];
    });
    pushToCollections(product, color, size, variantImage);
  }, [pushToCollections, setLikes]);

  const removeFromLikes = useCallback((productId: number) => {
    setLikes((prev) => prev.filter((item) => item.id !== productId));
  }, [setLikes]);

  const isLiked = useCallback((productId: number) => {
    return likes.some((item) => item.id === productId);
  }, [likes]);

  const addToCart = useCallback((product: Product, color?: string, size?: string, variantImage?: string) => {
    pushToCollections(product, color, size, variantImage);
    setCart((prevCart) => {
      // Create unique key combining product id, color, and size
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.color === color && item.size === size
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, color: color || 'Default', size: size || 'M', image: variantImage || product.image, code: product.code }];
    });
  }, [pushToCollections, setCart]);

  const removeFromCart = useCallback((productId: number, color?: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => {
        if (item.id !== productId) return true; // keep other products
        // if color/size provided, only remove matching variant
        if (color || size) {
          const matchColor = color || '';
          const matchSize = size || '';
          return !(String(item.color || '') === String(matchColor) && String(item.size || '') === String(matchSize));
        }
        // no variant info -> remove all variants of this product
        return false;
      })
    );
  }, [setCart]);

  const updateQuantity = useCallback((productId: number, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) return item;
        if (color || size) {
          const matchColor = color || '';
          const matchSize = size || '';
          if (String(item.color || '') === String(matchColor) && String(item.size || '') === String(matchSize)) {
            return { ...item, quantity };
          }
          return item;
        }
        // no variant specified -> update first matching id
        return { ...item, quantity };
      })
    );
  }, [removeFromCart, setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    collections,
    likes,
    addToLikes,
    removeFromLikes,
    isLiked,
  }), [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    collections,
    likes,
    addToLikes,
    removeFromLikes,
    isLiked,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
