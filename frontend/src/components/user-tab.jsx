import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from '../assets/images/client/16.jpg'
import { FiAirplay, FiEdit, FiCreditCard, FiFileText, FiShare2, FiBell, FiSettings, FiLogOut } from '../assets/icons/vander'
import { userAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

// Function to get proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return client;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /uploads, it's a backend file
  if (imagePath.startsWith('/uploads')) {
    return `https://zyqora.onrender.com${imagePath}`;
  }
  
  // Default fallback
  return client;
};

export default function Usertab() {
	const navigate = useNavigate();
	const { showSuccess, showError } = useToast();
	const [file, setFile] = useState(client);
	const [user, setUser] = useState(null);
	const [uploading, setUploading] = useState(false);
	let current = window.location.pathname;

	useEffect(() => {
		// Get user data from localStorage or sessionStorage
		const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (userData) {
			try {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
				// Set profile image if available
				if (parsedUser.profileImage) {
					setFile(getImageUrl(parsedUser.profileImage));
				}
			} catch (error) {
				console.error('Error parsing user data:', error);
			}
		}
	}, []);

	async function handleChange(e) {
		const selectedFile = e.target.files[0];
		if (!selectedFile) return;

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(selectedFile.type)) {
			showError('Please select a valid image file (JPEG, PNG, or WebP)');
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (selectedFile.size > maxSize) {
			showError('Image size should be less than 5MB');
			return;
		}

		setUploading(true);
		try {
			// Show preview immediately
			setFile(URL.createObjectURL(selectedFile));

			// Upload to server
			const formData = new FormData();
			formData.append('image', selectedFile);

			const response = await userAPI.uploadProfileImage(formData);
			
			// Update user data in storage
			const updatedUser = { ...user, profileImage: response.data.profileImage };
			localStorage.setItem('user', JSON.stringify(updatedUser));
			sessionStorage.setItem('user', JSON.stringify(updatedUser));
			setUser(updatedUser);
			
			// Update the file state with the proper URL
			setFile(getImageUrl(response.data.profileImage));

			showSuccess('Profile image updated successfully!');
		} catch (error) {
			console.error('Error uploading profile image:', error);
			showError(error.response?.data?.message || 'Failed to upload profile image');
			// Revert to previous image on error
			if (user?.profileImage) {
				setFile(user.profileImage);
			} else {
				setFile(client);
			}
		} finally {
			setUploading(false);
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		navigate("/login");
	};

	// Get user display name - use full name if available, otherwise use first name or email
	const getUserDisplayName = () => {
		if (!user) return 'User';
		
		if (user.full_name) {
			return user.full_name;
		} else if (user.first_name && user.last_name) {
			return `${user.first_name} ${user.last_name}`;
		} else if (user.first_name) {
			return user.first_name;
		} else if (user.name) {
			return user.name;
		} else {
			return user.email ? user.email.split('@')[0] : 'User';
		}
	};

	// Get user email
	const getUserEmail = () => {
		if (!user) return 'user@example.com';
		return user.email || 'No email available';
	};

	return (
		<div className="lg:w-1/4 md:w-1/3 md:px-3">
			<div className="relative md:-mt-48 -mt-32">
				<div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
					<div className="profile-pic text-center mb-5">
						<input 
							id="pro-img" 
							name="profile-image" 
							type="file" 
							accept="image/jpeg,image/jpg,image/png,image/webp"
							className="hidden" 
							onChange={(e) => handleChange(e)}
							disabled={uploading}
						/>
						<div>
							<div className="relative h-28 w-28 mx-auto">
								<img 
									src={getImageUrl(user?.profileImage || file)} 
									className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800 object-cover" 
									id="profile-image" 
									alt="Profile" 
									onError={(e) => {
										e.target.src = client;
									}}
								/>
								<label 
									className={`absolute inset-0 cursor-pointer ${uploading ? 'cursor-not-allowed opacity-50' : ''}`} 
									htmlFor="pro-img"
									title={uploading ? 'Uploading...' : 'Click to change profile picture'}
								></label>
								{uploading && (
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
										<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									</div>
								)}
							</div>

							<div className="mt-4">
								<h5 className="text-lg font-semibold">{getUserDisplayName()}</h5>
								<p className="text-slate-400 truncate overflow-hidden whitespace-nowrap max-w-[180px] mx-auto" title={getUserEmail()}>
									{getUserEmail()}
								</p>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-100 dark:border-gray-700">
						<ul className="list-none sidebar-nav mb-0 pb-0" id="navmenu-nav">
							<li className={`navbar-item account-menu ms-0 ${current === '/user-account' ? 'active' : ''}`}>
								<Link to="/user-account" className="navbar-link text-slate-400 flex items-center py-2 rounded">
									<span className="me-2 mb-0"><FiAirplay className="size-4"></FiAirplay></span>
									<h6 className="mb-0 font-medium">Account</h6>
								</Link>
							</li>

							<li className={`navbar-item account-menu ms-0 ${current === '/user-billing' ? 'active' : ''}`}>
								<Link to="/user-billing" className="navbar-link text-slate-400 flex items-center py-2 rounded">
									<span className="me-2 mb-0"><FiEdit className="size-4"></FiEdit></span>
									<h6 className="mb-0 font-medium">Billing Info</h6>
								</Link>
							</li>

							<li className={`navbar-item account-menu ms-0 ${current === '/user-setting' ? 'active' : ''}`}>
								<Link to="/user-setting" className="navbar-link text-slate-400 flex items-center py-2 rounded">
									<span className="me-2 mb-0"><FiSettings className="size-4"></FiSettings></span>
									<h6 className="mb-0 font-medium">Settings</h6>
								</Link>
							</li>

							<li className={`navbar-item account-menu ms-0`}>
								<button onClick={handleLogout} className="navbar-link text-slate-400 flex items-center py-2 rounded w-full text-left">
									<span className="me-2 mb-0"><FiLogOut className="size-4"></FiLogOut></span>
									<h6 className="mb-0 font-medium">Sign Out</h6>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}