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

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

  // Add state for sliding window of departments
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  useEffect(() => {
    async function fetchDepartments() {
      try {
        console.log("Fetching departments...");
        const res = await fetch("http://localhost:4000/api/departments");
        const data = await res.json();
        console.log("Departments fetched:", data);
        setDepartments(data || []);
      } catch (e) {
        console.error("Error fetching departments:", e);
        // Fallback to sample departments if API fails
        setDepartments([
          { _id: "dept1", name: "Electronics" },
          { _id: "dept2", name: "Clothing" },
          { _id: "dept3", name: "Home & Garden" },
          { _id: "dept4", name: "Sports" },
          { _id: "dept5", name: "Books" },
          { _id: "dept6", name: "Toys" }
        ]);
      } finally {
        setLoadingDepartments(false);
      }
    }
    fetchDepartments();
  }, []);

  // --- CATEGORY DROPDOWN STATE ---
  const [categories, setCategories] = useState([]);
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
      console.log(`Fetching categories for department: ${departmentId}`);
      const res = await fetch(`http://localhost:4000/api/categories?department_id=${departmentId}`);
      const data = await res.json();
      console.log("Categories API response:", data);
      
      // Handle different response structures
      let categoriesData = [];
      if (data.data && data.data.categories) {
        categoriesData = data.data.categories;
      } else if (data.categories) {
        categoriesData = data.categories;
      } else if (Array.isArray(data)) {
        categoriesData = data;
      }
      
      console.log(`Found ${categoriesData.length} categories for department ${departmentId}`);
      
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

        {/* Horizontal Category Navigation Bar (centered, reduced width) */}
        <div className="flex-1 flex items-center justify-center mx-4 relative">
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
                    console.log("Found department:", department);
                    
                    if (!department) {
                      console.log("Department not found for:", hoveredDept);
                      return (
                        <div className="col-span-full text-center">
                          <span className="text-slate-400">Department not found: {hoveredDept}</span>
                        </div>
                      );
                    }
                    
                    // Get cached categories for this department
                    const filteredCategories = departmentCategories[department._id] || [];
                    
                    console.log("Hovered department:", hoveredDept);
                    console.log("Department ID:", department._id);
                    console.log("Cached categories for department:", filteredCategories);
                    console.log("Dropdown is open:", dropdownOpen);
                    
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
                        <div key={cat._id} className="flex flex-col items-center group">
                          <div className="w-14 h-14 rounded-full mb-2 object-cover border group-hover:scale-110 transition-transform bg-gray-100 flex items-center justify-center">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full rounded-full object-cover" />
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

        {/* Menu Extras (search, cart, wishlist, user) - now inline to the right of the scrollbar */}
        <div className="menu-extras flex items-center">
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
        </div>

      </div>
    </nav>
  );
}
