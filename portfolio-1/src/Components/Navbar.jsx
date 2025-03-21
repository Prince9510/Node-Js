/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import '../CSS/Navbar.css';
import gsap from 'gsap';
import { Link } from 'react-scroll'; // Import Link from react-scroll

export default function Navbar() {
  const black = useRef(null);
  const side = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [blinkEffect, setBlinkEffect] = useState(false);

  // Sidebar animation for large screens
  const handleClick = () => {
    gsap.to(black.current, {
      right: 0,
      duration: 0.7,
      ease: 'power2.out',
    });
    gsap.to(side.current, {
      right: 0,
      duration: 0.7,
      delay: 0.2,
      ease: 'power2.out',
      display: 'block',
    });
  };

  // Close the sidebar for large screens
  const closeBox = () => {
    gsap.to(side.current, {
      right: '-100%',
      duration: 0.7,
      ease: 'power2.out',
      display: 'none',
    });
    gsap.to(black.current, {
      right: '-100%',
      duration: 0.7,
      ease: 'power2.out',
    });
  };

  // Toggle sidebar for medium screen size
  const toggleSidebar = () => {
    setShowSidebar(true);
  };

  // Close sidebar for medium screens with background transition and blink effect
  const closeSidebar = () => {
    const sidebar = document.querySelector('.md-screen-sideBar');
    if (sidebar) {
      sidebar.style.backgroundColor = 'white'; 
      setTimeout(() => {
        sidebar.style.backgroundColor = '';
      }, 100);
      setShowSidebar(false);
    }

    setBlinkEffect(true);
    setTimeout(() => setBlinkEffect(false), 500);
  };

  return (
    <>
      <div className="main-navbar flex justify-center">
        <div className="navbar-inner-box flex justify-between">
          <div className="nav-frist-part flex justify-center items-center">
            <h1 className="text-3xl font-semibold text-white h1-portfolio font-oswald">
              PORTFOLIO
            </h1>
          </div>
          <div className="nav-second-part flex items-center">
            {/* Use Link from react-scroll for smooth scrolling */}
            <Link to="hero" smooth={true} duration={500} className="ms-8 font-rubik nav-a">HOME</Link>
            <Link to="about" smooth={true} duration={500} className="ms-8 font-rubik nav-a">ABOUT</Link>
            <Link to="service" smooth={true} duration={500} className="ms-8 font-rubik nav-a">SERVICE</Link>
            <Link to="portfolio" smooth={true} duration={500} className="ms-8 font-rubik nav-a">PORTFOLIO</Link>
            <Link to="contact" smooth={true} duration={500} className="ms-8 font-rubik nav-a">CONTACT</Link>
            <img src="menu.svg" className="ml-16 hidden lg:block" alt="" onClick={handleClick} />
            <i onClick={toggleSidebar} className="ri-menu-line text-white text-3xl lg:hidden ml-16"></i>
          </div> 
        </div>
      </div>

      <div ref={black} className="black-nav"></div>
      <div ref={side} className="side-bar p-6">
        <div className="close-box flex justify-end">
          <div onClick={closeBox} className="close flex justify-center items-center">
            <i className="ri-close-large-line text-white"></i>
          </div>
        </div>
        <h1 className="text-3xl font-oswald font-semibold text-white">PORTFOLIO</h1>

        <p className="font-rubik text-white font-extralight pt-5">
        My name is Satasiya Prince, and I am from Rajkot. I am currently in my second year of BCA at Saurashtra University. In addition, I am pursuing Full Stack Development at Red and White Multimedia Education. I have completed my front-end skills and am now focusing on enhancing my back-end knowledge to become a well-rounded Full Stack Developer.
        </p>

        <div className="nav-social flex mt-10">
          <a href="https://www.instagram.com/_prince_2999?igsh=MXdod3Ayc2Yxcmd4YQ==">
          <div className="inner-nav-social flex justify-center items-center text-white">
            <i className="ri-instagram-fill"></i>
          </div>
        </a>          
    <a href="https://www.linkedin.com/in/prince-satasiya-23610b284?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
          <div className="inner-nav-social flex justify-center items-center text-white ms-3">
            <i className="ri-linkedin-fill"></i>
          </div>
          </a>
          <a href="https://x.com/?lang=en">
          <div className="inner-nav-social flex justify-center items-center text-white ms-3">
            <i className="ri-twitter-fill"></i>
          </div>
          </a>
          <a href="https://www.facebook.com/">
          <div className="inner-nav-social flex justify-center items-center text-white ms-3">
            <i className="ri-facebook-fill"></i>
          </div>
          </a>
        </div>
      </div>

      <div className={`md-screen-sideBar ${!showSidebar ? 'hide' : ''}`}>
        <div className="icon-section flex">
          <div className="mid-screenIcons flex justify-center items-center">
            <a href="https://wa.me/8160636847" target='_blank'>
            <i className="ri-phone-fill"></i>
            </a>
          </div>
          <div className="mid-screenIcons flex justify-center items-center">
          <a target='_blank' href="https://www.google.com/maps/@22.2789615,70.7932843,14z?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D">
            <i className="ri-map-pin-fill"></i>
          </a>
          </div>
          <div className="mid-screenIcons flex justify-center items-center">
            <Link to="hero" smooth={true} duration={500} className={`font-rubik font-extralight mid-screen-link cursor-pointer ${blinkEffect ? 'blink' : ''}`} onClick={closeSidebar}>CLOSE</Link>
          </div>
        </div>

        <div className="mid-items-section flex items-center pl-4 font-rubik">
          <Link to="hero" smooth={true} duration={500}>HOME</Link>
        </div>
        <div className="mid-items-section flex items-center pl-4 font-rubik">
          <Link to="about" smooth={true} duration={500}>ABOUT</Link>
        </div>
        <div className="mid-items-section flex items-center pl-4 font-rubik">
          <Link to="service" smooth={true} duration={500}>SERVICE</Link>
        </div>
        <div className="mid-items-section flex items-center pl-4 font-rubik">
          <Link to="portfolio" smooth={true} duration={500}>PORTFOLIO</Link>
        </div>
        <div className="mid-items-section flex items-center pl-4 font-rubik">
          <Link to="contact" smooth={true} duration={500}>CONTACT</Link>
        </div>
      </div>
    </>
  );
}
