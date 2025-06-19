import React from "react";
import { Link } from "react-router-dom";

import logoDark from "../../../assets/images/logo.png";
import logoLight from "../../../assets/images/Zyqora-light.png";
import loginImg from "../../../assets/images/login.jpg";

import BackToHome from "../../../components/back-to-home";

export default function Login() {
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
              src={loginImg}
              alt="Sign in"
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
              {/* Email field */}
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="loginPassword"
                  className="block font-semibold text-gray-700"
                >
                  Password
                </label>
                <input
                  id="loginPassword"
                  name="password"
                  type="password"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Remember me & forgot password */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition"
                >
                  Login / Sign in
                </button>
              </div>

              {/* Signup link */}
              <p className="text-center text-gray-500 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Sign Up
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
