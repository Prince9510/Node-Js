import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../../slice/slice';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    image: '',
    salary: '', 
  });

  const userRole = useSelector((state) => state.auth.userRole);

  useEffect(() => {
    console.log('Logged profile in user role:', userRole); 
  }, [userRole]);

  useEffect(() => {
    console.log('Profile component mounted, userRole:', userRole); 
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${userRole}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data.data);
        
        // Dispatch the role to the store
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userRole]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const idofEdit = profile._id;
        await axios.put(`http://localhost:5000/${userRole}/update?id=${idofEdit}`, profile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        alert('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
    <div className='mt-5 flex justify-center items-center w-full'>
      <div className="max-w-sm flex justify-center">
        <div className="rounded-lg border bg-white px-4 pt-8 pb-10 shadow-lg"> 
          <div className="relative mx-auto flex justify-center w-36 rounded-full">
            {/* <span className="absolute right-0 m-3 h-3 w-3 rounded-full  ring-2 ring-green-300 ring-offset-2" /> */}
            <img className="h-[100px] border w-[100px] rounded-full" src={`http://localhost:5000/${profile.image}`} value={profile.image} alt="Profile" />
          </div>
          <h1 className="my-1 text-center text-xl font-bold leading-8 text-gray-900">{profile.name}</h1>
          <h3 className="font-lg text-semibold text-center leading-6 text-gray-600">Marketing Exec. at Denva Corp</h3>
          <p className="text-center text-sm leading-6 text-gray-500 hover:text-gray-600">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto, placeat!</p>
          <ul className="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
            <li className="flex items-center py-3 text-sm">
              <span>Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="ml-auto rounded-md border px-2 py-1"
                />
              ) : (
                <span className="ml-auto">{profile.name}</span>
              )}
            </li>
            <li className="flex items-center py-3 text-sm">
              <span>Email</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="ml-auto rounded-md border px-2 py-1"
                />
              ) : (
                <span className="ml-auto">{profile.email}</span>
              )}
            </li>
            <li className="flex items-center py-3 text-sm">
              <span>Phone</span>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="ml-auto rounded-md border px-2 py-1"
                />
              ) : (
                <span className="ml-auto">{profile.phone}</span>
              )}
            </li>
            {
              userRole != 'admin' ? 
                <>
            <li className="flex items-center py-3 text-sm">
              <span>Salary</span>
              
                <span className="ml-auto">{profile.salary}</span>
            </li>
                </> : null
            }
            <li className="flex items-center py-3 text-sm">
              <span>Gender</span>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="ml-auto rounded-md border px-2 py-1"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span className="ml-auto">{profile.gender}</span>
              )}
            </li>
           
          </ul>
          <div className="mt-4 flex justify-center">
            <button onClick={handleEditClick} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              {isEditing ? 'Save' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
