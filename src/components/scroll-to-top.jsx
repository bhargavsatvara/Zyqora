import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ScrollToTop(){
    let [visible, setVisible] = useState(false) 

    const toggleVisible = () => { 
        const scrolled = document.documentElement.scrollTop; 
        if (scrolled > 300){ 
          setVisible(true) 
        }  
        else if (scrolled <= 300){ 
          setVisible(false) 
        } 
      }; 

      const scrollToTop = () =>{ 
        window.scrollTo({ 
          top: 0,  
          behavior: 'smooth'
        }); 
    }; 

    window.addEventListener('scroll', toggleVisible); 
    return(
        <>
         <Link to="#" onClick={()=>scrollToTop()} id="back-to-top" className="back-to-top fixed text-lg rounded-full z-10 bottom-5 end-5 size-9 text-center bg-orange-500 text-white justify-center items-center" style={{display: visible ? 'inline-flex' : 'none'}}><i className="mdi mdi-arrow-up"></i></Link>
        </>
    )
}