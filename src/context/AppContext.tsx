import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order } from '../types';

export type AppView = 
  | 'home' 
  | 'products' 
  | 'product-details' 
  | 'customize' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'order-details';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  currentOrderId: string;
  setCurrentOrderId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cart_item_id'>) => void;
  updateQuantity: (cart_item_id: string, delta: number) => void;
  removeFromCart: (cart_item_id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartCustomizationTotal: number;
  cartGrandTotal: number;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Navigation helpers
  navigateTo: (view: AppView, params?: { productId?: string; orderId?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'customcraft_cart_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('classic-cotton-tee');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string>('CC1024');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Load initial cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (newItem: Omit<CartItem, 'cart_item_id'>) => {
    const cart_item_id = `${newItem.product_id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const fullItem: CartItem = {
      ...newItem,
      cart_item_id,
    };

    setCart(prev => [fullItem, ...prev]);
    showToast(`Added "${newItem.product_name}" to cart!`, 'success');
  };

  const updateQuantity = (cart_item_id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cart_item_id === cart_item_id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total_price: item.unit_price * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cart_item_id: string) => {
    setCart(prev => prev.filter(item => item.cart_item_id !== cart_item_id));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.base_price * item.quantity), 0);
  const cartCustomizationTotal = cart.reduce(
    (acc, item) => acc + ((item.text_charge + item.design_charge + item.print_charge) * item.quantity),
    0
  );
  const cartGrandTotal = cart.reduce((acc, item) => acc + item.total_price, 0);

  const navigateTo = (view: AppView, params?: { productId?: string; orderId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.orderId) {
      setCurrentOrderId(params.orderId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedProduct,
        setSelectedProduct,
        currentOrderId,
        setCurrentOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartCustomizationTotal,
        cartGrandTotal,
        toasts,
        showToast,
        dismissToast,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
