import React from "react";
import { Link } from "react-router-dom";

import logoDark from "../../../assets/images/logo.png";
import logoLight from "../../../assets/images/Zyqora-light.png";
import forgotImg from "../../../assets/images/forgot-password.jpg";

import BackToHome from "../../../components/back-to-home";
import Switcher from "../../../components/switcher";

export default function ForgotPassword() {
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
              src={forgotImg}
              alt="Forgot Password"
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

            <form className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Please enter your email address. You will receive a link to
                create a new password via email.
              </p>

              {/* Email */}
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 bg-transparent dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Send button */}
              <div>
                <button
                  type="button"
                  className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition"
                >
                  Send Reset Link
                </button>
              </div>

              {/* Back to login */}
              <p className="text-center text-gray-500 text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-gray-900 dark:text-white hover:underline"
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
                Zyqora
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <BackToHome />
      <Switcher />
    </section>
  );
}
