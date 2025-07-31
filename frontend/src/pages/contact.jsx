import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import contactImg from '../assets/images/contact.svg'
import { FiPhone, FiMail, FiMapPin, FiX } from '../assets/icons/vander'
import ScrollToTop from "../components/scroll-to-top";
import { contactAPI, userAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

export default function Contact() {
    const { showSuccess, showError } = useToast();
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in and pre-fill form
    useEffect(() => {
        const checkUserProfile = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await userAPI.getProfile();
                    const user = response.data;
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || '',
                        email: user.email || ''
                    }));
                    setIsLoggedIn(true);
                } catch (error) {
                    console.log('User not logged in or token expired');
                    setIsLoggedIn(false);
                }
            }
        };

        checkUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await contactAPI.submitContact(formData);
            showSuccess(response.data.message || 'Message sent successfully!');
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            
        } catch (error) {
            console.error('Contact form error:', error);
            if (error.response?.data?.errors) {
                // Handle validation errors from server
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    const field = err.toLowerCase().includes('name') ? 'name' :
                                err.toLowerCase().includes('email') ? 'email' :
                                err.toLowerCase().includes('subject') ? 'subject' : 'message';
                    serverErrors[field] = err;
                });
                setErrors(serverErrors);
            } else {
                showError(error.response?.data?.message || 'Failed to send message. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar navClass="defaultscroll is-sticky" />
            <div className="container-fluid relative mt-20">
                <div className="grid grid-cols-1">
                    <div className="w-full leading-[0] border-0">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin" style={{ border: '0' }} title="Zyqora" className="w-full h-[500px]" allowFullScreen></iframe>
                    </div>
                </div>
            </div>
            <section className="relative lg:py-24 py-16" role="main">
                <div className="container">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                        <div className="lg:col-span-7 md:col-span-6">
                            <img src={contactImg} alt="" />
                        </div>

                        <div className="lg:col-span-5 md:col-span-6">
                            <div className="lg:ms-5">
                                <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl leading-normal font-semibold">Get in touch !</h3>
                                        {/* {isLoggedIn && (
                                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                <i className="mdi mdi-check-circle"></i>
                                                <span>Logged in</span>
                                            </div>
                                        )} */}
                                    </div>
                                    
                                    {/* {isLoggedIn && (
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-700">
                                                <i className="mdi mdi-information mr-1"></i>
                                                Your contact information has been pre-filled from your account. This submission will be linked to your user profile.
                                            </p>
                                        </div>
                                    )} */}

                                    <form onSubmit={handleSubmit} role="form">
                                        <div className="grid lg:grid-cols-12 grid-cols-1 gap-3">
                                            <div className="lg:col-span-6">
                                                <label htmlFor="name" className="font-semibold">Your Name:</label>
                                                <input 
                                                    name="name" 
                                                    id="name" 
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border focus:ring-0 ${
                                                        errors.name 
                                                            ? 'border-red-500 dark:border-red-500' 
                                                            : 'border-gray-100 dark:border-gray-800'
                                                    }`} 
                                                    placeholder="Name :" 
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-6">
                                                <label htmlFor="email" className="font-semibold">Your Email:</label>
                                                <input 
                                                    name="email" 
                                                    id="email" 
                                                    type="email" 
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border focus:ring-0 ${
                                                        errors.email 
                                                            ? 'border-red-500 dark:border-red-500' 
                                                            : 'border-gray-100 dark:border-gray-800'
                                                    }`} 
                                                    placeholder="Email :" 
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="subject" className="font-semibold">Your Question:</label>
                                                <input 
                                                    name="subject" 
                                                    id="subject" 
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border focus:ring-0 ${
                                                        errors.subject 
                                                            ? 'border-red-500 dark:border-red-500' 
                                                            : 'border-gray-100 dark:border-gray-800'
                                                    }`} 
                                                    placeholder="Subject :" 
                                                />
                                                {errors.subject && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="message" className="font-semibold">Your Comment:</label>
                                                <textarea 
                                                    name="message" 
                                                    id="message" 
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    className={`mt-2 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border focus:ring-0 ${
                                                        errors.message 
                                                            ? 'border-red-500 dark:border-red-500' 
                                                            : 'border-gray-100 dark:border-gray-800'
                                                    }`} 
                                                    placeholder="Message :"
                                                ></textarea>
                                                {errors.message && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            id="submit" 
                                            name="send" 
                                            disabled={loading}
                                            className={`py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center rounded-md mt-2 ${
                                                loading 
                                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                            }`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </span>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container lg:mt-24 mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-orange-500/5 text-orange-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiPhone />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="title h5 text-lg font-semibold">Phone</h5>
                                <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p>

                                <div className="mt-5">
                                    <Link to="tel:+152534-468-854" className="text-orange-500 font-medium">+152 534-468-854</Link>
                                </div>
                            </div>
                        </div>

                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-orange-500/5 text-orange-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiMail />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="title h5 text-lg font-semibold">Email</h5>
                                <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p>

                                <div className="mt-5">
                                    <Link to="mailto:contact@example.com" className="text-orange-500 font-medium">contact@example.com</Link>
                                </div>
                            </div>
                        </div>

                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-orange-500/5 text-orange-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiMapPin />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="title h5 text-lg font-semibold">Location</h5>
                                <p className="text-slate-400 mt-3">C/54 Northwest Freeway, Suite 558, <br /> Houston, USA 485</p>

                                <div className="mt-5">
                                    <Link to="#" onClick={() => setModal(true)}
                                        data-type="iframe" className="video-play-icon read-more lightbox text-orange-500 font-medium">View on Google map</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            {modal && (
                <div className="w-full h-screen bg-slate-900/80 fixed top-0 left-0 bottom-0 right-0 z-999 flex items-center justify-center" role="status" aria-modal="true">
                    <div className="w-full h-full px-5 md:px-40 md-py-20 py-5">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d55431.05581015953!2d-95.461302!3d29.735948000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c36647a52ab1%3A0x70a301678672cb!2sBriargrove%20Park%2C%20Houston%2C%20TX%2C%20USA!5e0!3m2!1sen!2sin!4v1710322657489!5m2!1sen!2sin" width="100%" height="100%" title="myfram" loading="lazy"></iframe>
                    </div>
                    <button className="text-slate-400 absolute top-[20px] right-[20px]" onClick={() => setModal(false)}>
                        <FiX className="size-5" />
                    </button>
                </div>
            )}
            <ScrollToTop />
        </>
    )
}