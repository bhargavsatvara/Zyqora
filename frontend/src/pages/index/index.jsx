import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import { productsAPI, wishlistAPI, cartAPI, reviewsAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import Footer from "../../components/footer";
import Tagline from "../../components/tagline";
import ScrollToTop from "../../components/scroll-to-top";
import heroVideo from '../../assets/videos/heroVideo6.mp4';
import { FiHeart, FiEye, FiBookmark } from '../../assets/icons/vander';
import { AiFillHeart } from 'react-icons/ai';
import levisLogo from '../../assets/images/brand/levis-logo-brand.png';
import ralphLogo from '../../assets/images/brand/ralph-lauren-brand.png';
import nikeLogo from '../../assets/images/brand/nike-logo.png';
import mensWare from '../../assets/images/categories/mens-ware.jpg';
import womenWare from '../../assets/images/categories/ladies-ware.jpg';
import kidsWare from '../../assets/images/categories/kids-ware.jpg';
import footwear from '../../assets/images/categories/chappal-shoes.jpg';
import accessories from '../../assets/images/categories/accessories.jpg'; 
import vansLogo from '../../assets/images/brand/vans-brand.png';
import hugoLogo from '../../assets/images/brand/hugo-boss.png';
import uniqloLogo from '../../assets/images/brand/uniqlo-logo.png';
import pradaLogo from '../../assets/images/brand/prada-brand-logo.png';
import converseLogo from '../../assets/images/brand/Converse-logo.png';
import addidasLogo from '../../assets/images/brand/adidas-logo.png';
import zaraLogo from '../../assets/images/brand/zara-logo.png';
import hmLogo from '../../assets/images/brand/hm-logo.png'; 
import gucciLogo from '../../assets/images/brand/gucci-brand-logo.png';

// Static categories with images
const staticCategories = [
  {
    id: 1,
    name: "Men's Fashion",
    image: mensWare,
    link: "/products?department_id=men"
  },
  {
    id: 2,  
    name: "Women's Fashion",
    image: womenWare,
    link: "/products?department_id=women"
  },
  {
    id: 3,
    name: "Kids & Baby",
    image: kidsWare,
    link: "/products?department_id=kids"
  },
  {
    id: 4,
    name: "Footwear",
    image: footwear,
    link: "/products?category_id=footwear"
  },
  {
    id: 5,
    name: "Accessories",
    image: accessories,
    link: "/products?category_id=accessories"
  }
];

export default function Index() {
  const { showSuccess, showError } = useToast();
  const [collections] = useState(staticCategories); // Use static categories
  const [newProduct, setNewProduct] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchNewProduct = async () => {
    try {
      const response = await productsAPI.getProducts();
      console.log("fetchNewProduct :: ", response.data.data.products);
      setNewProduct(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setNewProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProduct();
  }, []);

  // Load wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      wishlistAPI.getWishlist()
        .then(res => {
          if (res.data && Array.isArray(res.data.items)) {
            setWishlist(res.data.items.map(w => w._id || w.productId));
          }
        })
        .catch(error => {
          console.error('Error fetching wishlist:', error);
        });
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(localWishlist.map(w => w._id));
    }
  }, []);

  const handleAddToWishlist = async (item) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        await wishlistAPI.addToWishlistAlt({ productId: item._id });
        setWishlist(prev => prev.includes(item._id) ? prev : [...prev, item._id]);
        showSuccess('Added to wishlist!');
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        showError('Failed to add to wishlist');
      }
    } else {
      let localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (!localWishlist.find(p => p._id === item._id)) {
        localWishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        setWishlist(prev => prev.includes(item._id) ? prev : [...prev, item._id]);
      }
      showSuccess('Added to wishlist!');
    }
  };

  // Fetch ratings for visible products
  useEffect(() => {
    async function fetchRatings() {
      const ratings = {};
      await Promise.all(newProduct.map(async (item) => {
        if (item._id) {
          try {
            const res = await reviewsAPI.getProductReviews(item._id);
            const data = res.data;
            if (Array.isArray(data) && data.length > 0) {
              const avg = data.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / data.length;
              ratings[item._id] = { avg, count: data.length };
            } else {
              ratings[item._id] = { avg: 0, count: 0 };
            }
          } catch (error) {
            ratings[item._id] = { avg: 0, count: 0 };
          }
        }
      }));
      setProductRatings(ratings);
    }
    if (newProduct.length > 0) fetchRatings();
  }, [newProduct]);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  );

  // Loading skeleton for collections
  const CollectionsSkeleton = () => (
    <div className="grid gap-6 pt-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="text-center animate-pulse">
          <div className="w-40 h-40 rounded-full bg-gray-200 mx-auto"></div>
          <div className="mt-3 h-6 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      ))}
    </div>
  );

  // Loading skeleton for products
  const ProductsSkeleton = () => (
    <div className="grid gap-6 pt-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="group animate-pulse">
          <div className="relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
            <div className="w-full h-64 bg-gray-200"></div>
          </div>
          <div className="mt-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="flex items-center justify-between mt-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
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
                  to="/products"
                  className="inline-block w-max px-5 py-2 font-semibold tracking-wide text-center text-white bg-slate-900 dark:bg-orange-500 rounded-md"
                >
                  Shop Now <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section with Loading Skeleton */}
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
            <CollectionsSkeleton />
          </div>

          {/* New Arrival Products with Loading Skeleton */}
          <div className="container relative mt-16 md:mt-24" role="region" aria-label="New Arrival Products">
            <div className="grid grid-cols-1 justify-center mb-6 text-center">
              <h5 className="mb-4 text-3xl font-semibold leading-normal">
                New Arrival Products
              </h5>
              <p className="max-w-xl mx-auto text-slate-500 text-xl">
                Shop the latest products from the most popular collections
              </p>
            </div>
            <ProductsSkeleton />
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </>
    );
  }

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
                to="/products"
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
              <div
                className="text-center hover:text-orange-500 transition-colors duration-300 flex flex-col items-center"
                key={item.id}
              >
                <img
                  src={item.image}
                  className="w-40 h-40 rounded-full shadow dark:shadow-gray-800 hover:scale-105 transition-transform duration-300 object-cover"
                  alt={item.name}
                />
                <span className="block mt-3 text-xl font-medium text-center w-full">
                  {item.name}
                </span>
              </div>
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
                    <Link
                      to={`/product-detail-one/${item._id}`}
                      className="inline-block w-full px-5 py-2 text-base font-semibold text-white bg-slate-900 rounded-md tracking-wide align-middle duration-500 text-center"
                    >
                      View Details
                    </Link>
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
                    to={`/product-detail-one/${item._id}`}
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

      {/* Brands Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden" role="main">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="container relative z-10" role="region" aria-label="Featured Brands">
          <div className="grid grid-cols-1 justify-center mb-16 text-center">
            
            <h5 className="mb-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Featured Brands
            </h5>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Discover premium brands that define style and quality. Each brand represents excellence in fashion and innovation.
            </p>
          </div>

          <div className="grid gap-8 pt-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
            {/* Levi's */}
            <div className="group text-center animate-fade-in-up">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={levisLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Levi's"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Levi's
                </h6>
              </div>
            </div>

            {/* Nike */}
            <div className="group text-center animate-fade-in-up animation-delay-100">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                    src={nikeLogo}
                    className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Nike"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Nike
                </h6>
              </div>
            </div>

            {/* Adidas */}
            <div className="group text-center animate-fade-in-up animation-delay-200">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={addidasLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Adidas"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Adidas
                </h6>
              </div>
            </div>

            {/* Ralph Lauren */}
            <div className="group text-center animate-fade-in-up animation-delay-300">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={ralphLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Ralph Lauren"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Ralph Lauren
                </h6>
              </div>
            </div>

            {/* Vans */}
            <div className="group text-center animate-fade-in-up animation-delay-400">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={vansLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Vans"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Vans
                </h6>
              </div>
            </div>

            {/* Hugo Boss */}
            <div className="group text-center animate-fade-in-up animation-delay-500">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={hugoLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Hugo Boss"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Hugo Boss
                </h6>
              </div>
            </div>

            {/* Zara */}
            <div className="group text-center animate-fade-in-up animation-delay-600">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={zaraLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Zara"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Zara
                </h6>
              </div>
            </div>

            {/* H&M */}
            <div className="group text-center animate-fade-in-up animation-delay-700">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={hmLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="H&M"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  H&M
                </h6>
              </div>
            </div>

            {/* Uniqlo */}
            <div className="group text-center animate-fade-in-up animation-delay-800">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                    src={uniqloLogo}
                    className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Uniqlo"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Uniqlo
                </h6>
              </div>
            </div>

            {/* Gucci */}
            <div className="group text-center animate-fade-in-up animation-delay-900">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={gucciLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Gucci"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Gucci
                </h6>
              </div>
            </div>

            {/* Prada */}
            <div className="group text-center animate-fade-in-up animation-delay-1000">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={pradaLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Prada"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Prada
                </h6>
              </div>
            </div>

            {/* Converse */}
            <div className="group text-center animate-fade-in-up animation-delay-1100">
              <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-300 dark:hover:border-orange-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <img
                  src={converseLogo}
                  className="relative w-full h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:brightness-110"
                  alt="Converse"
                />
                <h6 className="relative mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Converse
                </h6>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
}
