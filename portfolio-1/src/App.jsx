/* eslint-disable no-unused-vars */
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import About from './Components/About';
import Project from './Components/Project';
import Portfolio from './Components/Portfolio';
import Services from './Components/Services';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Lenis from "lenis";

export default function App() {

const lenis = new Lenis();



function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
  return (
    <>
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id='portfolio'>
        <Portfolio/>
      </div>
      <div id='service'>
        <Services/>
      </div>
      <div id="project">
        <Project />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer/>

      
    </>
  );
}
