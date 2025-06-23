import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoDark from "../assets/images/logo.png";
import logoWhite from "../assets/images/logo.png";
import logoLight from "../assets/images/logo.png";
import product1 from "../assets/images/shop/trendy-shirt.jpg";
import product2 from "../assets/images/shop/luxurious-bag2.jpg";
import product3 from "../assets/images/shop/apple-smart-watch.jpg";
import client from "../assets/images/client/16.jpg";
import ctaImg from "../assets/images/cta.png";

import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiHelpCircle,
  FiSettings,
  FiLogIn,
  FiLogOut,
} from "../assets/icons/vander";

export default function Navbar({ navClass, navlight }) {
  const [scrolling, setScrolling] = useState(false);
  const [isToggle, setToggle] = useState(false);
  const [manu, setManu] = useState("");
  const [subManu, setSubManu] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cartManu, setCartManu] = useState(false);
  const [userManu, setUserManu] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const userRef = useRef(null);

  // Handle scroll & outside clicks
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartManu(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserManu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleOutsideClick);

    // initialize menu based on current path
    const current = window.location.pathname;
    setManu(current);
    setSubManu(current);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (token && user) {
      setIsAuthenticated(true);
      try {
        setUserName(JSON.parse(user).name);
      } catch {
        setUserName("");
      }
    }
  }, []);

  const toggleMenu = () => {
    setToggle(!isToggle);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("");
    navigate("/login");
  };

  return (
    <nav id="topnav" className={`${navClass} ${scrolling ? "nav-sticky" : ""}`}>
      <div className="container relative">

        {navlight === true ? (
          <Link className="logo" to="/">
            <span className="inline-block dark:hidden">
              <img
                src={logoDark}
                className="h-[22px] l-dark"
                alt="Zyqora Logo Dark"
              />
              <img
                src={logoLight}
                className="h-[22px] l-light"
                alt="Zyqora Logo Light"
              />
            </span>
            <img
              src={logoLight}
              className="h-[22px] hidden dark:inline-block"
              alt="Zyqora Logo Light"
            />
          </Link>
        ) : (
          <Link className="logo" to="/">
            <div>
              <img
                src={logoDark}
                className="h-[22px] inline-block dark:hidden"
                alt="Zyqora Logo Dark"
              />
              <img
                src={logoWhite}
                className="h-[22px] hidden dark:inline-block"
                alt="Zyqora Logo Light"
              />
            </div>
          </Link>
        )}

        <div className="menu-extras">
          <div className="menu-item">
            <Link
              className={`navbar-toggle ${isToggle ? "open" : ""}`}
              onClick={toggleMenu}
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
          {/* Search */}
          <li className="dropdown inline-block relative pe-1" ref={dropdownRef}>
            <button
              className="dropdown-toggle align-middle inline-flex search-dropdown"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FiSearch className="size-5"></FiSearch>
            </button>
            {isOpen && (
              <div className="dropdown-menu absolute overflow-hidden end-0 m-0 mt-5 z-10 md:w-52 w-48 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800">
                <div className="relative">
                  <FiSearch className="absolute size-4 top-[9px] end-3 text-slate-900 dark:text-white"></FiSearch>
                  <input
                    type="text"
                    className="h-9 px-3 pe-10 w-full border-0 focus:ring-0 outline-none bg-white dark:bg-slate-900"
                    placeholder="Search..."
                  />
                </div>
              </div>
            )}
          </li>

          {/* Cart */}
          <li className="dropdown inline-block relative ps-0.5" ref={cartRef}>
            <button
              className="dropdown-toggle size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-orange-500 border border-orange-500 text-white"
              type="button"
              onClick={() => setCartManu(!cartManu)}
            >
              <FiShoppingCart className="h-4 w-4"></FiShoppingCart>
            </button>
            {cartManu && (
              <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800">
                <ul className="py-3 text-start">
                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center justify-between py-1.5 px-4"
                    >
                      <span className="flex items-center">
                        <img
                          src={product1}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">
                            T-shirt (M)
                          </span>
                          <span className="block text-sm text-slate-400">
                            $320 X 2
                          </span>
                        </span>
                      </span>
                      <span className="font-semibold">$640</span>
                    </Link>
                  </li>

                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center justify-between py-1.5 px-4"
                    >
                      <span className="flex items-center">
                        <img
                          src={product2}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">Bag</span>
                          <span className="block text-sm text-slate-400">
                            $50 X 5
                          </span>
                        </span>
                      </span>
                      <span className="font-semibold">$250</span>
                    </Link>
                  </li>

                  <li className="ms-0">
                    <Link
                      to="#"
                      className="flex items-center justify-between py-1.5 px-4"
                    >
                      <span className="flex items-center">
                        <img
                          src={product3}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt=""
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">
                            Watch (Men)
                          </span>
                          <span className="block text-sm text-slate-400">
                            $800 X 1
                          </span>
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
                        className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-orange-500 border border-orange-500 text-white me-1"
                      >
                        View Cart
                      </Link>
                      <Link
                        to="#"
                        className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-orange-500 border border-orange-500 text-white"
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

          {/* Wishlist */}
          <li className="inline-block ps-0.5">
            <Link
              to="#"
              className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-orange-500 text-white"
            >
              <FiHeart className="h-4 w-4"></FiHeart>
            </Link>
          </li>

          {/* User Dropdown */}
          <li className="dropdown inline-block relative ps-0.5" ref={userRef}>
            <button
              className="dropdown-toggle items-center"
              type="button"
              onClick={() => setUserManu(!userManu)}
            >
              <span className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full border border-orange-500 bg-orange-500 text-white">
                {isAuthenticated ? (
                  <span className="font-medium">{userName.charAt(0)}</span>
                ) : (
                  <img src={client} className="rounded-full" alt="" />
                )}
              </span>
            </button>
            {userManu && (
              <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-700">
                <ul className="py-2 text-start">
                  <li className="px-4 py-2 text-slate-400">
                    {isAuthenticated ? `Welcome ${userName}!` : "Welcome Guest!"}
                  </li>

                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          to="/user-account"
                          className="flex items-center font-medium py-2 px-4 hover:text-orange-500"
                        >
                          <FiUser className="h-4 w-4 me-2" /> Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/helpcenter"
                          className="flex items-center font-medium py-2 px-4 hover:text-orange-500"
                        >
                          <FiHelpCircle className="h-4 w-4 me-2" /> Helpcenter
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/user-setting"
                          className="flex items-center font-medium py-2 px-4 hover:text-orange-500"
                        >
                          <FiSettings className="h-4 w-4 me-2" /> Settings
                        </Link>
                      </li>
                      <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center font-medium w-full py-2 px-4 hover:text-orange-500"
                        >
                          <FiLogOut className="h-4 w-4 me-2" /> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center font-medium py-2 px-4 hover:text-orange-500"
                      >
                        <FiLogIn className="h-4 w-4 me-2" /> Login
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>
        </ul>

        <div
          id="navigation"
          style={{ display: isToggle === true ? "block" : "none" }}
        >
          <ul
            className={`navigation-menu ${
              navlight === true ? "nav-light" : ""
            }`}
          >
            <li
              className={`has-submenu parent-parent-menu-item ${
                ["/product-item"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                to="#"
                onClick={() =>
                  setSubManu(setManu === "/product-item" ? "" : "/product-item")
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
                        to="/shop-grid-left-sidebar"
                        className="py-2 px-5 inline-block font-medium tracking-wide align-middle duration-500 text-base text-center bg-[#E65500]/10 text-[#E65500] rounded-md me-2 mt-2"
                      >
                        <i className="mdi mdi-cart-outline"></i> Shop Now
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

         

            <li
              className={`has-submenu parent-parent-menu-item ${
                [
                  "/aboutus",
                  "/user-account",
                  "/user-billing",
                  "/user-payment",
                  "/user-invoice",
                  "/user-social",
                  "/user-notification",
                  "/user-setting",
                  "/page-item",
                  "/user-item",
                  "/email-item",
                  "/email-confirmation",
                  "/email-cart",
                  "/email-offers",
                  "/email-order-success",
                  "/email-gift-voucher",
                  "/email-reset-password",
                  "/email-item-review",
                  "/blog-item",
                  "/blogs",
                  "/blog-detail",
                  "/help-item",
                  "/helpcenter",
                  "/helpcenter-faqs",
                  "/helpcenter-guides",
                  "/helpcenter-support",
                  "/auth-item",
                  "/login",
                  "/signup",
                  "/forgot-password",
                  "/lock-screen",
                  "/utility-item",
                  "/terms",
                  "/privacy",
                  "/comingsoon",
                  "/maintenance",
                  "/error",
                  "/special-item",
                  "/multi-item",
                  "/multi-item2",
                  "/multi-item3",
                  "/career",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="/aboutus"
                onClick={() =>
                  setSubManu(setManu === "/page-item" ? "" : "/page-item")
                }
              >
                About Us
              </Link>
              <span className="menu-arrow"></span>
              <ul
                className={`submenu ${
                  [
                    "/aboutus",
                    "/user-account",
                    "/user-billing",
                    "/user-payment",
                    "/user-invoice",
                    "/user-social",
                    "/user-notification",
                    "/user-setting",
                    "/page-item",
                    "/user-item",
                    "/email-item",
                    "/email-confirmation",
                    "/email-cart",
                    "/email-offers",
                    "/email-order-success",
                    "/email-gift-voucher",
                    "/email-reset-password",
                    "/email-item-review",
                    "/blog-item",
                    "/blogs",
                    "/blog-detail",
                    "/help-item",
                    "/helpcenter",
                    "/helpcenter-faqs",
                    "/helpcenter-guides",
                    "/helpcenter-support",
                    "/auth-item",
                    "/login",
                    "/signup",
                    "/forgot-password",
                    "/lock-screen",
                    "/utility-item",
                    "/terms",
                    "/privacy",
                    "/comingsoon",
                    "/maintenance",
                    "/error",
                    "/special-item",
                    "/multi-item",
                    "/multi-item2",
                    "/multi-item3",
                    "/career",
                  ].includes(subManu)
                    ? "open"
                    : ""
                }`}
              >
               

            

             

                <li
                  className={`has-submenu parent-menu-item ms-0 ${
                    ["/blogs", "/blog-detail", "/blog-item"].includes(manu)
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="#"
                    onClick={() =>
                      setSubManu(setManu === "/blog-item" ? "" : "/blog-item")
                    }
                  >
                    {" "}
                    Blog{" "}
                  </Link>
                  <span className="submenu-arrow"></span>
                  <ul
                    className={`submenu ${
                      ["/blogs", "/blog-detail", "/blog-item"].includes(subManu)
                        ? "open"
                        : ""
                    }`}
                  >
                    <li className={`ms-0 ${manu === "/blogs" ? "active" : ""}`}>
                      <Link to="/blogs" className="sub-menu-item">
                        {" "}
                        Blogs
                      </Link>
                    </li>
                    <li
                      className={`ms-0 ${
                        manu === "/blog-detail" ? "active" : ""
                      }`}
                    >
                      <Link to="/blog-detail" className="sub-menu-item">
                        {" "}
                        Blog Detail
                      </Link>
                    </li>
                  </ul>
                </li>

            

                <li
                  className={`has-submenu parent-menu-item ms-0 ${
                    [
                      "/helpcenter",
                      "/helpcenter-faqs",
                      "/helpcenter-guides",
                      "/helpcenter-support",
                      "/help-item",
                    ].includes(manu)
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="#"
                    onClick={() =>
                      setSubManu(setManu === "/help-item" ? "" : "/help-item")
                    }
                  >
                    {" "}
                    Helpcenter{" "}
                  </Link>
                  <span className="submenu-arrow"></span>
                  <ul
                    className={`submenu ${
                      [
                        "/helpcenter",
                        "/helpcenter-faqs",
                        "/helpcenter-guides",
                        "/helpcenter-support",
                        "/help-item",
                      ].includes(subManu)
                        ? "open"
                        : ""
                    }`}
                  >
                    <li
                      className={`ms-0 ${
                        manu === "/helpcenter" ? "active" : ""
                      }`}
                    >
                      <Link to="/helpcenter" className="sub-menu-item">
                        Overview
                      </Link>
                    </li>
                    <li
                      className={`ms-0 ${
                        manu === "/helpcenter-faqs" ? "active" : ""
                      }`}
                    >
                      <Link to="/helpcenter-faqs" className="sub-menu-item">
                        FAQs
                      </Link>
                    </li>
                    <li
                      className={`ms-0 ${
                        manu === "/helpcenter-guides" ? "active" : ""
                      }`}
                    >
                      <Link to="/helpcenter-guides" className="sub-menu-item">
                        Guides
                      </Link>
                    </li>
                    <li
                      className={`ms-0 ${
                        manu === "/helpcenter-support" ? "active" : ""
                      }`}
                    >
                      <Link to="/helpcenter-support" className="sub-menu-item">
                        Support
                      </Link>
                    </li>
                  </ul>
                </li>

           

                <li
                  className={`has-submenu parent-menu-item ms-0 ${
                    ["/terms", "/privacy", "/utility-item"].includes(manu)
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="#"
                    onClick={() =>
                      setSubManu(
                        setManu === "/utility-item" ? "" : "/utility-item"
                      )
                    }
                  >
                    {" "}
                    Utility{" "}
                  </Link>
                  <span className="submenu-arrow"></span>
                  <ul
                    className={`submenu ${
                      ["/terms", "/privacy", "/utility-item"].includes(subManu)
                        ? "open"
                        : ""
                    }`}
                  >
                    <li className={`ms-0 ${manu === "/terms" ? "active" : ""}`}>
                      <Link to="/terms" className="sub-menu-item">
                        Terms of Services
                      </Link>
                    </li>
                    <li
                      className={`ms-0 ${manu === "/privacy" ? "active" : ""}`}
                    >
                      <Link to="/privacy" className="sub-menu-item">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={`has-submenu parent-menu-item ms-0 ${
                    [
                      "/comingsoon",
                      "/maintenance",
                      "/error",
                      "/special-item",
                    ].includes(manu)
                      ? "active"
                      : ""
                  }`}
                >
                  <Link
                    to="#"
                    onClick={() =>
                      setSubManu(
                        setManu === "/special-item" ? "" : "/special-item"
                      )
                    }
                  >
                    {" "}
                    Special{" "}
                  </Link>
                  <span className="submenu-arrow"></span>
                  <ul
                    className={`submenu ${
                      [
                        "/comingsoon",
                        "/maintenance",
                        "/error",
                        "/special-item",
                      ].includes(subManu)
                        ? "open"
                        : ""
                    }`}
                  >
                    <li className="ms-0">
                      <Link to="/comingsoon" className="sub-menu-item">
                        {" "}
                        Coming Soon
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="/maintenance" className="sub-menu-item">
                        {" "}
                        Maintenance
                      </Link>
                    </li>
                    <li className="ms-0">
                      <Link to="/error" className="sub-menu-item">
                        {" "}
                        404!
                      </Link>
                    </li>
                  </ul>
                </li>

           
              </ul>
            </li>

            <li className={`${manu === "/sale" ? "active" : ""}`}>
              <Link to="/sale" className="sub-menu-item">
                Sale
              </Link>
            </li>

            <li className={`${manu === "/contact" ? "active" : ""}`}>
              <Link to="/contact" className="sub-menu-item">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
