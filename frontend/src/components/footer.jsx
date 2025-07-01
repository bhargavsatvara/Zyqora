import React from "react";
import { Link } from "react-router-dom";
import logoLight from '../assets/images/Zyqora-light.png';
import {
  footerServices,
  footerShopping1,
  footerShopping2,
  footerShopping3,
  footerSocial,
  paymentCart,
} from "../data/data";

import { FiMail } from '../assets/icons/vander';

export default function Footer() {
  // filter out the money-back guarantee service
  const services = footerServices.filter(
    (item) => item.name !== "Money-back guarantee"
  );

  return (
    <footer className="footer bg-dark-footer relative text-gray-200 dark:text-gray-200">
      <div className="container relative">
        {/* top section */}
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="py-[60px] px-0">
              <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
                {/* logo & socials */}
                <div className="lg:col-span-3 md:col-span-12">
                  <Link to="#" className="focus:outline-none">
                    <img
                      src={logoLight}
                      alt="Zyqora logo"
                      className="h-16 w-auto"
                    />
                  </Link>
                  <p className="mt-6 text-gray-300">
                    Upgrade your style with our curated sets. Choose confidence,
                    embrace your unique look.
                  </p>
                  <ul className="list-none mt-6">
                    {footerSocial.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <li className="inline" key={idx}>
                          <Link
                            to={item.link}
                            target="_blank"
                            className="size-8 inline-flex items-center justify-center tracking-wide align-middle text-base border border-gray-800 dark:border-slate-800 rounded-md hover:text-orange-500 dark:hover:text-orange-500 text-slate-300"
                          >
                            <Icon className="h-4 w-4 align-middle" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* shopping links */}
                <div className="lg:col-span-6 md:col-span-12">
                  <h5 className="tracking-[1px] text-gray-100 font-semibold">
                    Shopping & Clothes
                  </h5>
                  <div className="grid md:grid-cols-12 grid-cols-1">
                    {[footerShopping1, footerShopping2, footerShopping3].map(
                      (list, col) => (
                        <div className="md:col-span-4" key={col}>
                          <ul className="list-none footer-list mt-6">
                            {list.map((item, i) => (
                              <li className="ms-0 mt-[10px]" key={i}>
                                <Link
                                  to=""
                                  className="text-gray-300 hover:text-gray-400 duration-500 ease-in-out"
                                >
                                  <i className="mdi mdi-chevron-right" /> {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* newsletter */}
                <div className="lg:col-span-3 md:col-span-4">
                  <h5 className="tracking-[1px] text-gray-100 font-semibold">
                    Newsletter
                  </h5>
                  <p className="mt-6">
                    Sign up and receive the latest tips via email.
                  </p>
                  <form>
                    <div className="grid grid-cols-1">
                      <div className="my-3">
                        <label className="form-label">
                          Write your email <span className="text-red-600">*</span>
                        </label>
                        <div className="form-icon relative mt-2">
                          <FiMail className="size-4 absolute top-3 start-4" />
                          <input
                            type="email"
                            className="ps-12 rounded w-full py-2 px-3 h-10 bg-gray-800 border-0 text-gray-100 focus:shadow-none focus:ring-0 placeholder:text-gray-200 outline-none"
                            placeholder="Email"
                            name="email"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        id="submitsubscribe"
                        name="send"
                        className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-orange-500 text-white rounded-md"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* services section (now 3 columns at lg) */}
        <div className="grid grid-cols-1">
          <div className="py-[30px] px-0 border-t border-slate-800">
            <div className="grid lg:grid-cols-3 md:grid-cols-2">
              {services.map((item, idx) => (
                <div
                  className="flex items-center lg:justify-center"
                  key={idx}
                >
                  <i className={`align-middle text-lg mb-0 me-2 ${item.icon}`} />
                  <h6 className="mb-0 font-medium">{item.name}</h6>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom copyright & payments */}
      <div className="py-[30px] px-0 border-t border-slate-800">
        <div className="container relative text-center">
          <div className="grid md:grid-cols-2 items-center">
            <div className="md:text-start text-center">
              <p className="mb-0">
                © {new Date().getFullYear()} Zyqora. Design & Develop with{" "}
                <i className="mdi mdi-heart text-red-600"></i> by{" "}
                <Link to="#" target="_blank" className="text-reset">
                  Group 7
                </Link>
                .
              </p>
            </div>
            <ul className="list-none md:text-end text-center mt-6 md:mt-0">
              {paymentCart.map((item, idx) => (
                <li className="inline" key={idx}>
                  <Link to="">
                    <img
                      src={item}
                      className="max-h-6 rounded inline"
                      alt="Payment method"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
