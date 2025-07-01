import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import Tagline from "../../components/tagline";
import ScrollToTop from "../../components/scroll-to-top";

import heroVideo from '../../assets/videos/heroVideo6.mp4'; 
import ctaImg from '../../assets/images/hero/bg-shape.png';

import { FiHeart, FiEye, FiBookmark } from '../../assets/icons/vander';
import { collections, newProduct } from "../../data/data";

export default function Index() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = "December, 31, 2025";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Tagline />
      <Navbar navClass="defaultscroll is-sticky tagline-height" />

      {/* Hero Section with video background */}
      <section className="relative flex items-center w-full md:h-screen py-36 overflow-hidden">
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
      <section className="relative py-16 md:py-24">
        <div className="container relative">
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
                  className="rounded-full shadow dark:shadow-gray-800"
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
        <div className="container relative mt-16 md:mt-24">
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
                    className="w-full duration-500 group-hover:scale-110"
                    alt={item.name}
                  />

                  <div className="absolute bottom-[-5rem] start-3 end-3 duration-500 group-hover:bottom-3">
                    <Link
                      to="/shop-cart"
                      className="inline-block w-full px-5 py-2 text-base font-semibold text-white bg-slate-900 rounded-md tracking-wide align-middle duration-500 text-center"
                    >
                      Add to Cart
                    </Link>
                  </div>

                  <ul className="absolute top-[10px] end-4 space-y-1 opacity-0 duration-500 group-hover:opacity-100 list-none">
                    <li>
                      <Link
                        to="#"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiHeart className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop-item-detail"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiBookmark className="w-4 h-4" />
                      </Link>
                    </li>
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
                      {item.desRate}{" "}
                      <del className="text-slate-400">{item.amount}</del>
                    </p>
                    <ul className="font-medium text-amber-400 list-none">
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with countdown */}
        <div className="container-fluid relative mt-16 md:mt-24">
          <div className="relative overflow-hidden py-24 px-4 md:px-10 text-center bg-orange-600 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${ctaImg})` }}>
            <h3 className="mb-6 text-4xl font-bold leading-normal tracking-wide text-white">
              End of Season Clearance <br /> Sale up to 30%
            </h3>
            <div id="countdown" className="mt-6">
              <ul className="inline-block space-x-1 text-center list-none">
                <li className="inline-block w-20 h-20 mx-1 text-2xl font-medium text-white leading-[72px] rounded-md shadow shadow-gray-100">
                  {days}
                  <p className="mt-1 text-sm">Days</p>
                </li>
                <li className="inline-block w-20 h-20 mx-1 text-2xl font-medium text-white leading-[72px] rounded-md shadow shadow-gray-100">
                  {hours}
                  <p className="mt-1 text-sm">Hours</p>
                </li>
                <li className="inline-block w-20 h-20 mx-1 text-2xl font-medium text-white leading-[72px] rounded-md shadow shadow-gray-100">
                  {minutes}
                  <p className="mt-1 text-sm">Mins</p>
                </li>
                <li className="inline-block w-20 h-20 mx-1 text-2xl font-medium text-white leading-[72px] rounded-md shadow shadow-gray-100">
                  {seconds}
                  <p className="mt-1 text-sm">Secs</p>
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <Link
                to="/sale"
                className="inline-block px-5 py-2 font-semibold text-orange-500 bg-white rounded-md tracking-wide align-middle"
              >
                <i className="mdi mdi-cart-outline"></i> Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Items Section */}
        <div className="container relative mt-16 md:mt-24">
          <div className="grid items-end mb-6 md:grid-cols-2">
            <div className="text-center md:text-start">
              <h5 className="mb-4 text-3xl font-semibold leading-normal">
                Popular Items
              </h5>
              <p className="max-w-xl text-slate-500 text-xl">
                Popular items this week
              </p>
            </div>
            <div className="hidden text-end md:block">
              <Link to="/shop-grid" className="text-slate-400 hover:text-orange-500">
                See More Items <i className="mdi mdi-arrow-right"></i>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 pt-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {newProduct.slice(12, 16).map((item, index) => (
              <div className="group" key={index}>
                <div className="relative overflow-hidden rounded-md shadow dark:shadow-gray-800 duration-500 group-hover:shadow-lg group-hover:dark:shadow-gray-800">
                  <img
                    src={item.image}
                    className="w-full duration-500 group-hover:scale-110"
                    alt={item.name}
                  />

                  <div className="absolute bottom-[-5rem] start-3 end-3 duration-500 group-hover:bottom-3">
                    <Link
                      to="/shop-cart"
                      className="inline-block w-full px-5 py-2 text-base font-semibold text-white bg-slate-900 rounded-md tracking-wide align-middle duration-500 text-center"
                    >
                      Add to Cart
                    </Link>
                  </div>

                  <ul className="absolute top-[10px] end-4 space-y-1 opacity-0 duration-500 group-hover:opacity-100 list-none">
                    <li>
                      <Link
                        to="#"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiHeart className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop-item-detail"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="inline-flex items-center justify-center w-10 h-10 text-slate-900 bg-white rounded-full shadow duration-500 hover:bg-slate-900 hover:text-white"
                      >
                        <FiBookmark className="w-4 h-4" />
                      </Link>
                    </li>
                  </ul>

                  <ul className="absolute top-[10px] start-4 list-none">
                    {item.tag !== "" && (
                      <li>
                        <Link
                          to="#"
                          className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded h-5"
                        >
                          New
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
                      {item.desRate} <del className="text-slate-400">{item.rate}</del>
                    </p>
                    <ul className="font-medium text-amber-400 list-none">
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                      <li className="inline">
                        <i className="mdi mdi-star"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 mt-6">
            <div className="block text-center md:hidden">
              <Link to="/shop-grid" className="text-slate-400 hover:text-orange-500">
                See More Items <i className="mdi mdi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Switcher/>
      <ScrollToTop />
    </>
  );
}
