import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import Tagline from "../../components/tagline";
import ScrollToTop from "../../components/scroll-to-top";
import heroVideo from '../../assets/videos/heroVideo6.mp4';
import { FiHeart, FiEye, FiBookmark } from '../../assets/icons/vander';
import { AiFillHeart } from 'react-icons/ai';

export default function Index() {
  const [collections, setCollections] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productRatings, setProductRatings] = useState({});

  const fetchCollections = async () => {
    const response = await axios.get('https://zyqora.onrender.com/api/categories?page=1&limit=5');
    console.log("fetchCollections :: ", response.data.data.categories);
    setCollections(response.data.data.categories);
  };

  const fetchNewProduct = async () => {
    const response = await axios.get('https://zyqora.onrender.com/api/products');
    console.log("fetchNewProduct :: ", response.data.data.products);
    setNewProduct(response.data.data.products);
  };

  useEffect(() => {
    fetchCollections();
    fetchNewProduct();
  }, []);

  // Load wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetch('https://zyqora.onrender.com/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.items)) {
            setWishlist(data.items.map(w => w._id || w.productId));
          }
        });
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(localWishlist.map(w => w._id));
    }
  }, []);

  const handleAddToWishlist = async (item) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      await fetch('https://zyqora.onrender.com/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: item._id })
      });
      setWishlist(prev => prev.includes(item._id) ? prev : [...prev, item._id]);
      alert('Added to wishlist!');
    } else {
      let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (!localWishlist.find(p => p._id === item._id)) {
        localWishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        setWishlist(prev => prev.includes(item._id) ? prev : [...prev, item._id]);
      }
      alert('Added to wishlist (local)!');
    }
  };

  // Fetch ratings for visible products
  useEffect(() => {
    async function fetchRatings() {
      const ratings = {};
      await Promise.all(newProduct.map(async (item) => {
        if (item._id) {
          const res = await fetch(`https://zyqora.onrender.com/api/reviews/${item._id}`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const avg = data.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / data.length;
            ratings[item._id] = { avg, count: data.length };
          } else {
            ratings[item._id] = { avg: 0, count: 0 };
          }
        }
      }));
      setProductRatings(ratings);
    }
    if (newProduct.length > 0) fetchRatings();
  }, [newProduct]);

  return (
    <>
      <Tagline />
      <Navbar navClass="defaultscroll is-sticky tagline-height" />

      {/* Hero Section with video background */}
      <section className="relative flex items-center w-full md:h-screen py-36 overflow-hidden" role="banner">
        {/* Video as full-bleed background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback if video cannot play */}
          Your browser does not support the video tag.
        </video>

        {/* Overlay to slightly darken video if needed */}
        <div className="absolute inset-0 bg-emerald-500/5"></div>

        {/* Content on top of video */}
        <div className="container relative z-10">
          <div className="grid grid-cols-1 justify-center text-center">
            <span className="uppercase font-semibold text-lg text-white">
              New Collection
            </span>
            <h4 className="mt-3 text-4xl font-bold md:text-6xl md:leading-normal leading-normal text-white">
              The Gift Suite
            </h4>
            <p className="mt-2 text-lg text-white">
              Our latest collection of essential basics.
            </p>

            <div className="mt-6">
              <Link
                to="#"
                className="inline-block w-max px-5 py-2 font-semibold tracking-wide text-center text-white bg-slate-900 dark:bg-orange-500 rounded-md"
              >
                Shop Now <i className="mdi mdi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="relative py-16 md:py-24" role="main">
        <div className="container relative" role="region" aria-label="Shop The Collections">
          <div className="grid grid-cols-1 justify-center mb-6 text-center">
            <h5 className="mb-4 text-3xl font-semibold leading-normal">
              Shop The Collections
            </h5>
            <p className="max-w-xl mx-auto text-slate-500 text-xl">
              Shop the latest products from the most popular collections
            </p>
          </div>

          <div className="grid gap-6 pt-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-2">
            {collections.map((item, index) => (
              <Link
                to=""
                className="text-center hover:text-orange-500"
                key={index}
              >
                <img
                  src={item.image}
                  className="w-40 h-40 rounded-full shadow dark:shadow-gray-800"
                  alt={item.name}
                />
                <span className="block mt-3 text-xl font-medium">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* New Arrival Products */}
        <div className="container relative mt-16 md:mt-24" role="region" aria-label="New Arrival Products">
          <div className="grid grid-cols-1 justify-center mb-6 text-center">
            <h5 className="mb-4 text-3xl font-semibold leading-normal">
              New Arrival Products
            </h5>
            <p className="max-w-xl mx-auto text-slate-500 text-xl">
              Shop the latest products from the most popular collections
            </p>
          </div>

          <div className="grid gap-6 pt-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {newProduct.slice(0, 12).map((item, index) => (
              <div className="group" key={index}>
                <div className="relative overflow-hidden rounded-md shadow dark:shadow-gray-800 duration-500 group-hover:shadow-lg group-hover:dark:shadow-gray-800">
                  <img
                    src={item.image}
                    className="w-full h-64 object-cover duration-500 group-hover:scale-110"
                    alt={item.name}
                  />

                  <div className="absolute bottom-[-5rem] start-3 end-3 duration-500 group-hover:bottom-3">
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                        if (!token) {
                          window.location.href = '/login';
                          return;
                        }
                        // Call add to cart API
                        await fetch('https://zyqora.onrender.com/api/cart/add', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            product_id: item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: 1
                          })
                        });
                        window.location.href = '/shop-cart';
                      }}
                      className="inline-block w-full px-5 py-2 text-base font-semibold text-white bg-slate-900 rounded-md tracking-wide align-middle duration-500 text-center"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <ul className="absolute top-[10px] end-4 space-y-1 opacity-0 duration-500 group-hover:opacity-100 list-none">
                    <li>
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full shadow duration-500 border-none focus:outline-none ${wishlist.includes(item._id) ? 'bg-red-100 text-red-500' : 'bg-white text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                        onClick={async (e) => {
                          e.preventDefault();
                          handleAddToWishlist(item);
                        }}
                      >
                        {wishlist.includes(item._id) ? (
                          <AiFillHeart className="w-4 h-4" color="#ef4444" />
                        ) : (
                          <FiHeart className="w-4 h-4" />
                        )}
                      </button>
                    </li>
                    <li>
                      <Link
                        to={`/product-detail-one/${item._id}`}
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        to="#"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiBookmark className="w-4 h-4" />
                      </Link>
                    </li> */}
                  </ul>

                  <ul className="absolute top-[10px] start-4 list-none">
                    {item.offer === true && (
                      <li>
                        <Link
                          to="#"
                          className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-orange-600 rounded h-5"
                        >
                          {item.tag}
                        </Link>
                      </li>
                    )}
                    {item.tag === "New" && (
                      <li>
                        <Link
                          to="#"
                          className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded h-5"
                        >
                          {item.tag}
                        </Link>
                      </li>
                    )}
                    {item.tag === "Featured" && (
                      <li>
                        <Link
                          to="#"
                          className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-emerald-600 rounded h-5"
                        >
                          {item.tag}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/product-detail-one/${item.id}`}
                    className="block text-lg font-medium hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center justify-between mt-1">
                    <p>
                      ${item.price}{" "}
                      {/* <del className="text-slate-400">{item.price}</del> */}
                    </p>
                    <ul className="font-medium text-amber-400 list-none">
                      {[1,2,3,4,5].map(n => (
                        <li className="inline" key={n}>
                          <i className={`mdi mdi-star${(productRatings[item._id]?.avg || 0) >= n ? '' : '-outline'}`}></i>
                        </li>
                      ))}
                      <span className="text-slate-400 ms-2 text-sm align-middle">{productRatings[item._id]?.avg ? productRatings[item._id].avg.toFixed(1) : '0.0'} ({productRatings[item._id]?.count || 0})</span>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Switcher />
      <ScrollToTop />
    </>
  );
}
