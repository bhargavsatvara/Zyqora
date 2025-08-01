import React, { useState } from "react";
import { Link } from "react-router-dom";

import image1 from "../../assets/images/ab1.jpg"
import image2 from "../../assets/images/ab3.jpg"
import image3 from "../../assets/images/ab4.jpg"

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollToTop from "../../components/scroll-to-top";

import {FiPhone, FiMapPin, FiX} from "../../assets/icons/vander"

export default function OurStore(){
    let [modal, setModal] = useState(false)
    return(
        <>
        <Navbar navClass="defaultscroll is-sticky"/>
        <section className="relative table w-full py-20 lg:py-24 bg-gray-50 dark:bg-slate-800">
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-14">
                    <h3 className="text-3xl leading-normal font-semibold">Our Store</h3>
                </div>
            </div>

            <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                <ul className="tracking-[0.5px] mb-0 inline-block">
                    <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                    <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                    <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Stores</li>
                </ul>
            </div>
        </section>

        <section className="relative md:py-24 py-16">
            <div className="container relative">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <img src={image1} className="rounded-md shadow-md dark:shadow-gray-800" alt=""/>

                        <h5 className="font-semibold text-xl leading-normal my-4">Zyqora, U.S.A.</h5>

                        <p className="text-slate-400">268 St, South New York/NY 98944, <br/> United States</p>

                        <div className="flex items-center mt-4">
                            <FiPhone className="w-6 h-6 me-4"></FiPhone>
                            <div className="">
                                <h5 className="title font-bold mb-0">Phone</h5>
                                <Link to="tel:+152534-468-854" className="tracking-wide text-orange-500">+152 534-468-854</Link>
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                            <FiMapPin className="w-6 h-6 me-4"></FiMapPin>
                            <div className="">
                                <h5 className="title font-bold mb-0">Location</h5>
                                <Link to="#" onClick={()=>setModal(true)}>View on Google map</Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={image2} className="rounded-md shadow-md dark:shadow-gray-800" alt=""/>

                        <h5 className="font-semibold text-xl leading-normal my-4">Zyqora, U.S.A.</h5>

                        <p className="text-slate-400">268 St, South New York/NY 98944, <br/> United States</p>

                        <div className="flex items-center mt-4">
                            <FiPhone className="w-6 h-6 me-4"></FiPhone>
                            <div className="">
                                <h5 className="title font-bold mb-0">Phone</h5>
                                <Link to="tel:+152534-468-854" className="tracking-wide text-orange-500">+152 534-468-854</Link>
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                            <FiMapPin className="w-6 h-6 me-4"></FiMapPin>
                            <div className="">
                                <h5 className="title font-bold mb-0">Location</h5>
                                <Link to="#" onClick={()=>setModal(true)}>View on Google map</Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={image3} className="rounded-md shadow-md dark:shadow-gray-800" alt=""/>

                        <h5 className="font-semibold text-xl leading-normal my-4">Zyqora, U.S.A.</h5>

                        <p className="text-slate-400">268 St, South New York/NY 98944, <br/> United States</p>

                        <div className="flex items-center mt-4">
                            <FiPhone className="w-6 h-6 me-4"></FiPhone>
                            <div className="">
                                <h5 className="title font-bold mb-0">Phone</h5>
                                <Link to="tel:+152534-468-854" className="tracking-wide text-orange-500">+152 534-468-854</Link>
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                            <FiMapPin className="w-6 h-6 me-4"></FiMapPin>
                            <div className="">
                                <h5 className="title font-bold mb-0">Location</h5>
                                <Link to="#" onClick={()=>setModal(true)}>View on Google map</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        {modal && (
            <div className="w-full h-screen bg-slate-900/80 fixed top-0 left-0 bottom-0 right-0 z-999 flex items-center justify-center">
                <div className="w-full h-full px-5 md:px-40 md-py-20 py-5">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d55431.05581015953!2d-95.461302!3d29.735948000000004!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c36647a52ab1%3A0x70a301678672cb!2sBriargrove%20Park%2C%20Houston%2C%20TX%2C%20USA!5e0!3m2!1sen!2sin!4v1710322657489!5m2!1sen!2sin" width="100%" height="100%" title="myfram"  loading="lazy"></iframe>
                </div>
                <button className="text-slate-400 absolute top-[20px] right-[20px]" onClick={()=>setModal(false)}>
                    <FiX className="size-5"/>
                </button>
            </div>
        )}
        <ScrollToTop/>
        </>
    )
}