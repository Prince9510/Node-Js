import { useState } from 'react';
import axios from "axios"
import { Link, useNavigate } from "react-router"
import { useDispatch } from 'react-redux';
import { setToken } from '../../slice/slice';

export default function Register() {

  const [adminName , setAdminName] = useState('');
  const [adminEmail , setAdminEmail] = useState('');
  const [adminPhone , setAdminPhone] = useState('');
  const [adminPassword , setAdminPassword] = useState('');
  const [adminImage , setAdminImage] = useState(null);
  const [adminGender , setAdminGender] = useState('');

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const registerAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', adminName);
    formData.append('email', adminEmail);
    formData.append('phone', adminPhone);
    formData.append('password', adminPassword);
    formData.append('image', adminImage);
    formData.append('gender', adminGender);
    formData.append('role', 'admin'); 

    axios.post("http://localhost:5000/admin/register", formData).then((response) => {
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        dispatch(setToken(token));
        navigate('/dashboard');
      } else {
        console.error("Token is undefined");
      }
    });
  }

  return (
    <>
      <div className="main-register animate-none flex items-center justify-center h-screen bg-gray-100 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Admin Register</h2>

          <form onSubmit={registerAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Name */}
            <div className="col-span-1">
              <label htmlFor="adminName" className="block text-gray-700 font-medium mb-2">
                Admin Name
              </label>
              <input
                type="text"
                id="adminName"
                onChange={(e) => setAdminName(e.target.value)}
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin name"
                required
              />
            </div>

            {/* Admin Email */}
            <div className="col-span-1">
              <label htmlFor="adminEmail" className="block text-gray-700 font-medium mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="adminEmail"
                onChange={(e) => setAdminEmail(e.target.value)}
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin email"
                required
              />
            </div>

            {/* Admin Phone */}
            <div className="col-span-1">
              <label htmlFor="adminPhone" className="block text-gray-700 font-medium mb-2">
                Admin Phone
              </label>
              <input
                type="tel"
                id="adminPhone"
                onChange={(e) => setAdminPhone(e.target.value)}
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin phone number"
                required
              />
            </div>

            {/* Admin Password */}
            <div className="col-span-1">
              <label htmlFor="adminPassword" className="block text-gray-700 font-medium mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="adminPassword"
                onChange={(e) => setAdminPassword(e.target.value)}
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-1">
              <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => setAdminImage(e.target.files[0])}
                name="image"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
                required
              />
            </div>

            {/* Gender */}
            <div className="col-span-1">
              <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                id="gender"
                onChange={(e) => setAdminGender(e.target.value)}
                name="gender"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-span-full">
              <button
                type="submit"
                className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
              >
                Register
              </button>
            </div>
          </form>

          {/* Login Section */}
          <div className="text-center mt-8">
            <p className="text-gray-600">Already have an account?</p>
           <Link to={"/"}><button className="text-blue-500 hover:text-blue-700 font-bold">Login</button></Link>
          </div>
        </div>
      </div>

    </>
  )
}
