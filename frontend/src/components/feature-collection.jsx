import React from "react";
import { Link } from "react-router-dom";

import product1 from '../assets/images/categories/ladies-ware.jpg'
import product2 from '../assets/images/categories/chappal-shoes.jpg'
import product3 from '../assets/images/categories/sunglasses.jpg'
import product4 from '../assets/images/categories/mens-ware.jpg'

export default function FeaturedCollection(){
    return(
        <div className="container relative">
            <div className="grid grid-cols-1 justify-center text-center mb-6">
                <h5 className="font-semibold text-3xl leading-normal mb-4">Featured Collections</h5>
                <p className="text-slate-400 max-w-xl mx-auto">Shop the latest products from the most popular collections</p>
            </div>

            <div className="grid md:grid-cols-12 grid-cols-1 pt-6 gap-6">
                <div className="lg:col-span-4 md:col-span-6 md:order-1 order-2">
                    <div className="relative overflow-hidden group rounded-md shadow dark:shadow-gray-800">
                        <Link to="" className="">
                            <img src={product1} className="h-full w-full object-cover xl:h-[738.66px] lg:h-[614.66px] rounded-md group-hover:scale-110 duration-500" alt=""/>
                            <span className="bg-white dark:bg-slate-900 group-hover:text-orange-500 py-2 px-4 rounded-md shadow dark:shadow-gray-800 absolute mx-4 bottom-4 text-lg font-medium">Ladies Wear</span>
                        </Link>
                    </div>
                </div>
                
                <div className="lg:col-span-4 md:col-span-12 lg:order-2 order-3">
                    <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6">
                        <div className="relative overflow-hidden group rounded-md shadow dark:shadow-gray-800">
                            <Link to="" className="">
                                <img src={product2} className="group-hover:scale-110 duration-500" alt=""/>
                                <span className="bg-white dark:bg-slate-900 group-hover:text-orange-500 py-2 px-4 rounded-md shadow dark:shadow-gray-800 absolute mx-4 bottom-4 text-lg font-medium">Chappal & Shoes</span>
                            </Link>
                        </div>

                        <div className="relative overflow-hidden group rounded-md shadow dark:shadow-gray-800">
                            <Link to="" className="">
                                <img src={product3} className="group-hover:scale-110 duration-500" alt=""/>
                                <span className="bg-white dark:bg-slate-900 group-hover:text-orange-500 py-2 px-4 rounded-md shadow dark:shadow-gray-800 absolute mx-4 bottom-4 text-lg font-medium">Sunglasses</span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-4 md:col-span-6 lg:order-3 order-2">
                    <div className="relative overflow-hidden group rounded-md shadow dark:shadow-gray-800">
                        <Link to="" className="">
                            <img src={product4} className="h-full w-full object-cover xl:h-[738.66px] lg:h-[614.66px] rounded-md group-hover:scale-110 duration-500" alt=""/>
                            <span className="bg-white dark:bg-slate-900 group-hover:text-orange-500 py-2 px-4 rounded-md shadow dark:shadow-gray-800 absolute mx-4 bottom-4 text-lg font-medium">Mens Wear</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}