import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartData, setCartData] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  // Fetch cart from backend on mount and when auth token changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCart();
    };
    window.addEventListener('storage', handleStorageChange);
    fetchCart();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch("http://localhost:4000/api/cart", {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (data.success) {
        setCartData(data.data.items || []);
        setTotals({
          subtotal: data.data.subtotal || 0,
          tax: data.data.tax || 0,
          total: data.data.total || 0,
        });
      }
    } catch (e) {
      setCartData([]);
      setTotals({ subtotal: 0, tax: 0, total: 0 });
    }
  };

  // Helper to recalculate totals instantly
  const recalculateTotals = (cartItems) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    setTotals({ subtotal, tax, total });
  };

  return (
    <CartContext.Provider value={{
      cartData, setCartData, totals, setTotals, fetchCart, recalculateTotals
    }}>
      {children}
    </CartContext.Provider>
  );
} 