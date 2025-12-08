import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color?: string, size?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  collections: Product[];
  likes: Product[];
  addToLikes: (product: Product) => void;
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
  const [collections, setCollections] = useState<Product[]>(() => loadFromStorage(COLLECTIONS_STORAGE_KEY, []));
  const [likes, setLikes] = useState<Product[]>(() => loadFromStorage(LIKES_STORAGE_KEY, []));

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

  const pushToCollections = (product: Product) => {
    setCollections((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const addToLikes = (product: Product) => {
    setLikes((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
    pushToCollections(product);
  };

  const removeFromLikes = (productId: number) => {
    setLikes((prev) => prev.filter((item) => item.id !== productId));
  };

  const isLiked = (productId: number) => {
    return likes.some((item) => item.id === productId);
  };

  const addToCart = (product: Product, color?: string, size?: string) => {
    pushToCollections(product);
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
      return [...prevCart, { ...product, quantity: 1, color: color || 'Default', size: size || 'M' }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
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
