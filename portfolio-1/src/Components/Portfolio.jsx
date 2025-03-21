/* eslint-disable no-unused-vars */
import React from 'react'
import '../CSS/Portfolio.css'
export default function Portfolio() {
  return (
    <>
      <div className="portfolio flex justify-center"> 
        <div className="inner-portfolio"> 
            <div className="experience block md:flex items-center"> 
              <div className="frist-experienceBox"> 
                <small>MY SKILL</small>
                <h2 className='uppercase'>Work and <span className='h2-span'>skill</span></h2>
              </div>
              <div className="second-experienceBox flex items-center pl-7 py-1">
                <p className='text-white'>I have developed a variety of projects, focusing on delivering high-quality web solutions with attention to detail and functionality, ensuring a seamless user experience.</p>
              </div>
            </div>
            
    {/* ///////// card details  */}

            <div className="main-cards my-20"> 
              <div className="card px-4 pt-3 pb-4">
                <h5 className='uppercase py-2'>Education</h5>
                <p className='text-white'>Bachelor of Computer Applications (BCA) student at Saurashtra University. Focus on full-stack development, with a strong foundation in programming languages like C, JavaScript, and HTML/CSS.</p>

              </div>
              <div className="card px-4 pt-3 pb-4">
              <h5 className='uppercase py-2'>Skills</h5>
                <p className='text-white'>Proficient in HTML, CSS, JavaScript, React.js, and PostgreSQL. Experienced in building dynamic, user-friendly web applications with a focus on performance and scalability.</p>
                
              </div>
              <div className="card px-4 pt-3 pb-4">
              <h5 className='uppercase py-2'>Projects</h5>
                <p className='text-white'>
                Developed an Employee Management System and Admin Panel to streamline HR tasks efficiently.               
                 </p>
                
              </div>
              <div className="card px-4 pt-3 pb-4">
              <h5 className='uppercase py-2'>Future Goals</h5>
                <p className='text-white'>
                As a full-stack developer, my future goals include mastering emerging technologies, building scalable applications, enhancing user experiences, and leading innovative projects to solve real-world problems efficiently.
                  </p>
              </div>
            </div>


            {/* ////////////////// //////////////// */}


            <div className="main-cricle grid">


            <div className="cricle flex items-center flex-col">
              <div className="in-cri-3 flex justify-center items-center">
                  <div className="in-inCri-3 flex justify-center items-center ">
                    {/* <strong className='text-white'>90<span className='st-span'>%</span></strong> */}
                    <img src="react-2.svg" alt="" />
                  </div>
                </div>
                    <span className='cir-span pt-3 text-white'>React</span>
              </div>

              <div className="cricle flex items-center flex-col">
              <div className="in-cri-2 flex justify-center items-center">
                  <div className="in-inCri-2 flex justify-center items-center ">
                    {/* <strong className='text-white'>80<span className='st-span'>%</span></strong> */}
                    <img src="node.svg" alt="" />
                  </div>
                </div>
                    <span className='cir-span pt-3 text-white'>Node.js</span>
              </div>
              <div className="cricle flex items-center flex-col">
              <div className="in-cri-1 flex justify-center items-center">
                  <div className="in-inCri-1 flex justify-center items-center ">
                    {/* <strong className='text-white'>75<span className='st-span'>%</span></strong> */}
                    <img src="MongoDB.svg" alt="" />

                  </div>
                </div>
                    <span className='cir-span pt-3 text-white'>MongoDB</span>
              </div>


              


              

              <div className="cricle flex items-center flex-col">
                <div className="in-cri flex justify-center items-center">
                  <div className="in-inCri flex justify-center items-center ">
                    {/* <strong className='text-white'>70<span className='st-span'>%</span></strong> */}
                    <img src="PostgreSQL.svg" alt="" />

                  </div>
                </div>
                    <span className='cir-span pt-3 text-white'>PostgreSQL</span>
              </div>
            </div>


        </div>
      </div>
    </>
  )
}
 