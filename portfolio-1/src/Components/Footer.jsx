/* eslint-disable no-unused-vars */
import Marquee from 'react-fast-marquee';
import '../CSS/Footer.css'
import { Link } from 'react-scroll';

export default function Footer() {
  

    
      return (
        <div className="main-footer">

        <div className="languages">
          <div className="lang-in">
            <Marquee gradient={false} speed={50} pauseOnHover={true}>
              <div className="img-box i1">
                <div className="img-logo">
                  <img src="react-2.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>React</h1>
                </div>
              </div>
    
              <div className="img-box i2">
                <div className="img-logo">
                  <img src="js.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Javascript</h1>
                </div>
              </div>

              <div className="img-box i2">
                <div className="img-logo">
                  <img src="node.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Node js</h1>
                </div>
              </div>


              {/* ////// */}

              <div className="img-box i2">
                <div className="img-logo">
                  <img src="ex.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Express js</h1>
                </div>
              </div>

              <div className="img-box i2">
                <div className="img-logo">
                  <img src="MongoDB.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>MongoDB</h1>
                </div>
              </div>


              <div className="img-box i2">
                <div className="img-logo">
                  <img src="PostgreSQL.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>PostgreSQL</h1>
                </div>
              </div>

              {/* //////////// */}
    
              <div className="img-box i3">
                <div className="img-logo">
                  <img src="jquery-4.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Jquery</h1>
                </div>
              </div>
    
              <div className="img-box i4">
                <div className="img-logo">
                  <img src="tailwind-css-2.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Tailwind CSS</h1>
                </div>
              </div>
    
              <div className="img-box i5">
                <div className="img-logo">
                  <img src="bootstrap.png" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>Boostrap</h1>
                </div>
              </div>
    
              <div className="img-box i6">
                <div className="img-logo">
                  <img src="css-3.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>CSS</h1>
                </div>
              </div>
    
              <div className="img-box i7">
                <div className="img-logo">
                  <img src="html-1.svg" alt="" className='img-f' />
                </div>
                <div className="img-text">
                  <h1>HTML</h1>
                </div>
              </div>
            </Marquee>
          </div>
        </div> 

        <div className="footer-div">
            <Link to="hero" smooth={true} duration={500} className="ms-8 font-rubik nav-af">HOME</Link>
            <Link to="about" smooth={true} duration={500} className="ms-8 font-rubik nav-af">ABOUT</Link>
            <Link to="service" smooth={true} duration={500} className="ms-8 font-rubik nav-af">SERVICE</Link>
            <Link to="portfolio" smooth={true} duration={500} className="ms-8 font-rubik nav-af">PORTFOLIO</Link>
            <Link to="contact" smooth={true} duration={500} className="ms-8 font-rubik nav-af">CONTACT</Link>
        </div>
        </div>
    
  )
}
