import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { wishlistAPI } from '../services/api';
import { useWishlist } from '../contexts/WishlistContext';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshWishlist } = useWishlist();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await wishlistAPI.getWishlist();
          if (Array.isArray(res.data.items)) {
            setItems(res.data.items);
          } else {
            setItems([]);
          }
        } catch (err) {
          setError('Failed to fetch wishlist');
        }
      } else {
        // Not logged in: get from localStorage
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setItems(wishlist);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  // Remove from local wishlist (for guest users)
  const removeFromLocalWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => (item._id || item) !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setItems(wishlist);
  };

  return (
    <>
      <Navbar navClass="defaultscroll is-sticky" role="navigation" />
      <section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800" role="banner">
        <div className="container relative">
          <div className="grid grid-cols-1 mt-14">
            <h3 className="text-3xl leading-normal font-semibold">My Wishlist</h3>
          </div>
          <div className="relative mt-3">
            <ul className="tracking-[0.5px] mb-0 inline-block">
              <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
              <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
              <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Wishlist</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="relative md:py-24 py-16" role="main">
        <div className="container relative">
          {loading ? (
            <div className="flex items-center justify-center py-20" role="status">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-20" role="status">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Your wishlist is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to your wishlist to get started.</p>
              <Link to="/products" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-1">
              <div className="relative overflow-x-auto shadow dark:shadow-gray-800 rounded-md" role="region" aria-label="Wishlist Table">
                <table className="w-full text-start" role="table">
                  <thead className="text-sm uppercase bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th scope="col" className="p-4 w-4"></th>
                      <th scope="col" className="text-start p-4 min-w-[220px]">Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800" key={item._id || item}>
                        <td className="p-4">
                          <button
                            onClick={async () => {
                              // Remove from backend or localStorage
                              const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                              if (token) {
                                try {
                                  await wishlistAPI.removeFromWishlistAlt(item._id || item);
                                  setItems(items.filter(i => (i._id || i) !== (item._id || item)));
                                  await refreshWishlist();
                                } catch (error) {
                                  console.error('Error removing from wishlist:', error);
                                }
                              } else {
                                removeFromLocalWishlist(item._id || item);
                                await refreshWishlist();
                              }
                            }}
                            className="transition-colors text-red-600 hover:text-red-800"
                            title="Remove item"
                          >
                            <i className="mdi mdi-window-close"></i>
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center">
                            {/* If logged in, item is a productId; if not, item is a product object */}
                            {typeof item === 'string' ? (
                              <span>Product ID: {item}</span>
                            ) : (
                              <>
                                <img src={item.image} className="rounded shadow dark:shadow-gray-800 w-12 h-12 object-cover" alt={item.name} />
                                <span className="ms-3">
                                  <span className="block font-semibold">{item.name}</span>
                                </span>
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Link to="/products" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white mt-2">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
} 