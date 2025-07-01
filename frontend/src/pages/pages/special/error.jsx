import React from "react";
import { Link } from "react-router-dom";

import logoDark from '../../../assets/images/logo-dark.png'
import logoLight from '../../../assets/images/logo-light.png'
import errorImg from '../../../assets/images/error.svg'

import Switcher from "../../../components/switcher";
import BackToHome from "../../../components/back-to-home";

export default function Error(){
    return(
        <>
        <section className="relative bg-orange-500/5">
            <div className="container-fluid relative">
                <div className="grid grid-cols-1">
                    <div className="flex flex-col min-h-screen justify-center md:px-10 py-10 px-4">
                        <div className="text-center">
                            <Link to="/">
                                <img src={logoDark} className="mx-auto block dark:hidden" alt=""/>
                                <img src={logoLight} className="mx-auto hidden dark:block" alt=""/>
                            </Link>
                        </div>
                        <div className="title-heading text-center my-auto">
                            <img src={errorImg} className="mx-auto w-72" alt=""/>
                            <h1 className="mt-8 mb-6 md:text-5xl text-3xl font-bold">Page Not Found?</h1>
                            <p className="text-slate-400">Whoops, this is embarassing. <br/> Looks like the page you were looking for wasn't found.</p>
                            
                            <div className="mt-4">
                                <Link to="/" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-white rounded-md">Back to Home</Link>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="mb-0 text-slate-400">© {new Date().getFullYear()} Zyqora. Design & Develop with <i className="mdi mdi-heart text-red-600"></i> by <Link to="https://Zyqora.in/" target="_blank" className="text-reset">Zyqora</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Switcher/>
        <BackToHome/>
        </>
    )
}