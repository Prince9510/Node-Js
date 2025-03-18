/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Link } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { setRole } from '../../slice/slice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const usersPerPage = 5;
  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [project, setProject] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    image: '',
  })
  const [forceDeleteUserId, setForceDeleteUserId] = useState(null);

  const serverUrl = 'http://localhost:5000';

  const userRole = useSelector((state) => state.auth.userRole);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenTime = new Date().getTime();
      localStorage.setItem('tokenTime', tokenTime);
    }
  }, []);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenTime = localStorage.getItem('tokenTime');
      const currentTime = new Date().getTime();
      if (tokenTime && currentTime - tokenTime > 3600000) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTime');
        // console.log('Token expired and LocalStorage cleared');
      }
    };

    const timer = setInterval(checkTokenExpiry, 1000);

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    // console.log('Profile component mounted, userRole:', userRole);
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${userRole}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data.data);
        // console.log(profile)
        // Dispatch the role to the store
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);


  useEffect(() => {
    // console.log('Logged dashboard in user role:', userRole);
  }, [userRole]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.get(`${serverUrl}/project/viewProject`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          setProject(response.data);
          // // console.log(response.data)
        });
      } catch (err) {
        // console.log(err);
      }
    };
    fetchProject();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const employeeResponse = await axios.get(`${serverUrl}/employee/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { employeeData = [] } = employeeResponse.data || [];

        if (userRole === 'admin' || userRole === 'manager') {
          const managerResponse = await axios.get(`${serverUrl}/manager/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { managerData = [] } = managerResponse.data || [];

          const formattedData = [
            ...managerData.map(manager => ({ role: 'manager', name: manager.name, email: manager.email, phone: manager.phone, gender: manager.gender, salary: manager.salary, image: manager.image, ...manager })),
            ...employeeData.map(employee => ({ role: 'employee', name: employee.name, email: employee.email, phone: employee.phone, gender: employee.gender, salary: employee.salary, image: employee.image, ...employee })),
          ];
          setCombinedData(formattedData);
        } else {
          const formattedData = [
            ...employeeData.map(employee => ({ role: 'employee', name: employee.name, email: employee.email, phone: employee.phone, gender: employee.gender, salary: employee.salary, image: employee.image, ...employee })),
          ];
          setCombinedData(formattedData);
          // console.log(setCombinedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userRole]);

  useEffect(() => {
    const showToast = () => {
      const toastMessage = localStorage.getItem('toastMessage');
      if (toastMessage) {
        toast.success(toastMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          localStorage.removeItem('toastMessage');
        }, 5000);
      }
    };
    showToast();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const deleteUser = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      const url = role === 'manager' ? `${serverUrl}/manager/delete?id=${id}` : `${serverUrl}/employee/delete?id=${id}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = combinedData.filter(item => item.id !== id);
      setCombinedData(updatedData);
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while deleting the user.');
      }
      setForceDeleteUserId(id); // Open forceDeleteUser box
    }
  };

  const updateSalary = async (id, role) => {
    try {
      const token = localStorage.getItem('token'); // Ensure token is retrieved here
      const url = role === 'manager' ? `${serverUrl}/manager/update?id=${id}` : `${serverUrl}/employee/update?id=${id}`;

      await axios.put(url, { salary: newSalary }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = combinedData.map(item => item.id === id ? { ...item, salary: newSalary } : item);
      setCombinedData(updatedData);
      setEditingSalaryId(null);
      setNewSalary('');
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const filteredData = filter === 'All' ? combinedData : combinedData.filter(item => item.role === filter);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredData.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalSalarySpend = combinedData.reduce((total, item) => total + parseFloat(item.salary || 0), 0);

  const forceDeleteUser = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      const url = role === 'manager' ? `${serverUrl}/admin/force-delete-manager?id=${id}` : `${serverUrl}/admin/force-delete-employee?id=${id}`;

      // console.log('dddddd' + url)

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = combinedData.filter(item => item.id !== id);
      setCombinedData(updatedData);
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while deleting the user.');
      }
    }
  };

  return (
    <>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {
          userRole != 'employee' ?
            <>
              <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Managers</h2>
                <p className="text-4xl mt-4">{combinedData.filter(item => item.role === 'manager').length}</p>
                <Link to={"/team"}> <button className="mt-4 cursor-pointer bg-white text-blue-600 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200">
                  View Managers
                </button>
                </Link>
              </div>

              <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Employees</h2>
                <p className="text-4xl mt-4">{combinedData.filter(item => item.role === 'employee').length}</p>
                <Link to={"/team"}> <button className="mt-4 cursor-pointer bg-white text-green-600 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200">
                  View Employees
                </button>
                </Link>
              </div>
            </> : null
        }

        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-4xl mt-4">
            {userRole === 'admin' && project.adminProjectsLength}
            {userRole === 'manager' && project.allManagerProject}
            {userRole === 'employee' && project.employeeProjectsLength}


          </p>
          <Link to={"/project"}><button className="mt-4 cursor-pointer bg-white text-purple-600 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200">
            View Projects
          </button>
          </Link>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">

            {userRole === 'admin' ? 'Total Salary Spend' : 'Your Salary'}

          </h2>
          <p className="text-4xl mt-4">₹
            {userRole === 'admin' && totalSalarySpend.toFixed(2)}
            {userRole === 'manager' && profile.salary}
            {userRole === 'employee' && profile.salary}


          </p>
        </div>
      </div>

      {/* add filter */}
      <h1 className='mt-2 px-4 font-medium text-[24px]'>Team & Details</h1>
      {
        userRole != 'employee' ?
          <>
            <div className="p-4 flex items-center">
              <select value={filter} onChange={handleFilterChange} className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </> : null
      }

      <div className="overflow-x-auto px-4">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Picture</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>

              {
                userRole === 'admin' ? <th className="py-3 px-6 text-left">Salary</th> : null
              }

              <th className="py-3 px-6 text-left">Gender</th>
              {
                userRole === 'admin' ? <th colSpan={"2"} className="py-3 px-6 text-left">Action</th> : null
              }

            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {currentUsers.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 ${item.role === 'manager' ? 'bg-blue-600' : 'bg-green-600'} text-white rounded-full flex justify-center items-center`}>
                      {
                        item.role === 'manager' ? 'M' : 'E'
                      }
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{item.name}</td>
                <td className="py-3 px-6 text-left"><img className='h-[50px] w-[50px] rounded-full' src={`${serverUrl}/${item.image}`} alt={item.name} /></td>
                <td className="py-3 px-6 text-left">{item.email}</td>
                <td className="py-3 px-6 text-left">{item.phone}</td>

                {
                  userRole === 'admin' ? <td className="py-3 px-6 text-left">
                    {editingSalaryId === item.id ? (
                      <input
                        type="number"
                        value={newSalary}
                        onChange={(e) => setNewSalary(e.target.value)}
                        className="py-2 w-150px] px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      item.salary
                    )}
                  </td> : null
                }


                <td className="py-3 px-6 text-left">{item.gender}</td>
                {
                  userRole === 'admin' ?

                    <td className="py-3 px-6 text-left">
                      {editingSalaryId === item.id ? (
                        <button
                          onClick={() => updateSalary(item.id, item.role)}
                          className="bg-green-600 text-white py-2 px-4 ml-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                        >
                          Update
                        </button>
                      ) : (
                        <div className="flex flex-col md:flex-row">
                          <button
                            onClick={() => {
                              setEditingSalaryId(item.id);
                              setNewSalary(item.salary);
                            }}
                            className="bg-green-600 text-white py-2 px-4 mb-2 md:mb-0 md:mr-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                          >
                            Salary
                          </button>
                          <button onClick={() => deleteUser(item.id, item.role)} className="bg-red-600 text-white py-2 px-4 cursor-pointer rounded-lg shadow-md hover:bg-red-700">
                            Delete
                          </button>
                         
                        </div>
                      )}
                    </td> : null
                }
                {forceDeleteUserId === item.id && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-red-600">Warning</h2>
                        {/* <button onClick={() => setForceDeleteUserId(null)} className="text-gray-600 hover:text-gray-800">
                          <i className="fa fa-times"></i>
                        </button> */}
                      </div>
                      <p className="text-gray-700 mb-4">Be careful! When you delete this user, all associated projects and employees will be deleted.</p>
                      <div className="flex justify-end">
                        <button onClick={() => setForceDeleteUserId(null)} className="bg-gray-300 cursor-pointer text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 mr-2">
                          Cancel
                        </button>
                        <button onClick={() => forceDeleteUser(forceDeleteUserId, item.role)} className="bg-red-600 cursor-pointer text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700">
                          Force Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 px-4 flex justify-end items-center space-x-1">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`h-8 w-8 rounded-lg shadow-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* add footer */}

      <Footer />
      <ToastContainer />
    </>
  );
}