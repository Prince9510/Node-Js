/* eslint-disable no-unused-vars */
import React from 'react'
import '../CSS/About.css'
import { Link } from 'react-scroll'


export default function About() {
  return (
    <>
      <div className="main flex py-32 justify-center">
        <div className="about md:flex">
          <div className="about-1 flex justify-center">
            <div className="about-photo"></div>
          </div>
          <div className="about-2 flex flex-col justify-center">
            <h2 className='font-oswald text-white font-bold'>Failure is the condiment That Gives <span className='about-span'>Success</span></h2>

        <p className='text-white py-10'>
        I am a passionate Full Stack Developer with expertise in building robust and scalable web applications using MongoDB, Express.js, React, and Node.js (MERN stack), alongside proficiency in PostgreSQL for relational database management. With a strong foundation in both front-end and back-end development, I thrive in creating seamless user experiences and efficient server-side solutions.

        </p>

        <Link to="contact" smooth={true} duration={500}>

            <button className='get-touch-btn flex justify-evenly py-6 items-center justify-center text-white'>
              GET IN TOUCH

              <div className="inner-btn-box">
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
