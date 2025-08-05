import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { departmentsAPI, categoriesAPI, wishlistAPI } from "../services/api";
import logoDark from "../assets/images/logo.png";
import logoWhite from "../assets/images/logo.png";
import logoLight from "../assets/images/logo.png";
import client from "../assets/images/client/16.jpg";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiHelpCircle,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "../assets/icons/vander";
import { useCart } from "../contexts/CartContext";

export default function Navbar({ navClass, navlight }) {
  const [scrolling, setScrolling] = useState(false);
  const [isToggle, setToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartManu, setCartManu] = useState(false);
  const [userManu, setUserManu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const userRef = useRef(null);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await departmentsAPI.getDepartments();
        const data = res.data;
        setDepartments(data || []);
      } catch (e) {
        console.error("Error fetching departments:", e);
      } finally {
        setLoadingDepartments(false);
      }
    }
    fetchDepartments();
  }, []);

  // --- CATEGORY DROPDOWN STATE ---
  const [hoveredDept, setHoveredDept] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [departmentCategories, setDepartmentCategories] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const dropdownTimeout = useRef(null);

  // Fetch categories for a specific department
  const fetchCategoriesForDepartment = async (departmentId) => {
    if (departmentCategories[departmentId]) {
      return departmentCategories[departmentId]; // Return cached categories
    }

    try {
      setLoadingCategories(true);
      const res = await categoriesAPI.getCategories({ department_id: departmentId, limit: 1000 });
      const data = res.data;

      // Handle different response structures
      let categoriesData = [];
      if (data.data && data.data.categories) {
        categoriesData = data.data.categories;
      } else if (data.categories) {
        categoriesData = data.categories;
      } else if (Array.isArray(data)) {
        categoriesData = data;
      }

      // Cache the categories for this department
      setDepartmentCategories(prev => ({
        ...prev,
        [departmentId]: categoriesData
      }));

      return categoriesData;
    } catch (e) {
      console.error(`Error fetching categories for department ${departmentId}:`, e);
      return [];
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryClick = (category) => {
    setDropdownOpen(false);
    setHoveredDept(null);
    const department = departments.find(dept =>
      departmentCategories[dept._id]?.some(cat => cat._id === category._id)
    );

    if (department) {
      navigate(`/products?department_id=${department._id}&category_id=${category._id}`);
    } else {
      navigate(`/products?category_id=${category._id}`);
    }
  };

  // Handle department click - navigate to shop with department filter
  const handleDepartmentClick = (department) => {
    setDropdownOpen(false);
    setHoveredDept(null);

    // Navigate to products page with department filter
    navigate(`/products?department_id=${department._id}`);
  };

  // Compose menu: only departments (no Sale)
  const menuItems = departments.map(dep => dep.name);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 5;
  const endIdx = startIdx + visibleCount;
  const canScrollLeft = startIdx > 0;
  const canScrollRight = endIdx < menuItems.length;

  // Smooth scroll effect for menu sliding
  const [displayedIdx, setDisplayedIdx] = useState(0);
  React.useEffect(() => {
    if (displayedIdx !== startIdx) {
      const timeout = setTimeout(() => setDisplayedIdx(startIdx), 100);
      return () => clearTimeout(timeout);
    }
  }, [startIdx, displayedIdx]);

  const handleScrollLeft = () => {
    if (canScrollLeft) setStartIdx(startIdx - 1);
  };
  const handleScrollRight = () => {
    if (canScrollRight) setStartIdx(startIdx + 1);
  };

  // Handlers for hover
  const handleDeptMouseEnter = async (deptName) => {
    clearTimeout(dropdownTimeout.current);
    setHoveredDept(deptName);
    setDropdownOpen(true);
    console.log("Hovered department:", deptName);
    console.log("Dropdown should be open:", true);

    // Find the department to get its ID
    const department = departments.find(dept => dept.name === deptName);
    if (department) {
      console.log("Found department:", department);
      const deptCategories = await fetchCategoriesForDepartment(department._id);
      console.log(`Categories for ${deptName}:`, deptCategories);
    }
  };
  const handleDeptMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
      console.log("Dropdown closed");
    }, 200);
  };
  const handleDropdownMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
    console.log("Mouse entered dropdown");
  };
  const handleDropdownMouseLeave = () => {
    setDropdownOpen(false);
    console.log("Mouse left dropdown");
  };

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

  const { cartData, totals } = useCart();
  const cartCount = cartData.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = totals.total;

  const [wishlist, setWishlist] = useState([]);
  // Add state for search input
  const [searchTerm, setSearchTerm] = useState("");
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
  const wishlistCount = wishlist.length;

  // Add state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Add state for open department in mobile menu
  const [mobileOpenDept, setMobileOpenDept] = useState(null);

  return (
    <nav id="topnav" className={`${navClass} ${scrolling ? "nav-sticky" : ""}`}>
      <div className="container relative flex items-center justify-between">
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

        {/* Horizontal menu for desktop */}
        <div className="flex-1 items-center justify-center mx-4 relative hidden md:flex">
          <div className="relative w-[700px] max-w-full flex items-center justify-center">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
              aria-label="Scroll left"
              type="button"
              onClick={handleScrollLeft}
              disabled={!canScrollLeft}
              style={{ opacity: canScrollLeft ? 1 : 0.4, cursor: canScrollLeft ? 'pointer' : 'not-allowed' }}
            >
              <FiChevronLeft size={22} />
            </button>
            <div
              className="flex space-x-8 px-8 py-3 justify-center w-full no-scrollbar"
              style={{ scrollBehavior: "smooth", overflowX: "hidden" }}
            >
              {loadingDepartments ? (
                <span>Loading...</span>
              ) : (
                departments.slice(displayedIdx, displayedIdx + visibleCount).map((dep, idx) => (
                  <span
                    key={dep._id || dep.name}
                    className="text-base font-medium whitespace-nowrap cursor-pointer text-gray-800 hover:text-orange-600 relative"
                    onMouseEnter={() => handleDeptMouseEnter(dep.name)}
                    onMouseLeave={handleDeptMouseLeave}
                    onClick={() => handleDepartmentClick(dep)}
                  >
                    {dep.name}
                  </span>
                ))
              )}
            </div>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
              aria-label="Scroll right"
              type="button"
              onClick={handleScrollRight}
              disabled={!canScrollRight}
              style={{ opacity: canScrollRight ? 1 : 0.4, cursor: canScrollRight ? 'pointer' : 'not-allowed' }}
            >
              <FiChevronRight size={22} />
            </button>
            {/* Dropdown Mega Menu */}
            {dropdownOpen && hoveredDept && (
              <div
                className="absolute left-0 right-0 top-[110%] z-50 bg-white shadow-lg rounded-lg p-6 border"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                style={{ minWidth: 400, maxWidth: 600 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Categories for {hoveredDept}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-80 overflow-y-auto">
                  {(() => {
                    // Find the department by name to get its ID
                    const department = departments.find(dept => dept.name === hoveredDept);

                    if (!department) {
                      return (
                        <div className="col-span-full text-center">
                          <span className="text-slate-400">Department not found: {hoveredDept}</span>
                        </div>
                      );
                    }

                    // Get cached categories for this department
                    const filteredCategories = departmentCategories[department._id] || [];
                    if (loadingCategories) {
                      return (
                        <div className="col-span-full text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                          <span className="text-slate-400 mt-2 block">Loading categories...</span>
                        </div>
                      );
                    }

                    return filteredCategories.length === 0 ? (
                      <div className="col-span-full text-center">
                        <span className="text-slate-400">No categories found for {hoveredDept}</span>
                      </div>
                    ) : (
                      filteredCategories.map(cat => (
                        <div
                          key={cat._id}
                          className="flex flex-col items-center group cursor-pointer"
                          onClick={() => handleCategoryClick(cat)}
                        >
                          <div className="w-14 h-14 rounded-full mb-2 border group-hover:scale-110 transition-transform bg-gray-100 flex items-center justify-center overflow-hidden">
                            {cat.image ? (
                              <img src={cat.image.startsWith('/uploads') ? `https://zyqora.onrender.com${cat.image}` : cat.image} alt={cat.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <span className="text-gray-500 text-xs text-center">{cat.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="text-sm text-center mt-1 font-medium text-gray-700 group-hover:text-orange-500">{cat.name}</span>
                        </div>
                      ))
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile side drawer menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
            <div className="w-72 bg-white dark:bg-slate-900 h-full shadow-lg p-6 overflow-y-auto relative">
              <button
                aria-label="Close menu"
                className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-lg font-semibold mb-4">Departments</h3>
              <ul>
                {departments.map(dep => (
                  <li key={dep._id || dep.name} className="mb-2">
                    <button
                      className="w-full text-left font-medium text-gray-800 hover:text-orange-600 flex items-center justify-between"
                      onClick={async () => {
                        if (mobileOpenDept !== dep._id && !departmentCategories[dep._id]) {
                          setLoadingCategories(true);
                          await fetchCategoriesForDepartment(dep._id);
                          setLoadingCategories(false);
                        }
                        setMobileOpenDept(mobileOpenDept === dep._id ? null : dep._id);
                      }}
                    >
                      {dep.name}
                      <svg className={`w-4 h-4 ml-2 transition-transform ${mobileOpenDept === dep._id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {mobileOpenDept === dep._id && (
                      loadingCategories ? (
                        <div className="ml-4 mt-2 text-gray-400 text-sm">Loading...</div>
                      ) : (
                        <ul className="ml-4 mt-2">
                          {(departmentCategories[dep._id] || []).map(cat => (
                            <li key={cat._id} className="mb-1">
                              <button
                                className="text-sm text-gray-700 hover:text-orange-500"
                                onClick={() => {
                                  handleCategoryClick(cat);
                                  setMobileMenuOpen(false);
                                  setMobileOpenDept(null);
                                }}
                              >
                                {cat.image ? (
                                  <img src={cat.image ? (cat.image.startsWith('/uploads') ? `https://zyqora.onrender.com${cat.image}` : cat.image) : '/default-category.png'} alt={cat.name} className="w-8 h-8 rounded-full object-cover inline-block mr-2 align-middle" />
                                ) : (
                                  <span className="text-gray-500 text-xs text-center">{cat.name.charAt(0)}</span>
                                )}
                                {cat.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Menu Extras (search, cart, wishlist, user) - now inline to the right of the scrollbar */}
        <div className="menu-extras flex items-center">
          {!mobileMenuOpen && (
            <button
              aria-label="Open menu"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
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
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        setIsOpen(false);
                        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                      }
                    }}
                  />
                  {/* Optional: Add a search button inside dropdown */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => {
                      if (searchTerm.trim()) {
                        setIsOpen(false);
                        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                      }
                    }}
                    tabIndex={-1}
                  >
                    <FiSearch className="size-4" />
                  </button>
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
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </button>
            {cartManu && (
              <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-64 rounded-md bg-white dark:bg-slate-900 shadow dark:shadow-gray-800">
                <ul className="py-3 text-start">
                  {cartData.map((item, index) => (
                    <li key={index} className="flex items-center justify-between py-1.5 px-4 ms-0">
                      <span className="flex items-center">
                        <img
                          src={item.image?.startsWith('/uploads') ? `https://zyqora.onrender.com${item.image}` : item.image}
                          className="rounded shadow dark:shadow-gray-800 w-9"
                          alt={item.name}
                        />
                        <span className="ms-3">
                          <span className="block font-semibold">{item.name}</span>
                          <span className="block text-sm text-slate-400">
                            ${item.price} X {item.quantity}
                          </span>
                        </span>
                      </span>
                      <span className="font-semibold">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                  ))}

                  <li className="border-t border-gray-100 dark:border-gray-800 my-2 ms-0"></li>

                  <li className="flex items-center justify-between py-1.5 px-4 ms-0">
                    <h6 className="font-semibold mb-0">Total($):</h6>
                    <h6 className="font-semibold mb-0">
                      {cartTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </h6>
                  </li>

                  <li className="py-1.5 px-4 ms-0">
                    <span className="text-center block">
                      <Link
                        to="/shop-cart"
                        className="py-[5px] px-4 inline-block font-semibold tracking-wide align-middle duration-500 text-sm text-center rounded-md bg-orange-500 border border-orange-500 text-white me-1"
                      >
                        View Cart
                      </Link>
                      <Link
                        to={isAuthenticated ? "/shop-checkout" : "/login"}
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
          <li className="inline-block ps-0.5 relative">
            <button
              type="button"
              className="size-9 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full bg-orange-500 text-white"
              onClick={async () => {
                navigate('/wishlist');
              }}
            >
              <FiHeart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1.5">
                  {wishlistCount}
                </span>
              )}
            </button>
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
        </div>

      </div>
    </nav>
  );
}
