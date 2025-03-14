import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router"
import { useDispatch } from 'react-redux';
import { setToken } from '../../slice/slice';

export default function Login() {
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate('');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(role)
        try {
            const response = await axios.post(`http://localhost:5000/${role}/login`, { email, password });

            if (response.data) {
                const token = response.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    dispatch(setToken(token));
                    navigate('/dashboard');
                } else {
                    console.error('Token not found in response');
                }
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="flex justify-between">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Admin</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="manager"
                    checked={role === 'manager'}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Manager</span>
                </label>
                <label className="inline-flex items-center">
                <input

                    type="radio"
                    name="role"
                    value="employee"
                    checked={role === 'employee'}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee</span>
                </label>
              </div>
            </div>
  
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                id="email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Login
            </button>
  
            <div className="mt-4 text-center">
              <a href="/register" className="text-indigo-600 hover:text-indigo-900">
                Register instead
              </a>
            </div>
            <div className="mt-2 text-center">
              <a href="/forgotPassword" className="text-indigo-600 hover:text-indigo-900">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    );
}