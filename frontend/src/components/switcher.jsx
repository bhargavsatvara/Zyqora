import React from "react";
import { Link } from "react-router-dom";
import {FiMoon, FiSun} from '../assets/icons/vander'

export default function Switcher(){

    let htmlTag = document.getElementsByTagName("html")[0]
    const changeTheme = (e) => {
        if (htmlTag.className.includes("dark")) {
            htmlTag.className = 'light'
        } else {
            htmlTag.className = 'dark'
        }
    }

    const modeChange = () =>{
        const switcherRtl = document.getElementById("switchRtl")
        if(switcherRtl.innerText === "LTR"){
            htmlTag.dir = "ltr"
        }
        else{
            htmlTag.dir = "rtl"
        }
    }
    return(
        <>
        <div className="fixed top-1/4 -left-2 z-50">
            <span className="relative inline-block rotate-90">
                <input type="checkbox" className="checkbox opacity-0 absolute" id="chk" onChange={(e)=>changeTheme(e)}/>
                <label className="label bg-slate-900 dark:bg-white shadow dark:shadow-gray-800 cursor-pointer rounded-full flex justify-between items-center p-1 w-14 h-8" htmlFor="chk">
                    <FiMoon className="w-[18px] h-[18px] text-yellow-500"></FiMoon>
                    <FiSun className="w-[18px] h-[18px] text-yellow-500"></FiSun>
                    <span className="ball bg-white dark:bg-slate-900 rounded-full absolute top-[2px] left-[2px] w-7 h-7"></span>
                </label>
            </span>
        </div>

        <div className="fixed top-[40%] -left-3 z-50">
            <Link to="" id="switchRtl" onClick={()=>modeChange()}>
                <span className="py-1 px-3 relative inline-block rounded-b-md -rotate-90 bg-white dark:bg-slate-900 shadow-md dark:shadow dark:shadow-gray-800 font-semibold rtl:block ltr:hidden" >LTR</span>
                <span className="py-1 px-3 relative inline-block rounded-b-md -rotate-90 bg-white dark:bg-slate-900 shadow-md dark:shadow dark:shadow-gray-800 font-semibold ltr:block rtl:hidden">RTL</span>
            </Link>
        </div>

        </>
    )
}