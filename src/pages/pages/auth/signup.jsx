import React from "react";
import { Link } from "react-router-dom";


import logoDark from "../../../assets/images/logo.png";
import logoLight from "../../../assets/images/Zyqora-light.png";
import signupImg from "../../../assets/images/signup.jpg";

import BackToHome from "../../../components/back-to-home";

export default function Signup() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-orange-50 dark:bg-orange-50/20 overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-100 rounded-full" />
      <div className="absolute bottom-0 -right-12 w-64 h-64 bg-orange-100 rounded-full" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={signupImg}
              alt="Sign up"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form area */}
          <div className="w-full md:w-1/2 p-6 md:p-10">
            <div className="text-center mb-6">
              <Link to="/">
                <img
                  src={logoDark}
                  alt="Zyqora"
                  className="mx-auto w-28 dark:hidden"
                />
                <img
                  src={logoLight}
                  alt="Zyqora"
                  className="mx-auto w-28 hidden dark:block"
                />
              </Link>
            </div>

            <form className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="registerName"
                  className="block font-semibold text-gray-700"
                >
                  Your Name
                </label>
                <input
                  id="registerName"
                  type="text"
                 
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-transparent dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="registerEmail"
                  className="block font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="registerEmail"
                  type="email"
                 
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-transparent dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block font-semibold text-gray-700"
                >
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                 
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-transparent dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="registerConfirmPassword"
                  className="block font-semibold text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="registerConfirmPassword"
                  type="password"
                 
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-transparent dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Accept Terms */}
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-2 focus:ring-orange-300"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 text-gray-600"
                >
                  I Accept{" "}
                  <Link to="/terms" className="text-orange-500 hover:underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              {/* Register button */}
              <div>
                <button
                  type="button"
                  className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition"
                >
                  <Link to="/signup-success">Register</Link>
                </button>
              </div>

              {/* Sign in link */}
              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-gray-400 text-xs">
              © {new Date().getFullYear()} Zyqora. Design &amp; Develop with{" "}
              <span role="img" aria-label="love">
                ❤️
              </span>{" "}
              by{" "}
              <Link
                to="#"
                target="_blank"
                className="text-gray-400 hover:underline"
              >
                Group 7
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <BackToHome />
    </section>
  );
}

import logoDark from '../../../assets/images/logo.png'
import logoLight from '../../../assets/images/Zyqora-light.png'
import bg1 from '../../../assets/images/signup.jpg'

import BackToHome from "../../../components/back-to-home";


export default function Signup(){
    return(
        <>
        <section className="md:h-screen py-36 flex items-center bg-orange-500/10 dark:bg-orange-500/20 bg-[url('../../assets/images/hero/bg-shape.png')] bg-center bg-no-repeat bg-cover">
            <div className="container relative">
                <div className="grid grid-cols-1">
                    <div className="relative overflow-hidden rounded-md shadow dark:shadow-gray-700 bg-white dark:bg-slate-900">
                        <div className="grid md:grid-cols-2 grid-cols-1 items-center">
                            <div className="relative md:shrink-0">
                                <img className="h-full w-full object-cover md:h-[44rem]" src={bg1} alt=""/>
                            </div>

                            <div className="p-8 lg:px-20">
                                <div className="text-center">
                                    <Link to="/">
                                        <img src={logoDark} className="mx-auto block dark:hidden" alt=""/>
                                        <img src={logoLight} className="mx-auto hidden dark:block" alt=""/>
                                    </Link>
                                </div>

                                <form className="text-start lg:py-20 py-8">
                                    <div className="grid grid-cols-1">
                                        <div className="mb-4">
                                            <label className="font-semibold" htmlFor="RegisterName">Your Name:</label>
                                            <input id="RegisterName" type="text" className="mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="Harry"/>
                                        </div>
        
                                        <div className="mb-4">
                                            <label className="font-semibold" htmlFor="LoginEmail">Email Address:</label>
                                            <input id="LoginEmail" type="email" className="mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="name@example.com"/>
                                        </div>
        
                                        <div className="mb-4">
                                            <label className="font-semibold" htmlFor="LoginPassword">Password:</label>
                                            <input id="LoginPassword" type="password" className="mt-3 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="Password:"/>
                                        </div>
        
                                        <div className="mb-4">
                                            <div className="flex items-center w-full mb-0">
                                                <input className="form-checkbox rounded border-gray-100 dark:border-gray-800 text-orange-500 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="AcceptT&C"/>
                                                <label className="form-check-label text-slate-400" htmlFor="AcceptT&C">I Accept <Link to="" className="text-orange-500">Terms And Condition</Link></label>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <button type="submit" className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-orange-500 text-white rounded-md w-full"><Link to="/signup-success">Register</Link></button>
                                        </div>
        
                                        <div className="text-center">
                                            <span className="text-slate-400 me-2">Already have an account ? </span> <Link to="/login" className="text-black dark:text-white font-bold inline-block">Sign in</Link>
                                        </div>
                                    </div>
                                </form>

                                <div className="text-center">
                                    <p className="mb-0 text-slate-400">© {new Date().getFullYear()} Zyqora.  Design & Develop  with <i className="mdi mdi-heart text-red-600"></i> by <Link to="https://shreethemes.in/" target="_blank" className="text-reset">Group 7</Link>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <BackToHome/>
     
        </>
    )
}

