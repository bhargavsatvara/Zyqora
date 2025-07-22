// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import logoDark from '../../../assets/images/logo.png';
import logoLight from '../../../assets/images/Zyqora-light.png';
import bg1 from '../../../assets/images/forgot-password.jpg';

import BackToHome from '../../../components/back-to-home';
import Switcher from '../../../components/switcher';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://zyqora.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-orange-50 dark:bg-orange-50/20 overflow-hidden">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-100 rounded-full" />
      <div className="absolute bottom-0 -right-12 w-64 h-64 bg-orange-100 rounded-full" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={bg1}
              alt="Reset Password"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right form */}
          <div className="w-full md:w-1/2 p-6 md:p-10">
            <div className="text-center mb-6">
              <Link to="/">
                <img src={logoDark} alt="Zyqora" className="mx-auto w-28 dark:hidden" />
                <img src={logoLight} alt="Zyqora" className="mx-auto w-28 hidden dark:block" />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                Reset Your Password
              </h2>
              <p className="text-gray-600 text-center">
                Enter a new password for your account.
              </p>

              <div>
                <label htmlFor="password" className="block font-semibold text-gray-700">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>

              {message && <p className="text-green-600 text-center">{message}</p>}
              {error && <p className="text-red-600 text-center">{error}</p>}

              <p className="text-center text-gray-500 text-sm">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>

            <p className="mt-6 text-center text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} Zyqora. Made with{' '}
              <span role="img" aria-label="love">❤️</span> by Zyqora.
            </p>
          </div>
        </div>
      </div>

      <BackToHome />
      <Switcher />
    </section>
  );
}
