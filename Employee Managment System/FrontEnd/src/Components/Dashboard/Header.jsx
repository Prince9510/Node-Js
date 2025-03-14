/* eslint-disable no-undef */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../slice/slice';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth.userRole);
  
    useEffect(() => {
      console.log('Logged header in user role:', userRole); 
    }, [userRole]);

  useEffect(() => {
    console.log('Header component mounted, userRole:', userRole); 
    if (location.pathname === '/') {
      return;
    }

    axios.get(`http://localhost:5000/${userRole}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setProfileImage(response.data.data.image); 
    })
    .catch(error => {
      console.error('Error fetching profile image:', error);
    });
  }, [location.pathname, userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(setToken(null));
    navigate('/');
  }

  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <nav className="bg-[#0d4fcc]">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <svg className={`block h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <svg className={`hidden h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block"> 
                <div className="flex space-x-4">
                  {
                    userRole === 'employee' ?
                    <>  
                      <Link
                        to="/dashboard"
                        onClick={() => navigate('/dashboard')}
                        style={{ color: location.pathname === '/dashboard' ? '#fff' : '#b3d1ff' }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/dashboard' && 'hover:text-white'}`}
                        aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
                      >
                        Dashboard
                      </Link>
                    </> : 
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => navigate('/dashboard')}
                        style={{ color: location.pathname === '/dashboard' ? '#fff' : '#b3d1ff' }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/dashboard' && 'hover:text-white'}`}
                        aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/team"
                        onClick={() => navigate('/team')}
                        style={{ color: location.pathname === '/team' ? '#fff' : '#b3d1ff' }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/team' && 'hover:text-white'}`}
                        aria-current={location.pathname === '/team' ? 'page' : undefined}
                      >
                        Team
                      </Link>
                      <Link
                        to="/add-user"
                        onClick={() => navigate('/add-user')}
                        style={{ color: location.pathname === '/add-user' ? '#fff' : '#b3d1ff' }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/add-user' && 'hover:text-white'}`}
                        aria-current={location.pathname === '/add-user' ? 'page' : undefined}
                      >
                        Add User
                      </Link>
                      <Link
                        to="/assignProject"
                        onClick={() => navigate('/assignProject')}
                        style={{ color: location.pathname === '/assignProject' ? '#fff' : '#b3d1ff' }}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/assignProject' && 'hover:text-white'}`}
                        aria-current={location.pathname === '/assignProject' ? 'page' : undefined}
                      >
                        Assign Projects
                      </Link>
                    </>
                  }
                  <Link
                    to="/project"
                    onClick={() => navigate('/project')}
                    style={{ color: location.pathname === '/project' ? '#fff' : '#b3d1ff' }}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${location.pathname !== '/project' && 'hover:text-white'}`}
                    aria-current={location.pathname === '/project' ? 'page' : undefined}
                  >
                    Projects
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-900 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="relative ml-3">
                <div>
                  <button className="relative flex rounded-full bg-gray-900 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={`http://localhost:5000/${profileImage}`}
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                </div>
                {isProfileOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none profile-menu">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => navigate('/profile')}>Your Profile</Link>
                   <Link to={"/changePssword"}> <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a></Link>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={logout}>Sign out</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
                to="/dashboard"
                onClick={() => navigate('/dashboard')}
                style={{ color: location.pathname === '/dashboard' ? '#fff' : '#b3d1ff' }}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname !== '/dashboard' && 'hover:text-white'}`}
                aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
              >
                Dashboard
              </Link>

              <Link
                to="/project"
                onClick={() => navigate('/project')}
                style={{ color: location.pathname === '/project' ? '#fff' : '#b3d1ff' }}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname !== '/project' && 'hover:text-white'}`}
                aria-current={location.pathname === '/project' ? 'page' : undefined}
              >
                Project
              </Link>
              {
                userRole != 'employee' ? 
                <>
                
                <Link
                to="/team"
                onClick={() => navigate('/team')}
                style={{ color: location.pathname === '/team' ? '#fff' : '#b3d1ff' }}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname !== '/team' && 'hover:text-white'}`}
                aria-current={location.pathname === '/team' ? 'page' : undefined}
              >
                Team
              </Link>
              <Link
                to="/add-user"
                onClick={() => navigate('/add-user')}
                style={{ color: location.pathname === '/add-user' ? '#fff' : '#b3d1ff' }}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname !== '/add-user' && 'hover:text-white'}`}
                aria-current={location.pathname === '/add-user' ? 'page' : undefined}
              >
                Add User
              </Link>

              <Link
                to="/assignProject"
                onClick={() => navigate('/assignProject')}
                style={{ color: location.pathname === '/assignProject' ? '#fff' : '#b3d1ff' }}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location.pathname !== '/assignProject' && 'hover:text-white'}`}
                aria-current={location.pathname === '/assignProject' ? 'page' : undefined}
              >
               Assigne Project
              </Link>
             
                </> : 
                null
              }
              
             
              
              
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
