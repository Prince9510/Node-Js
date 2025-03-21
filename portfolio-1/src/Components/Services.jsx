/* eslint-disable no-unused-vars */
import React from 'react'
import '../CSS/Services.css'
export default function Portfolio() {
  return (
    <>
      <div className="portfolio flex justify-center"> 
        <div className="inner-portfolio"> 
 
            <div className="experience mt-32 block md:flex items-center"> 
              <div className="frist-experienceBox"> 
                <small>WHAT WE DO</small>
                <h2 className='uppercase'>Services and <span className='h2-span'>Solutions</span></h2>
              </div>
              <div className="second-experienceBox flex items-center pl-7 py-1">
                <p className='text-white'>I specialize in creating responsive, modern websites with clean code and user-friendly interfaces, delivering scalable solutions from concept to deployment.</p>
              </div>
            </div>
            



            


             <div className="main-services-card pt-16 pb-32 grid"> 
              <div className="services-card same-services py-7 flex flex-col items-center">
              <i className="ri-code-box-fill"></i>
              <h4 className='same-h4'>Web Development</h4>
              <ul className='pt-4 same-ul'>
                <li className='p-1'>Modern Website Design</li>
                <li className='p-1'>Clean, Minimalistic Interfaces</li>
                <li className='p-1'>Interactive Web Experiences</li>
                <li className='p-1'>Responsive Layouts</li>
                <li className='p-1'>Cross-Browser Compatibility</li>
              </ul>
              <div className='cri-effect'> 
                <div className="f4 fff">
                  <div className="f3 fff">
                     <div className="f2 fff">
                        <div className="f1 fff">

                        </div>
                    </div>
                    </div>
                </div>
             </div>
              </div>
              <div className="services-card diffrent-services py-7 flex flex-col items-center">
              <i className="ri-javascript-fill"></i>
              <h4 className='text-white'>BACKEND DEVELOPMENT</h4>
              <ul className='pt-4'>
                <li className='p-1'>RESTful API Development</li>
                <li className='p-1'>Database Integration (PostgreSQL, MongoDB)</li>
                <li className='p-1'>Server-Side Logic (Node.js, Express)</li>
                <li className='p-1'>Authentication & Authorization (JWT)</li>
                <li className='p-1'>Scalable Microservices Architecture</li>
              </ul>
              <div className='cri-effect'> 
                <div className="f4 fff">
                  <div className="f3 fff">
                     <div className="f2 fff">
                        <div className="f1 fff">

                        </div>
                    </div>
                    </div>
                </div>
             </div>
              </div>
              <div className="services-card same-services py-7 flex flex-col items-center"> 
              <i className="ri-seo-fill"></i>
              <h4 className='same-h4'>FULL-STACK INNOVATION</h4>
              <ul className='pt-4 same-ul' >
                <li className='p-1'>End-to-End Application Development</li>
                  <li className='p-1'>API Integration</li>
                <li className='p-1'>State Management (Redux, ContextAPI)</li>
                <li className='p-1'>Cross-Platform Integration</li>
                <li className='p-1'>Performance Optimization</li>
              </ul>
              <div className='cri-effect'> 
                <div className="f4 fff">
                  <div className="f3 fff">
                     <div className="f2 fff">
                        <div className="f1 fff">

                        </div>
                    </div>
                    </div>
                </div>
             </div>
              </div>
             </div>
        </div>
      </div>
    </>
  )
}
 