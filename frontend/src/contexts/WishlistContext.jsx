import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Function to refresh wishlist from API or localStorage
  const refreshWishlist = useCallback(async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const res = await wishlistAPI.getWishlist();
        if (res.data && Array.isArray(res.data.items)) {
          setWishlist(res.data.items.map(w => w._id || w.productId));
        }
      } catch (error) {
        setWishlist([]);
      }
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(localWishlist.map(w => w._id));
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
} 