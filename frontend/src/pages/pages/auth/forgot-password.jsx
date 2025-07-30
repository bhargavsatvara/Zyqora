// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../../services/api';

import logoDark from '../../../assets/images/logo.png';
import logoLight from '../../../assets/images/Zyqora-light.png';
import bg1 from '../../../assets/images/forgot-password.jpg';

import BackToHome from '../../../components/back-to-home';
import Switcher from '../../../components/switcher';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await authAPI.forgotPassword({ email });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to send reset link. Please try again.'
      );
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
            <img src={bg1} alt="Forgot Password" className="w-full h-full object-cover" />
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-10">
            <div className="text-center mb-6">
              <Link to="/">
                <img src={logoDark} alt="Zyqora" className="mx-auto w-28 dark:hidden" />
                <img src={logoLight} alt="Zyqora" className="mx-auto w-28 hidden dark:block" />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" role="form">
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div>
                <label htmlFor="email" className="block font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>

              {message && <p className="text-green-600 text-center" role="status">{message}</p>}
              {error && <p className="text-red-600 text-center" role="status">{error}</p>}

              <p className="text-center text-gray-500 text-sm">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold text-gray-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>

           
          </div>
        </div>
      </div>

      <BackToHome />
      <Switcher />
    </section>
  );
}
