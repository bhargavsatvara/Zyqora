import React, { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

import {FiChevronUp} from '../../../assets/icons/vander'
import { faqData, termsData } from "../../../data/data";
import ScrollToTop from "../../../components/scroll-to-top";


export default function Terms(){
    let [activeIndex, setActiveIndex] = useState(1)
    return(
        <>
        <Navbar navClass="defaultscroll is-sticky"/>
        <section className="relative table w-full py-32 lg:py-40 bg-gray-50 dark:bg-slate-800" role="banner">
            <div className="container relative">
                <div className="grid grid-cols-1 text-center mt-10">
                    <h3 className="text-3xl leading-normal font-semibold">Terms of Services</h3>
                </div>
            </div>
            
            <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                <ul className="tracking-[0.5px] mb-0 inline-block">
                    <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
                    <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                    <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="">Utility</Link></li>
                    <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                    <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">Terms</li>
                </ul>
            </div>
        </section>
        <section className="relative md:py-24 py-16" role="main">
            <div className="container relative" role="region" aria-label="Terms Content">
                <div className="md:flex justify-center">
                    <div className="md:w-3/4">
                        <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md">
                            <h5 className="text-xl font-semibold mb-4">Introduction :</h5>
                            <p className="text-slate-400">It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p>

                            <h5 className="text-xl font-semibold mb-4 mt-8">User Agreements :</h5>
                            <p className="text-slate-400">The most well-known dummy text is the 'Lorem Ipsum', which is said to have <b className="text-red-600">originated</b> in the 16th century. Lorem Ipsum is <b className="text-red-600">composed</b> in a pseudo-Latin language which more or less <b className="text-red-600">corresponds</b> to 'proper' Latin. It contains a series of real Latin words. This ancient dummy text is also <b className="text-red-600">incomprehensible</b>, but it imitates the rhythm of most European languages in Latin script. The <b className="text-red-600">advantage</b> of its Latin origin and the relative <b className="text-red-600">meaninglessness</b> of Lorum Ipsum is that the text does not attract attention to itself or distract the viewer's <b className="text-red-600">attention</b> from the layout.</p>
                            <p className="text-slate-400 mt-3">There is now an <b className="text-red-600">abundance</b> of readable dummy texts. These are usually used when a text is <b className="text-red-600">required purely</b> to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or <b className="text-red-600">nonsensical</b> stories.</p>
                            <p className="text-slate-400 mt-3">It seems that only <b className="text-red-600">fragments</b> of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p>
                            
                            <h5 className="text-xl font-semibold mb-4 mt-8">Restrictions :</h5>
                            <p className="text-slate-400">You are specifically restricted from all of the following :</p>
                            <ul className="list-none text-slate-400 mt-3">
                                {termsData.map((item,index)=>{
                                    return(
                                        <li className="flex mt-2 ms-0" key={index}><i className="mdi mdi-chevron-right text-orange-500 text-lg align-middle me-2"></i>{item}</li>
                                    )
                                })}
                            </ul>

                            <h5 className="text-xl font-semibold mt-8">Users Question & Answer :</h5>

                            <div className="mt-6">
                                {faqData.map((item,index)=>{
                                    return(
                                        <div className="relative shadow dark:shadow-gray-800 rounded-md overflow-hidden mt-4" key={index}>
                                            <h2 className="text-base font-semibold" id="accordion-collapse-heading-1">
                                                <button type="button" className={`flex justify-between items-center p-5 w-full font-medium text-start ${item.id === activeIndex ? 'bg-gray-50 dark:bg-slate-800 text-orange-500' : '' }`} onClick={()=>setActiveIndex(item.id)}>
                                                    <span>{item.title}</span>
                                                    <FiChevronUp className={`size-4 shrink-0 ${activeIndex === item.id ? '' :'rotate-180'}`}/>
                                                </button>
                                            </h2>
                                            <div className={ item.id === activeIndex ? '' : 'hidden' }>
                                                <div className="p-5">
                                                    <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-6">
                                <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-white rounded-md">Accept</Link>
                                <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-transparent hover:bg-orange-500 border-orange-500 text-orange-500 hover:text-white rounded-md ms-2">Decline</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        <ScrollToTop/>
        </>
    )
}