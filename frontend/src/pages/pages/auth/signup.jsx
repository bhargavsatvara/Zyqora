// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Eye } from "lucide-react";

import logoDark from '../../../assets/images/logo.png';
import logoLight from '../../../assets/images/Zyqora-light.png';
import bg1 from '../../../assets/images/signup.jpg';

import BackToHome from "../../../components/back-to-home";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTnc: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const { name, email, password, confirmPassword, acceptTnc } = formData;
  const API_BASE = 'https://zyqora.onrender.com/api/auth';

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      setError("Name can only contain letters and spaces");
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()+={}[\]|\\:;"'<>,./~-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character"
      );
      return;
    }

    // Confirm match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Terms & Conditions
    if (!acceptTnc) {
      setError("You must accept the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/signup`, { name, email, password });
      console.log("✅ Signup success:", res.data);
      navigate("/login");
    } catch (err) {
      console.error("❌ Signup error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
        "Something went wrong, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-orange-50 overflow-hidden" role="main">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-100 rounded-full" />
      <div className="absolute bottom-0 -right-12 w-64 h-64 bg-orange-100 rounded-full" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-1/2">
            <img src={bg1} alt="Signup" className="w-full h-full object-cover" />
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
              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-700">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  type="text"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 w-full px-3 py-2 pr-10 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-3 top-[38px] flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  <Eye size={18} />
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  type={showConfirm ? "text" : "password"}
                  required
                  className="mt-1 w-full px-3 py-2 pr-10 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowConfirm(true)}
                  onMouseUp={() => setShowConfirm(false)}
                  onMouseLeave={() => setShowConfirm(false)}
                  className="absolute inset-y-0 right-3 top-[38px] flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  <Eye size={18} />
                </button>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center">
                <input
                  id="acceptTnc"
                  name="acceptTnc"
                  type="checkbox"
                  checked={acceptTnc}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTnc" className="ml-2 text-gray-600">
                  I accept{" "}
                  <Link to="/terms" className="text-orange-500 hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-center py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? "Registering…" : "Register"}
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>

            <p className="mt-6 text-center text-gray-400 text-xs">
              © {new Date().getFullYear()} Zyqora. Made with{" "}
              <span role="img" aria-label="love">
                ❤️
              </span>{" "}
              by Group 7.
            </p>
          </div>
        </div>
      </div>

      <BackToHome />
    </section>
  );
}
