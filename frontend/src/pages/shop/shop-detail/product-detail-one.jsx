import React,{useState} from "react";
import { Link } from "react-router-dom";

import Tagline from "../../../components/tagline";
import Navbar from "../../../components/navbar";
import ProductDetail from "../../../components/product-detail";
import ProductAboutTab from "../../../components/product-about-tab";
import ArrivalItem from "../../../components/arrival-item";
import Footer from "../../../components/footer";
import Switcher from "../../../components/switcher";
import ScrollToTop from "../../../components/scroll-to-top";

import image1 from '../../../assets/images/shop/mens-jecket.jpg'
import image2 from '../../../assets/images/shop/mens-jecket-3.jpg'
import image3 from '../../../assets/images/shop/mens-jecket-left.jpg'
import image4 from '../../../assets/images/shop/mens-jecket-back.jpg'
import image5 from '../../../assets/images/shop/mens-jecket-4.jpg'

import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

export default function ProductDetailOne(){
    const [photoIndex, setActiveIndex] = useState(0);
    const [isOpen, setOpen] = useState(false);
    const images = [
        image1,
        image2,
        image3,
        image4,
        image5
    ];
    const handleCLick = (index) => {
        setActiveIndex(index)
        setOpen(true);
    }
    return(
        <>
        <Tagline/>
        <Navbar navClass="defaultscroll is-sticky tagline-height"/>
        <section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
            <div className="container relative">
                <div className="grid grid-cols-1 mt-14">
                    <h3 className="text-3xl leading-normal font-semibold">Mens Brown Jecket</h3>
                </div>

                <div className="relative mt-3">
                    <ul className="tracking-[0.5px] mb-0 inline-block">
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/shop-grid">Store</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Mens Brown Jecket</li>
                    </ul>
                </div>
            </div>
        </section>

        <section className="relative md:py-24 py-16">
            <div className="container relative">
                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="lg:col-span-5">
                        <div className="grid md:grid-cols-12 gap-3">
                            <div className="md:col-span-12">
                                <Link to="#" onClick={() => handleCLick(0)} className="lightbox duration-500 group-hover:scale-105" title="">
                                    <img src={image1} className="shadow dark:shadow-gray-700" alt=""/>
                                </Link>
                            </div>
                            <div className="md:col-span-6">
                                <Link to="#" onClick={() => handleCLick(1)} className="lightbox duration-500 group-hover:scale-105" title="">
                                    <img src={image2} className="shadow dark:shadow-gray-700" alt=""/>
                                </Link>
                            </div>
                            <div className="md:col-span-6">
                                <Link to="#" onClick={() => handleCLick(2)} className="lightbox duration-500 group-hover:scale-105" title="">
                                    <img src={image3} className="shadow dark:shadow-gray-700" alt=""/>
                                </Link>
                            </div>
                            <div className="md:col-span-12">
                                <Link to="#" onClick={() => handleCLick(3)} className="lightbox duration-500 group-hover:scale-105" title="">
                                    <img src={image4} className="shadow dark:shadow-gray-700" alt=""/>
                                </Link>
                            </div>
                            <div className="md:col-span-12">
                                <Link to="#" onClick={() => handleCLick(4)} className="lightbox duration-500 group-hover:scale-105" title="">
                                    <img src={image5} className="shadow dark:shadow-gray-700" alt=""/>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <ProductDetail/>
                    </div>
                </div>

                <ProductAboutTab/>
            </div>

            <ArrivalItem/>
        </section>
        <Footer/>
        <Switcher/>
        {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setOpen( false )}
                    onMovePrevRequest={() =>
                        setActiveIndex((photoIndex + images.length - 1) % images.length,
                        )
                    }
                    onMoveNextRequest={() =>
                        setActiveIndex((photoIndex + 1) % images.length,
                        )
                    }
                />
            )}
        <ScrollToTop/>
        </>
    )
}