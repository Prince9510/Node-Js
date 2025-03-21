/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import '../CSS/Hero.css'
// import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-scroll';


export default function Hero() {

  useGSAP(() => {
    gsap.from(".hero-h1", {
      y: -100,
      duration: 0.7,
      opacity: 0,
      repeat: -1,
      repeatDelay: 2, // 2s cycle minus the total duration (0.7s + 0.6s)
    });
  
    gsap.from(".hero-detail", {
      y: -100,
      duration: 0.7,
      opacity: 0,
      delay: 0.1, // Start 0.6s after hero-h1
      repeat: -1,
      repeatDelay: 2, // Same cycle time adjustment for detail
    });
  }, []);
  


  return (
    <>
      <div className="main-hero flex justify-center">
        <div className="hero flex">
          <div className="hero-1 flex flex-col justify-center lg:justify-end">

            <h1 className='uppercase font-oswald font-bold pb-10 hero-h1'><span className='h1-span'>imagination</span> is more important than knowledge</h1>

            <div className="hero-detail flex items-center mb-10">
              <p className='pl-5 text-white'>Together we the people achieve more than any single person <br className='mid-br' /> could ever do alone. </p>
            </div>

          <Link to="contact" smooth={true} duration={500}>
            <button className='get-touch-btn flex justify-evenly py-6 items-center justify-center text-white'>
              GET IN TOUCH

              <div className="inner-btn-box">
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </button>
            </Link>

          </div>

          <div className="hero-2 hidden md:flex flex justify-center items-end">
            <img src="m1.png" alt="man" /> 
          </div>
        </div>
      </div>
    </>
  )
}
