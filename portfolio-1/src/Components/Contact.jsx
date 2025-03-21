/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import '../CSS/Contact.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function Contact() {

  const [email, setEmail] = useState('');
 
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const saveEmailToFirestore = async () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }

    
      const docRef = await addDoc(collection(db, 'emails'), {
        email: email,  
        timestamp: new Date(),  
      });
      alert('Email saved successfully!');
      setEmail('');  
  
  };
 
  return (
    <>
      <div className="contact py-8 flex flex-col items-center justify-center">
        <small>CONTACT</small>

        <h2 className='uppercase text-center'>Feel free to reach out for any <br /> questions or <span className='contact-span'>assistance!</span></h2>

        <div className="contact-box flex">
            <input  value={email}
            onChange={handleEmailChange} type="email" placeholder='Enter Your Email..'/>

            <button  onClick={saveEmailToFirestore} className='get-touch-btn flex justify-evenly py-6 items-center justify-center text-white'>
              GET IN TOUCH

              <div className="inner-btn-box">
              <i className="ri-message-2-line"></i>
              </div>
            </button>
        </div>
      </div>
    </>
  )
}
