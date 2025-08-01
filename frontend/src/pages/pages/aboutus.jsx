import React, { useState } from "react";
import { Link } from "react-router-dom";
import aboutImg from "../../assets/images/ab1.jpg"
import aboutImg2 from "../../assets/images/ab2.jpg"
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollToTop from "../../components/scroll-to-top";
import { FiPhone, FiMapPin, FiX, FiDribbble, FiLinkedin, FiFacebook, FiInstagram, FiTwitter, } from "../../assets/icons/vander"
import client4 from '../../assets/images/client/04.jpg'
import client5 from '../../assets/images/client/05.jpg'
import client6 from '../../assets/images/client/06.jpg'
import client7 from '../../assets/images/client/16.jpg'
import client8 from '../../assets/images/client/07.jpg'

export default function AboutUS() {
    let [modal, setModal] = useState(false)
    const promiseData = [
        {
            icon: 'mdi mdi-truck-check-outline',
            title: 'Free Shipping',
            desc: 'The phrasal sequence of the is now so that many campaign and benefit'
        },
        {
            icon: 'mdi mdi-account-arrow-right-outline',
            title: '24/7 Support',
            desc: 'The phrasal sequence of the is now so that many campaign and benefit'
        },
        {
            icon: 'mdi mdi-cash-multiple',
            title: 'Payment Process',
            desc: 'The phrasal sequence of the is now so that many campaign and benefit'
        },
    ]
    const teamData = [
        {
            image: client4,
            name: 'Jack John',
            possition: 'Designer'
        },
        {
            image: client7,
            name: 'Krista John',
            possition: 'Designer'
        },
        {
            image: client6,
            name: 'Roger Jackson',
            possition: 'Designer'
        },
        {
            image: client8,
            name: 'Johnny English',
            possition: 'Designer'
        },
    ]

    return (
        <>
            <Navbar navClass="defaultscroll is-sticky" navlight={true} />
            <section className="relative table w-full items-center py-36 bg-[url('../../assets/images/hero/pages.jpg')] bg-top bg-no-repeat bg-cover" role="banner">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
                <div className="container relative">
                    <div className="grid grid-cols-1 pb-8 text-center mt-10">
                        <h3 className="mb-3 text-4xl leading-normal tracking-wider font-semibold text-white">About Us</h3>

                        <p className="text-slate-400 text-lg max-w-xl mx-auto">Believe in Craftsmanship and Luxurious Design.</p>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="tracking-[0.5px] mb-0 inline-block">
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">Zyqora</Link></li>
                        <li className="inline-block text-base text-white/50 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out text-white" aria-current="page">About</li>
                    </ul>
                </div>
            </section>

            <section className="relative md:py-24 py-16" role="main">
                <div className="container relative" role="region" aria-label="Our Shop">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                        <div className="lg:col-span-5 md:col-span-6">
                            <img src={aboutImg} className="rounded-t-full shadow-md dark:shadow-gray-800" alt="" />
                        </div>

                        <div className="lg:col-span-7 md:col-span-6">
                            <div className="lg:ms-8">
                                <h6 className="text-orange-500 font-semibold uppercase text-lg">Our Shop</h6>
                                <h5 className="font-semibold text-3xl leading-normal my-4">Focusing on Quality <br /> Material, Good Design</h5>
                                <p className="text-slate-400 max-w-xl">Donec non interdum nisl. Sed ut est ac lacus sodales convallis. Nam non velit justo. Mauris vel ultrices tortor. Proin bibendum magna porttitor porttitor suscipit. Praesent sit amet consequat eros. Quisque ullamcorper ornare vulputate. Nam sodales sem id diam sollicitudin, id lobortis tellus tincidunt.</p>

                                <div className="flex items-center mt-6">
                                    <FiPhone className="w-6 h-6 me-4"></FiPhone>
                                    <div className="">
                                        <h5 className="title font-bold mb-0">Phone</h5>
                                        <Link to="tel:+152534-468-854" className="tracking-wide text-orange-500">+152 534-468-854</Link>
                                    </div>
                                </div>

                                <div className="flex items-center mt-6">
                                    <FiMapPin className="w-6 h-6 me-4"></FiMapPin>
                                    <div className="">
                                        <h5 className="title font-bold mb-0">Location</h5>
                                        <Link to="#" onClick={() => setModal(true)} className="text-orange-500" >View on Google map</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container relative md:mt-24 mt-16" role="region" aria-label="Founder">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                        <div className="lg:col-span-5 md:col-span-6 md:order-2 order-1">
                            <img src={aboutImg2} className="rounded-b-full shadow-md dark:shadow-gray-800" alt="" />
                        </div>

                        <div className="lg:col-span-7 md:col-span-6 md:order-1 order-2">
                            <h6 className="text-orange-500 font-semibold uppercase text-lg">Founder</h6>
                            <h5 className="font-semibold text-3xl leading-normal my-4">Maria J. Rose</h5>
                            <p className="text-slate-400 max-w-xl">Donec non interdum nisl. Sed ut est ac lacus sodales convallis. Nam non velit justo. Mauris vel ultrices tortor. Proin bibendum magna porttitor porttitor suscipit. Praesent sit amet consequat eros. Quisque ullamcorper ornare vulputate. Nam sodales sem id diam sollicitudin, id lobortis tellus tincidunt.</p>

                            <ul className="list-none mt-6 space-x-3">
                                <li className="inline"><Link to="https://dribbble.com/Zyqora" target="_blank" className="inline-flex hover:text-orange-500 dark:hover:text-orange-500"><FiDribbble className="size-5 align-middle" title="dribbble"></FiDribbble></Link></li>
                                <li className="inline"><Link to="http://linkedin.com/company/Zyqora" target="_blank" className="inline-flex hover:text-orange-500 dark:hover:text-orange-500"><FiLinkedin className="size-5 align-middle" title="Linkedin"></FiLinkedin></Link></li>
                                <li className="inline"><Link to="https://www.facebook.com/Zyqora" target="_blank" className="inline-flex hover:text-orange-500 dark:hover:text-orange-500"><FiFacebook className="size-5 align-middle" title="facebook"></FiFacebook></Link></li>
                                <li className="inline"><Link to="https://www.instagram.com/Zyqora/" target="_blank" className="inline-flex hover:text-orange-500 dark:hover:text-orange-500"><FiInstagram className="size-5 align-middle" title="instagram"></FiInstagram></Link></li>
                                <li className="inline"><Link to="https://twitter.com/Zyqora" target="_blank" className="inline-flex hover:text-orange-500 dark:hover:text-orange-500"><FiTwitter className="size-5 align-middle" title="twitter"></FiTwitter></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container relative md:mt-24 mt-16" role="region" aria-label="Our Promise">
                    <div className="grid grid-cols-1 justify-center text-center mb-4">
                        <h6 className="text-orange-500 font-semibold uppercase text-lg">Our Promise</h6>
                        <h5 className="font-semibold text-3xl leading-normal my-4">We Designed and <br /> Developed Products</h5>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 mt-6 gap-6">
                        {promiseData.map((item, index) => {
                            return (
                                <div className="p-6 shadow hover:shadow-md dark:shadow-gray-800 dark:hover:shadow-gray-700 duration-500 rounded-md bg-white dark:bg-slate-900" key={index}>
                                    <i className={`text-4xl text-orange-500 ${item.icon}`}></i>

                                    <div className="content mt-6">
                                        <Link to="" className="title h5 text-xl font-medium hover:text-orange-500">{item.title}</Link>
                                        <p className="text-slate-400 mt-3">{item.desc}</p>

                                        <div className="mt-4">
                                            <Link to="" className="text-orange-500">Read More <i className="mdi mdi-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="container relative md:mt-24 mt-16" role="region" aria-label="Our Minds">
                    <div className="grid grid-cols-1 justify-center text-center mb-4">
                        <h6 className="text-orange-500 font-semibold uppercase text-lg">Our Minds</h6>
                        <h5 className="font-semibold text-3xl leading-normal my-4">Meet Our Team Members</h5>
                    </div>

                    <div className="grid md:grid-cols-12 grid-cols-1 mt-6 gap-6">
                        {teamData.map((item, index) => {
                            return (
                                <div className="lg:col-span-3 md:col-span-6" key={index}>
                                    <div className="group text-center">
                                        <div className="relative inline-block mx-auto h-52 w-52 rounded-full overflow-hidden">
                                            <img src={item.image} className="" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black h-52 w-52 rounded-full opacity-0 group-hover:opacity-100 duration-500"></div>

                                            <ul className="list-none absolute start-0 end-0 -bottom-20 group-hover:bottom-5 duration-500">
                                                <li className="inline"><Link to="" className="size-8 inline-flex items-center justify-center align-middle rounded-full bg-orange-500 text-white"><FiFacebook className="h-4 w-4"></FiFacebook></Link></li>
                                                <li className="inline"><Link to="" className="size-8 inline-flex items-center justify-center align-middle rounded-full bg-orange-500 text-white"><FiInstagram className="h-4 w-4"></FiInstagram></Link></li>
                                                <li className="inline"><Link to="" className="size-8 inline-flex items-center justify-center align-middle rounded-full bg-orange-500 text-white"><FiLinkedin className="h-4 w-4"></FiLinkedin></Link></li>
                                            </ul>
                                        </div>

                                        <div className="content mt-3">
                                            <Link to="" className="text-lg font-semibold hover:text-orange-500 duration-500">{item.name}</Link>
                                            <p className="text-slate-400">{item.possition}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
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