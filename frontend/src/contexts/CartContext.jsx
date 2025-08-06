import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartData, setCartData] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  // Local storage key for cart data
  const LOCAL_CART_KEY = 'zyqora_local_cart';

  // Helper functions for local storage
  const getLocalCart = () => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error reading local cart:', error);
      return [];
    }
  };

  const saveLocalCart = (cartItems) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  const updateLocalCartTotals = (cartItems) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Local storage cart operations
  const addToLocalCart = (newItem) => {
    const localCart = getLocalCart();
    
    // Check if item already exists (same product, size, and color)
    const existingItemIndex = localCart.findIndex(item => 
      item.product_id === newItem.product_id && 
      item.size === newItem.size && 
      item.color === newItem.color
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      localCart[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Add new item
      localCart.push(newItem);
    }

    saveLocalCart(localCart);
    setCartData([...localCart]);
    const newTotals = updateLocalCartTotals(localCart);
    setTotals(newTotals);
  };

  const updateLocalCartItem = (productId, size, color, quantity) => {
    const localCart = getLocalCart();
    
    const itemIndex = localCart.findIndex(item => 
      item.product_id === productId && 
      item.size === size && 
      item.color === color
    );

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        localCart.splice(itemIndex, 1);
      } else {
        // Update quantity
        localCart[itemIndex].quantity = quantity;
      }
      
      saveLocalCart(localCart);
      setCartData([...localCart]);
      const newTotals = updateLocalCartTotals(localCart);
      setTotals(newTotals);
    }
  };

  const removeFromLocalCart = (productId, size, color) => {
    const localCart = getLocalCart();
    
    const filteredCart = localCart.filter(item => 
      !(item.product_id === productId && item.size === size && item.color === color)
    );

    saveLocalCart(filteredCart);
    setCartData([...filteredCart]);
    const newTotals = updateLocalCartTotals(filteredCart);
    setTotals(newTotals);
  };

  const clearLocalCart = () => {
    localStorage.removeItem(LOCAL_CART_KEY);
    setCartData([]);
    setTotals({ subtotal: 0, tax: 0, total: 0 });
  };

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

  // Listen for authentication changes to merge local cart with backend cart
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // User just logged in, merge local cart with backend cart
        mergeLocalCartWithBackend();
      }
    };

    // Check for auth changes every 2 seconds
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (currentToken !== lastAuthToken.current) {
        lastAuthToken.current = currentToken;
        handleAuthChange();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Ref to track last auth token
  const lastAuthToken = React.useRef(localStorage.getItem('token') || sessionStorage.getItem('token'));

  // Function to merge local cart with backend cart when user logs in
  const mergeLocalCartWithBackend = async () => {
    try {
      const localCart = getLocalCart();
      if (localCart.length === 0) return;

      // Add each local cart item to the backend
      for (const item of localCart) {
        try {
          await cartAPI.addToCartAlt(item);
        } catch (error) {
          console.error('Error merging cart item:', error);
        }
      }

      // Clear local cart after successful merge
      clearLocalCart();
      
      // Refresh cart from backend
      await fetchCart();
    } catch (error) {
      console.error('Error merging local cart with backend:', error);
    }
  };

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
        // Load from local storage when not authenticated
        const localCart = getLocalCart();
        setCartData(localCart);
        const localTotals = updateLocalCartTotals(localCart);
        setTotals(localTotals);
      }
    } catch (e) {
      // Fallback to local storage on error
      const localCart = getLocalCart();
      setCartData(localCart);
      const localTotals = updateLocalCartTotals(localCart);
      setTotals(localTotals);
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
        console.log('Context clear cart response:', response);
        
        if (response.data && response.data.success) {
          setCartData([]);
          setTotals({ subtotal: 0, tax: 0, total: 0 });
        } else {
          console.error('Clear cart failed:', response.data?.message);
        }
      } else {
        // Clear local cart
        clearLocalCart();
      }
    } catch (error) {
      console.error('Error clearing cart in context:', error);
      // Even if there's an error, we should clear the local state
      setCartData([]);
      setTotals({ subtotal: 0, tax: 0, total: 0 });
    }
  };

  // Function to update cart data directly (for immediate updates)
  const updateCartData = (newCartData, newTotals) => {
    // Force a state update by creating new objects
    setCartData([...newCartData]);
    setTotals({ ...newTotals });
  };

  // Add to cart function that handles both authenticated and non-authenticated users
  const addToCart = async (cartItem) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // User is authenticated - use backend API
      try {
        const response = await cartAPI.addToCartAlt(cartItem);
        if (response.status === 200 || response.status === 201) {
          await fetchCart(); // Refresh cart from backend
          return { success: true, message: 'Product added to cart!' };
        } else {
          return { success: false, message: response.data?.message || 'Failed to add product to cart' };
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: 'Error adding product to cart. Please try again.' };
      }
    } else {
      // User is not authenticated - use local storage
      addToLocalCart(cartItem);
      return { success: true, message: 'Product added to cart!' };
    }
  };

  // Update cart item function
  const updateCartItem = async (productId, size, color, quantity) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // User is authenticated - use backend API
      try {
        const response = await cartAPI.updateCartItemAlt({
          itemId: productId,
          quantity: quantity
        });
        
        if (response.data && response.data.success) {
          await fetchCart(); // Refresh cart from backend
          return { success: true };
        } else {
          return { success: false, message: response.data?.message || 'Failed to update cart item' };
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
        return { success: false, message: 'Error updating cart item. Please try again.' };
      }
    } else {
      // User is not authenticated - use local storage
      updateLocalCartItem(productId, size, color, quantity);
      return { success: true };
    }
  };

  // Remove from cart function
  const removeFromCart = async (productId, size, color) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // User is authenticated - use backend API
      try {
        const response = await cartAPI.removeFromCartAlt({
          product_id: productId,
          size: size,
          color: color
        });
        
        if (response.data.success) {
          await fetchCart(); // Refresh cart from backend
          return { success: true };
        } else {
          return { success: false, message: response.data?.message || 'Failed to remove item from cart' };
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        return { success: false, message: 'Error removing item from cart. Please try again.' };
      }
    } else {
      // User is not authenticated - use local storage
      removeFromLocalCart(productId, size, color);
      return { success: true };
    }
  };

  return (
    <CartContext.Provider value={{
      cartData, 
      setCartData, 
      totals, 
      setTotals, 
      fetchCart, 
      recalculateTotals, 
      clearCart, 
      updateCartData,
      addToCart,
      updateCartItem,
      removeFromCart,
      addToLocalCart,
      updateLocalCartItem,
      removeFromLocalCart,
      clearLocalCart,
      mergeLocalCartWithBackend
    }}>
      {children}
    </CartContext.Provider>
  );
} 