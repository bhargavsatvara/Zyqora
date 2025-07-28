import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Switcher from "../../components/switcher";
import ScrollToTop from "../../components/scroll-to-top";
import { brandsAPI } from "../../services/api";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await brandsAPI.getBrands({
                page: 1,
                limit: 100 // Get all brands
            });
            
            if (response.data && response.data.data && response.data.data.brands) {
                setBrands(response.data.data.brands);
            } else if (response.data && Array.isArray(response.data)) {
                setBrands(response.data);
            } else {
                setBrands([]);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    // Group brands into columns (3 columns)
    const groupBrandsIntoColumns = (brandsList) => {
        const columns = [[], [], []];
        brandsList.forEach((brand, index) => {
            columns[index % 3].push(brand);
        });
        return columns;
    };

    // Loading skeleton for brands
    const BrandsSkeleton = () => (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            {[1, 2, 3].map((column) => (
                <div key={column} className="animate-pulse">
                    <ul className="list-none space-y-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <li key={item} className="ms-0">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-200 rounded me-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Navbar navClass="defaultscroll is-sticky" />
            <section className="relative table w-full py-20 lg:py-24 bg-gray-50 dark:bg-slate-800">
                <div className="container relative">
                    <div className="grid grid-cols-1 text-center mt-14">
                        <h3 className="text-3xl leading-normal font-semibold">Our Brands</h3>
                    </div>
                </div>

                <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                    <ul className="tracking-[0.5px] mb-0 inline-block">
                        <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Brands</li>
                    </ul>
                </div>
            </section>

            <section className="relative md:py-24 py-16">
                <div className="container relative">
                    {loading ? (
                        <BrandsSkeleton />
                    ) : (
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                            {groupBrandsIntoColumns(brands).map((column, columnIndex) => {
                                return (
                                    <div className="" key={columnIndex}>
                                        <ul className="list-none space-y-2">
                                            {column.map((brand, index) => {
                                                return (
                                                    <li key={brand._id || index} className="ms-0">
                                                        <Link 
                                                            to={`/products?brand_id=${brand._id}`} 
                                                            className="text-slate-400 text-lg hover:text-orange-500 transition-colors duration-300"
                                                        >
                                                            <i className="mdi mdi-shopping-outline text-orange-500 me-2"></i>
                                                            {brand.name}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
            <Switcher />
            <ScrollToTop />
        </>
    )
}