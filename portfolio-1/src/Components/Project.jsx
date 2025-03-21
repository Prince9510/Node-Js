/* eslint-disable no-unused-vars */
import React from 'react'
import '../CSS/Project.css'

export default function Contact() {

  return (
    <>
      <div className="portfolio pb-24 flex justify-center">
        <div className="inner-portfolio">
          <div className="experience block md:flex items-center">
            <div className="frist-experienceBox">
              <small>WORKING PROCESS</small>
              <h2 className='uppercase'>lastet working <span className='h2-span'>Project</span></h2>
            </div>
            <div className="second-experienceBox flex items-center pl-7 py-1">
              <p className='text-white'>Here are some of my recent projects, showcasing my expertise in web development. Each project reflects my commitment to building responsive, high-performing, and visually appealing websites</p>
            </div>
          </div>


          <div className="sliderSlick-1 mt-12">


            <a href="" target='_blank'>

              <div className="slide-box flex flex-col" >
                <img src="employee managment system.png" alt="" />
                {/* <img src="p9.png" alt="" /> */}

                <h1 className='text-white uppercase'>
                  employee and task managment system
                </h1>

                <p className='text-white'>
                The Employee and Task Management System helps businesses manage employee details, assign tasks, track progress, and handle payroll efficiently. Built using the MERN stack and PostgreSQL, it offers a user-friendly interface and secure role-based access for streamlined workforce and task management.
                </p>

              </div>
            </a>


            <a href="" target='_blank'>

              <div className="slide-box flex flex-col" >
                <img src="admin panel.png" alt="" />
                {/* <img src="p9.png" alt="" /> */}

                <h1 className='text-white uppercase'>
                  Admin panel
                </h1>

                <p className='text-white'>
                {/* The Employee and Task Management System helps businesses manage employee details, assign tasks, track progress, and handle payroll efficiently. Built using the MERN stack and PostgreSQL, it offers a user-friendly interface and secure role-based access for streamlined workforce and task management. */}
                Building an Admin Panel using EJS for the backend to manage products. The panel allows admins to add new products and view existing ones in a simple, dynamic interface. This system streamlines product management, making it easy for administrators to handle product data efficiently.
                </p>

              </div>
            </a>




            <a href="https://moneymanagerredux.netlify.app/" target='_blank'>

              <div className="slide-box flex flex-col" >
                <img src="p9.png" alt="" />
                {/* <img src="p9.png" alt="" /> */}

                <h1 className='text-white uppercase'>
                  money manager
                </h1>

                <p className='text-white'>MoneyManager is a React Redux app for tracking expenses and managing budgets, offering real-time balance updates, transaction history, and efficient credit-debit management.</p>

              </div>
            </a>


           







            <a href="https://bellavitawoman.netlify.app/" target='_blank'>
              <div className="slide-box flex flex-col">
                <img src="p1.png" alt="" />

                <h1 className='text-white uppercase'>
                  bellavita&apos;s clone
                </h1>

                <p className='text-white'>Bellavita Clone is a replica of the Bellavita e-commerce platform, featuring a modern design, responsive interface, and functional product pages that showcase women&apos;s fashion collections with smooth browsing and shopping experiences.</p>

              </div>
            </a>


            <a href="https://nexusorientedsoftware.netlify.app/" target='_blank'>
              <div className="slide-box flex flex-col">
                <img src="p3.png" alt="" />

                <h1 className='text-white uppercase'>
                  nexus
                </h1>

                <p className='text-white'>Oriented Software is a professional website showcasing cutting-edge software solutions, offering seamless navigation, detailed service descriptions, and a modern, user-friendly interface.</p>

              </div>
            </a>




          </div>
        </div>
      </div>
    </>
  )
}