import React, { useState, useEffect, useRef  } from 'react';
import { Link } from "react-router-dom";

import logoDark from '../assets/images/logo.png';
import logoWhite from '../assets/images/Zyqora-light.png';
import logoLight from '../assets/images/Zyqora-light.png';
import product1 from '../assets/images/shop/trendy-shirt.jpg';
import product2 from '../assets/images/shop/luxurious-bag2.jpg';
import product3 from '../assets/images/shop/apple-smart-watch.jpg';
import client from '../assets/images/client/16.jpg';
import ctaImg from '../assets/images/cta.png';

import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
} from '../assets/icons/vander';

export default function Navbar({ navClass, navlight }) {
  let [scrolling, setScrolling] = useState(false);
  let [isToggle, setToggle] = useState(false);
  let [manu, setManu] = useState('');
  let [subManu, setSubManu] = useState('');
  let [isOpen, setIsOpen] = useState(false);
  let [cartManu, setCartManu] = useState(false);
  let [userManu, setUserManu] = useState(false);

  let dropdownRef = useRef(null);
  let cartRef = useRef(null);
  let userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolling = window.scrollY > 50;
      setScrolling(isScrolling);
    };

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const cartOutsideClick = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartManu(false);
      }
    };

    const userOutsideClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserManu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('click', cartOutsideClick);
    window.addEventListener('click', userOutsideClick);

    let current = window.location.pathname;
    setManu(current);
    setSubManu(current);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('click', cartOutsideClick);
      window.removeEventListener('click', userOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setToggle(!isToggle);
  };

  return (
    <nav id="topnav" className={`${navClass} ${scrolling ? 'nav-sticky' : ''}`}>
      <div className="container relative">
        {navlight === true ? (
          <Link className="logo" to="/">
            <span className="inline-block dark:hidden">
              <img src={logoDark} className="l-dark" alt="" />
              <img src={logoLight} className="l-light" alt="" />
            </span>
            <img src={logoLight} className="hidden dark:inline-block" alt="" />
          </Link>
        ) : (
          <Link className="logo" to="/">
            <div>
              <img src={logoDark} className="h-[22px] inline-block dark:hidden" alt="" />
              <img src={logoWhite} className="h-[22px] hidden dark:inline-block" alt="" />
            </div>
          </Link>
        )}

        <div className="menu-extras">
          <div className="menu-item">
            <Link
              className={`navbar-toggle ${isToggle ? 'open' : ''}`}
              id="isToggle"
              onClick={() => toggleMenu()}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>

        <ul className="buy-button list-none mb-0">
          {/* ←–– Search icon ––→ */}
          <li className="dropdown inline-block relative pe-1" ref={dropdownRef}>
            <button
              data-dropdown-toggle="dropdown"
              className="dropdown-toggle align-middle inline-flex search-dropdown"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {navlight === true ? (
                <>
                  <FiSearch className="size-5 dark-icon" />
                  <FiSearch className="size-5 white-icon text-white" />
                </>
              ) : (
                <FiSearch className="size-5" />
              )}
            </button>
            {isOpen && (
              <div
                className={`dropdown-menu absolute overflow-hidden end-0 m-0 mt-5 z-10 md:w-52 w-48 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800`}
              >
                <div className="relative">
                  <FiSearch className="absolute size-4 top-[9px] end-3 text-slate-900 dark:text-white" />
                  <input
                    type="text"
                    className="h-9 px-3 pe-10 w-full border-0 focus:ring-0 outline-none bg-white dark:bg-slate-900"
                    name="s"
                    id="searchItem"
                    placeholder="Search..."
                  />
                </div>
              </div>
            )}
          </li>

          {/* ←–– Cart icon (UPDATED >>> darker orange: #E65500) ––→ */}
          <li className="dropdown inline-block relative ps-0.5" ref={cartRef}>
            <button
              data-dropdown-toggle="dropdown"
              className="dropdown-toggle size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-[#E65500] border border-[#E65500] text-white"
              type="button"
              onClick={() => setCartManu(!cartManu)}
            >
              <FiShoppingCart className="h-4 w-4" />
            </button>
            {cartManu && (
              <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800">
                <ul className="py-3 text-start" aria-labelledby="dropdownDefault">
                  <li className="ms-0">
                    <Link to="#" className="flex items-center justify-between py-1.5 px-4">
                      <span className="flex items-center">
                        <img
                          src={product1}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">T-shirt (M)</span>
                          <span className="block text-sm text-slate-400">$320 X 2</span>
                        </span>
                      </span>

                      <span className="font-semibold">$640</span>
                    </Link>
                  </li>

                  <li className="ms-0">
                    <Link to="#" className="flex items-center justify-between py-1.5 px-4">
                      <span className="flex items-center">
                        <img
                          src={product2}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">Bag</span>
                          <span className="block text-sm text-slate-400">$50 X 5</span>
                        </span>
                      </span>

                      <span className="font-semibold">$250</span>
                    </Link>
                  </li>

                  <li className="ms-0">
                    <Link to="#" className="flex items-center justify-between py-1.5 px-4">
                      <span className="flex items-center">
                        <img
                          src={product3}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">Watch (Men)</span>
                          <span className="block text-sm text-slate-400">$800 X 1</span>
                        </span>
                      </span>

                      <span className="font-semibold">$800</span>
                    </Link>
                  </li>

                  <li className="border-t border-gray-100 dark:border-gray-800 my-2 ms-0"></li>

                  <li className="flex items-center justify-between py-1.5 px-4 ms-0">
                    <h6 className="font-semibold mb-0">Total($):</h6>
                    <h6 className="font-semibold mb-0">$1690</h6>
                  </li>

                  <li className="py-1.5 px-4 ms-0">
                    <span className="text-center block">
                      <Link
                        to="#"
                        className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-[#E65500] border border-[#E65500] text-white me-1"
                      >
                        View Cart
                      </Link>
                      <Link
                        to="#"
                        className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-[#E65500] border border-[#E65500] text-white"
                      >
                        Checkout
                      </Link>
                    </span>
                    <p className="text-sm text-slate-400 mt-1">*T&C Apply</p>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* ←–– Heart icon (UPDATED >>> darker orange: #E65500) ––→ */}
          <li className="inline-block ps-0.5">
            <Link
              to="#"
              className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-[#E65500] text-white"
            >
              <FiHeart data-feather="heart" className="h-4 w-4" />
            </Link>
          </li>

          {/* ←–– User avatar & dropdown ––→ */}
          <li className="dropdown inline-block relative ps-0.5" ref={userRef}>
            <button
              data-dropdown-toggle="dropdown"
              className="dropdown-toggle items-center"
              type="button"
              onClick={() => setUserManu(!userManu)}
            >
              <span className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full border border-[#E65500] bg-[#E65500] text-white">
                <img src={client} className="rounded-full" alt="" />
              </span>
            </button>
            {userManu && (
              <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-700">
                <ul className="py-2 text-start">
                  <li className="ms-0">
                    <p className="text-slate-400 pt-2 px-4">Welcome Guest!</p>
                  </li>

                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-[#E65500] dark:hover:text-white"
                    >
                      <FiUser className="h-4 w-4 me-2" />
                      Account
                    </Link>
                  </li>
                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-[#E65500] dark:hover:text-white"
                    >
                      <FiHelpCircle className="h-4 w-4 me-2" />
                      Helpcenter
                    </Link>
                  </li>
                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-[#E65500] dark:hover:text-white"
                    >
                      <FiSettings className="h-4 w-4 me-2" />
                      Settings
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                  <li className="ms-0">
                    <Link
                      to="/login"
                      className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-[#E65500] dark:hover:text-white"
                    >
                      <FiLogOut className="h-4 w-4 me-2" />
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>

        <div
          id="navigation"
          style={{ display: isToggle === true ? 'block' : 'none' }}
        >
          <ul className={`navigation-menu ${navlight === true ? 'nav-light' : ''}`}>
            <li
              className={`has-submenu parent-parent-menu-item ${
                ['/product-item'].includes(manu) ? 'active' : ''
              }`}
            >
              <Link
                to="#"
                onClick={() =>
                  setSubManu(setManu === '/product-item' ? '' : '/product-item')
                }
              >
                Products
              </Link>
              <span className="menu-arrow"></span>

              <ul
                className={`submenu megamenu ${
                  ['/product-item'].includes(subManu) ? 'open' : ''
                }`}
              >
                <li className="ms-0">
                  <ul>
                    <li className="megamenu-head ms-0">Men</li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        T-Shirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Shirt
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jeans
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Hoodies & Sweatshirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Shorts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jackets
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Boxers & Briefs
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Sport Jackets & Windbreakers
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Casual Shirts
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="ms-0">
                  <ul>
                    <li className="megamenu-head ms-0">Women</li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        T-Shirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jeans
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Hoodies & Sweatshirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Casual Dresses
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Formal & Evening Gowns
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Pants & Trousers
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Skirts (Mini, Midi, Maxi)
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jackets
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Tracksuits & Joggers
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="ms-0">
                  <ul>
                    <li className="megamenu-head ms-0">Kids</li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        T-Shirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jeans
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Polo Shirts
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Jackets
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Bodysuit
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Lounge Sets
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Rompers & Jumpsuits
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Coats & Parkas
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Shorts
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="ms-0">
                  <ul>
                    <li className="megamenu-head ms-0">Accessories</li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Smart Watch
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Shoes
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Socks
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Hat
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Sunglasses
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Belt
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Backpacks & Lunch Bags
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="#!" className="sub-menu-item">
                        Slippers
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="ms-0">
                  <ul>
                    <li className="megamenu-head">
                      <img src={ctaImg} alt="" />
                    </li>

                    <li className="text-center">
                      <Link
                        to="#!"
                        className="py-2 px-5 inline-block font-medium tracking-wide align-middle duration-500 text-base text-center bg-[#E65500]/10 text-[#E65500] rounded-md me-2 mt-2"
                      >
                        <i className="mdi mdi-cart-outline"></i> Shop Now
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className={`${manu === '/sale' ? 'active' : ''}`}>
              <Link to="#" className="sub-menu-item">
                Sale
              </Link>
            </li>
            <li className={`${manu === '/about-us' ? 'active' : ''}`}>
              <Link to="#" className="sub-menu-item">
                About Us
              </Link>
            </li>

            <li className={`${manu === '/contact' ? 'active' : ''}`}>
              <Link to="#" className="sub-menu-item">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
