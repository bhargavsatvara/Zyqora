import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";

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
      if (token) {
        const response = await cartAPI.getCart();
        const data = response.data;
        if (data.success) {
          setCartData(data.data.items || []);
          setTotals({
            subtotal: data.data.subtotal || 0,
            tax: data.data.tax || 0,
            total: data.data.total || 0,
          });
        }
      } else {
        setCartData([]);
        setTotals({ subtotal: 0, tax: 0, total: 0 });
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

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const response = await cartAPI.clearCart();
        if (response.data.success) {
          setCartData([]);
          setTotals({ subtotal: 0, tax: 0, total: 0 });
        }
      }
    } catch (error) {
      console.error('Error clearing cart in context:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartData, setCartData, totals, setTotals, fetchCart, recalculateTotals, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
} 