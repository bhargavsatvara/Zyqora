import React, { createContext, useContext, useState, useEffect } from "react";
import { wishlistAPI } from "../services/api";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch wishlist from backend on mount and when auth token changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (initialized) {
        fetchWishlist();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Only fetch on mount, not on every render
    if (!initialized) {
      fetchWishlist();
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initialized]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Fetch from API for authenticated users
        const response = await wishlistAPI.getWishlist();
        const data = response.data;
        if (data && Array.isArray(data.items)) {
          setWishlist(data.items.map(w => w._id || w.productId));
        } else {
          setWishlist([]);
        }
      } else {
        // Load from localStorage for guest users
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(localWishlist.map(w => w._id));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const addToWishlist = async (product) => {
    try {
      // Optimistic update - update UI immediately
      setWishlist(prev => {
        if (prev.includes(product._id)) {
          return prev; // Already in wishlist
        }
        return [...prev, product._id];
      });

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Add to API for authenticated users
        await wishlistAPI.addToWishlistAlt({ productId: product._id });
      } else {
        // Add to localStorage for guest users
        let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!localWishlist.find(p => p._id === product._id)) {
          localWishlist.push(product);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        }
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert optimistic update on error
      setWishlist(prev => prev.filter(id => id !== product._id));
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // Optimistic update - update UI immediately
      setWishlist(prev => prev.filter(id => id !== productId));

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Remove from API for authenticated users
        await wishlistAPI.removeFromWishlistAlt(productId);
      } else {
        // Remove from localStorage for guest users
        let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        localWishlist = localWishlist.filter(p => p._id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
      }
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Revert optimistic update on error
      setWishlist(prev => [...prev, productId]);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
} 