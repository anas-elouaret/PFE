import { createContext, useContext, useState, useEffect } from "react";

const CART_STORAGE_KEY = "sw_cart_items";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newItemAdded, setNewItemAdded] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const [flyTargetRect, setFlyTargetRect] = useState(null);
  const [actionTargetPulse, setActionTargetPulse] = useState(false);
  const [shakeCart, setShakeCart] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.serviceId === item.serviceId);
      if (existing) {
        return prev.map((i) =>
          i.serviceId === item.serviceId
            ? { ...i, quantity: (i.quantity ?? 1) + (item.quantity ?? 1) }
            : i
        );
      }
      const cartItemId = `${item.serviceId}-${Date.now()}-${Math.random()}`;
      return [
        ...prev,
        {
          ...item,
          cartItemId,
          quantity: item.quantity ?? 1,
          addedAt: new Date().toISOString(),
        },
      ];
    });
    setNewItemAdded(true);
    setTimeout(() => setNewItemAdded(false), 1500);
  };

  const updateCartItem = (cartItemId, updatedItem) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, ...updatedItem } : item
      )
    );
  };

  const updateCartItemQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addFlyingItem = (item) => {
    if (!item || !item.id) return;
    setFlyingItems((prev) => [...prev, item]);
  };

  const removeFlyingItem = (id) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const setFlyingItem = (item) => {
    if (item === null) {
      setFlyingItems([]);
      return;
    }
    addFlyingItem(item);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.finalPrice || item.price || 0;
      const unitPrice = typeof price === "number" ? price : parseFloat(price) || 0;
      const qty = item.quantity ?? 1;
      return total + unitPrice * qty;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const getCartQuantity = () => {
    return cartItems.reduce((sum, i) => sum + (i.quantity ?? 1), 0);
  };

  const getDiscountInfo = () => {
    const count = getCartQuantity();
    const total = getTotalPrice();
    const percent = count >= 4 ? 20 : count >= 3 ? 15 : count >= 2 ? 10 : 0;
    return {
      eligible: percent > 0,
      percent,
      discount: Math.round(total * (percent / 100)),
      totalAfterDiscount: Math.round(total * (1 - percent / 100)),
    };
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartItem,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getCartCount,
    getCartQuantity,
    getDiscountInfo,
    newItemAdded,
    flyingItems,
    addFlyingItem,
    removeFlyingItem,
    setFlyingItem,
    flyTargetRect,
    setFlyTargetRect,
    actionTargetPulse,
    setActionTargetPulse,
    shakeCart,
    setShakeCart,
    muted,
    setMuted,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
