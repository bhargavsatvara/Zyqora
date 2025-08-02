
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../../services/api";

import logoDark from "../../../assets/images/logo.png";
import logoLight from "../../../assets/images/Zyqora-light.png";
import loginImg from "../../../assets/images/login.jpg";

import BackToHome from "../../../components/back-to-home";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const { email, password, rememberMe } = formData;
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        email,
        password,
        rememberMe
      });
      console.log('Login :: res ::', res);

      // choose storage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", res.data.token);
      storage.setItem("user", JSON.stringify(res.data.user));

      // Check user role and redirect
      if (res.data.user.role === "admin") {
        window.location.href = "/admin"; // Change to your admin panel route if different
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-orange-50 dark:bg-orange-50/20 overflow-hidden" role="main">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-100 rounded-full" />
      <div className="absolute bottom-0 -right-12 w-64 h-64 bg-orange-100 rounded-full" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-1/2">
            <img src={loginImg} alt="Sign in" className="w-full h-full object-cover" />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-10">
            <div className="text-center mb-6">
              <Link to="/">
                <img src={logoDark} alt="Zyqora" className="mx-auto w-28 dark:hidden" />
                <img src={logoLight} alt="Zyqora" className="mx-auto w-28 hidden dark:block" />
              </Link>
            </div>

            {error && (
              <div
                role="status"
                aria-live="assertive"
                className="mb-4 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded text-red-800"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.764-1.36 2.717-1.36 3.481 0l5.516 9.828c.75 1.334-.213 2.973-1.74 2.973H4.48c-1.527 0-2.49-1.64-1.74-2.973L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} role="form">
              <div>
                <label htmlFor="loginEmail" className="block font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="relative">
                <label htmlFor="loginPassword" className="block font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="loginPassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 pr-10 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 top-[38px] flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? "Logging in…" : "Login / Sign in"}
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                Don’t have an account?{" "}
                <Link to="/signup" className="font-semibold text-gray-900 hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>

            
          </div>
        </div>
      </div>

      <BackToHome />
    </section>
  );
}
