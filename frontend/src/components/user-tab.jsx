import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from '../assets/images/client/16.jpg'
import { FiAirplay, FiEdit, FiCreditCard, FiFileText, FiShare2, FiBell, FiSettings, FiLogOut } from '../assets/icons/vander'

export default function Usertab() {
	const navigate = useNavigate();
	const [file, setFile] = useState(client);
	let current = window.location.pathname;

	function handleChange(e) {
		setFile(URL.createObjectURL(e.target.files[0]));
	}
	
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<div className="lg:w-1/4 md:w-1/3 md:px-3">
			<div className="relative md:-mt-48 -mt-32">
				<div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
					<div className="profile-pic text-center mb-5">
						<input id="pro-img" name="profile-image" type="file" className="hidden" onChange={(e) => handleChange(e)} />
						<div>
							<div className="relative h-28 w-28 mx-auto">
								<img src={file} className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800" id="profile-image" alt="" />
								<label className="absolute inset-0 cursor-pointer" htmlFor="pro-img"></label>
							</div>

							<div className="mt-4">
								<h5 className="text-lg font-semibold">Bhargav Satvara</h5>
								<p className="text-slate-400">bhargav@gmail.com</p>
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