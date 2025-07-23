import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Usertab from "../../../components/user-tab";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import { FiUser, FiMail, FiKey } from '../../../assets/icons/vander'
import { FiEdit, FiEye, FiEyeOff } from 'react-icons/fi';
import ScrollToTop from "../../../components/scroll-to-top";

export default function UserSetting() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [editing, setEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState({ name: '', email: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserProfile = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    fetch('https://zyqora.onrender.com/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && (data.name || (data.data && data.data.name))) {
          const newUser = {
            name: data.name || (data.data && data.data.name) || '',
            email: data.email || (data.data && data.data.email) || ''
          };
          setUser(newUser);
          setOriginalUser(newUser);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditing(true);
  };
  const handleCancelEdit = () => {
    setUser(originalUser);
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch('https://zyqora.onrender.com/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Failed to update profile');
      } else {
        setSuccess('Profile updated successfully!');
        fetchUserProfile();
        setEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordFields({ ...passwordFields, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setSubmittingPassword(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch('https://zyqora.onrender.com/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordFields.oldPassword,
          newPassword: passwordFields.newPassword
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setPasswordError(err.message || 'Failed to update password');
      } else {
        setPasswordSuccess('Password updated successfully!');
        setPasswordFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordError('Failed to update password');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <>
      <Navbar navClass="defaultscroll is-sticky" />
      <section className="relative lg:pb-24 pb-16 md:mt-[84px] mt-[70px]">
        <div className="md:container container-fluid relative">
          <div className="relative overflow-hidden md:rounded-md shadow dark:shadow-gray-700 h-52 bg-[url('../../assets/images/hero/pages.jpg')] bg-center bg-no-repeat bg-cover"></div>
        </div>
        <div className="container relative md:mt-24 mt-16">
          <div className="md:flex">
            <Usertab />
            <div className="lg:w-3/4 md:w-2/3 md:px-3 mt-6 md:mt-0">
              <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold">Profile Settings</h5>
                  {!editing && (
                    <button type="button" className="text-orange-500 text-lg" onClick={handleEditClick} title="Edit profile info">
                      <FiEdit />
                    </button>
                  )}
                </div>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                      <label className="form-label font-medium">Name <span className="text-red-600">*</span></label>
                      <div className="form-icon relative mt-2">
                        <FiUser className="w-4 h-4 absolute top-3 start-4" />
                        <input type="text" className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="Name" name="name" value={user.name} onChange={handleChange} required readOnly={!editing} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label font-medium">Email <span className="text-red-600">*</span></label>
                      <div className="form-icon relative mt-2">
                        <FiMail className="w-4 h-4 absolute top-3 start-4" />
                        <input type="email" className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0" placeholder="Email" name="email" value={user.email} onChange={handleChange} required readOnly={!editing} />
                      </div>
                    </div>
                  </div>
                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                  {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                  {editing && (
                    <div className="flex gap-2 mt-5">
                      <button type="submit" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-orange-500 text-white rounded-md" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
                      <button type="button" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-gray-300 text-gray-800 rounded-md" onClick={handleCancelEdit} disabled={submitting}>Cancel</button>
                    </div>
                  )}
                </form>
              </div>
              <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-6">
                <h5 className="text-lg font-semibold mb-4">Change Password</h5>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="form-label font-medium">Old password</label>
                      <div className="form-icon relative mt-2">
                        <FiKey className="w-4 h-4 absolute top-3 start-4" />
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Old password"
                          name="oldPassword"
                          value={passwordFields.oldPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute top-3 end-4 text-gray-400 hover:text-orange-500"
                          tabIndex={-1}
                          onClick={() => setShowOldPassword((v) => !v)}
                          style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                          {showOldPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label font-medium">New password</label>
                      <div className="form-icon relative mt-2">
                        <FiKey className="w-4 h-4 absolute top-3 start-4" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="New password"
                          name="newPassword"
                          value={passwordFields.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute top-3 end-4 text-gray-400 hover:text-orange-500"
                          tabIndex={-1}
                          onClick={() => setShowNewPassword((v) => !v)}
                          style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                          {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label font-medium">Re-type New password</label>
                      <div className="form-icon relative mt-2">
                        <FiKey className="w-4 h-4 absolute top-3 start-4" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Re-type New password"
                          name="confirmPassword"
                          value={passwordFields.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute top-3 end-4 text-gray-400 hover:text-orange-500"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {passwordError && <div className="text-red-500 text-sm mt-2">{passwordError}</div>}
                  {passwordSuccess && <div className="text-green-600 text-sm mt-2">{passwordSuccess}</div>}
                  <button type="submit" className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-orange-500 text-white rounded-md mt-5" disabled={submittingPassword}>{submittingPassword ? 'Saving...' : 'Save password'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Switcher />
      <ScrollToTop />
    </>
  )
}