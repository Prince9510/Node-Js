import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useSelector } from 'react-redux';

export default function Team() {
  const [currentPageManagers, setCurrentPageManagers] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [currentPageAdmins, setCurrentPageAdmins] = useState(1);
  const [admins, setAdmins] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const usersPerPage = 5;
  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [newSalary, setNewSalary] = useState('');
  const [searchTermAdmins, setSearchTermAdmins] = useState('');
  const [searchTermManagers, setSearchTermManagers] = useState('');
  const [searchTermEmployees, setSearchTermEmployees] = useState('');

  const serverUrl = 'http://localhost:5000';
  const userRole = useSelector((state) => state.auth.userRole);

  console.log('team page  ' + userRole)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 

        if (userRole === 'admin') {
        const responseAdmins = await axios.get(`${serverUrl}/admin/adminList`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data: adminData = [] } = responseAdmins.data;

        setAdmins(adminData)

      }


        if (userRole === 'admin' || userRole === 'manager') {

          const responseManagers = await axios.get(`${serverUrl}/manager/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { managerData = [] } = responseManagers.data;

          setManagers(managerData)
          console.log('aaaaaa' + managerData)
        }

        const responseEmployees = await axios.get(`${serverUrl}/employee/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });



        console.log('Employee Response:', responseEmployees.data); 

        

        const { employeeData = [] } = responseEmployees.data;

        // setAdmins(adminData.map(admin => ({ role: 'admin', name: admin.name, email: admin.email, phone: admin.phone, image: admin.image , gender: admin.gender, ...admin })));

        setEmployees(employeeData.map(employee => ({ role: 'employee', name: employee.name, email: employee.email, image: employee.image, phone: employee.phone, gender: employee.gender, salary: employee.salary, ...employee })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);




  const updateSalary = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      const url = role === 'manager' ? `${serverUrl}/manager/update?id=${id}` : `${serverUrl}/employee/update?id=${id}`;

      await axios.put(url, { salary: newSalary }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = role === 'manager' ? managers.map(item => item._id === id ? { ...item, salary: newSalary } : item) : employees.map(item => item._id === id ? { ...item, salary: newSalary } : item);
      role === 'manager' ? setManagers(updatedData) : setEmployees(updatedData);
      setEditingSalaryId(null);
      setNewSalary('');
    } catch (error) {
      console.error('Error updating salary:', error);
    }
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

      const updatedData = role === 'manager' ? managers.filter(item => item._id !== id) : employees.filter(item => item._id !== id);
      role === 'manager' ? setManagers(updatedData) : setEmployees(updatedData);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const indexOfLastManager = currentPageManagers * usersPerPage;
  const indexOfFirstManager = indexOfLastManager - usersPerPage;
  const currentManagers = managers.slice(indexOfFirstManager, indexOfLastManager);

  const indexOfLastEmployee = currentPageEmployees * usersPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - usersPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const indexOfLastAdmin = currentPageAdmins * usersPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - usersPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  const totalPagesManagers = Math.ceil(managers.length / usersPerPage);
  const totalPagesEmployees = Math.ceil(employees.length / usersPerPage);
  const totalPagesAdmins = Math.ceil(admins.length / usersPerPage);

  const handleNextPageManagers = () => {
    if (currentPageManagers < totalPagesManagers) {
      setCurrentPageManagers(currentPageManagers + 1);
    }
  };

  const handlePreviousPageManagers = () => {
    if (currentPageManagers > 1) {
      setCurrentPageManagers(currentPageManagers - 1);
    }
  };

  const handlePageClickManagers = (pageNumber) => {
    setCurrentPageManagers(pageNumber);
  };

  const handleNextPageEmployees = () => {
    if (currentPageEmployees < totalPagesEmployees) {
      setCurrentPageEmployees(currentPageEmployees + 1);
    }
  };

  const handlePreviousPageEmployees = () => {
    if (currentPageEmployees > 1) {
      setCurrentPageEmployees(currentPageEmployees - 1);
    }
  };

  const handlePageClickEmployees = (pageNumber) => {
    setCurrentPageEmployees(pageNumber);
  };

  const handleNextPageAdmins = () => {
    if (currentPageAdmins < totalPagesAdmins) {
      setCurrentPageAdmins(currentPageAdmins + 1);
    }
  };

  const handlePreviousPageAdmins = () => {
    if (currentPageAdmins > 1) {
      setCurrentPageAdmins(currentPageAdmins - 1);
    }
  };

  const handlePageClickAdmins = (pageNumber) => {
    setCurrentPageAdmins(pageNumber);
  };

  const filteredAdmins = admins.filter(admin => admin.name.toLowerCase().includes(searchTermAdmins.toLowerCase()));
  const filteredManagers = managers.filter(manager => manager.name.toLowerCase().includes(searchTermManagers.toLowerCase()));
  const filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(searchTermEmployees.toLowerCase()));

  return (
    <>
      <h1 className='mt-2 px-4 font-medium text-[24px]'>Team Details</h1>
      <br />
      <div className="overflow-x-auto px-4">
        {
          userRole === 'admin' && admins.length > 0 ?
            <>
              <div className='w-full flex items-center'>
                <h2 className="text-xl px-4 font-semibold">Admins</h2>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTermAdmins}
                  onChange={(e) => setSearchTermAdmins(e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <table className="min-w-full px-4 bg-white rounded-lg shadow-md mt-2">
                <thead>
                  <tr className="bg-red-600 text-white uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Role</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Picture</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    <th className="py-3 px-6 text-left">Gender</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin).map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 bg-red-600 text-white rounded-full flex justify-center items-center`}>
                            {
                              item.role === 'A' ? '' : 'A'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{item.name}</td>
                      <td className="py-3 px-6 text-left"><img className='h-[50px] w-[50px] rounded-full' src={`http://localhost:5000/${item.image}`} alt="" /></td>
                      <td className="py-3 px-6 text-left">{item.email}</td>
                      <td className="py-3 px-6 text-left">{item.phone}</td>
                      <td className="py-3 px-6 text-left">{item.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              {/* add pagination for admins */}
              <div className="mt-4 px-4 flex justify-end items-center space-x-1">
                <button onClick={handlePreviousPageAdmins} disabled={currentPageAdmins === 1} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {[...Array(totalPagesAdmins)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClickAdmins(index + 1)}
                    className={`h-8 w-8 rounded-lg shadow-md ${currentPageAdmins === index + 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={handleNextPageAdmins} disabled={currentPageAdmins === totalPagesAdmins} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div> </> : userRole === 'admin' && admins.length === 0 ? <p>You have no more admins.</p> : null
        }


        {
          (userRole === 'manager' || userRole === 'admin') && managers.length > 0 ?
            <>
              <div className='w-full flex items-center'>
                <h2 className="text-xl font-semibold">Managers</h2>
                <input
                  type="text"
                  placeholder="Search Manager"
                  value={searchTermManagers}
                  onChange={(e) => setSearchTermManagers(e.target.value)}
                  className="mt-2 ml-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <table className="min-w-full bg-white rounded-lg shadow-md mt-2">
                <thead>
                  <tr className="bg-blue-600 text-white uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Role</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Picture</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>

                    {
                      userRole === 'admin' ?
                        <th className="py-3 px-6 text-left">Salary</th> : null

                    }
                    <th className="py-3 px-6 text-left">Gender</th>

                    {
                      userRole === 'admin' ?
                        <th colSpan={"2"} className="py-3 px-6 text-left">Action</th> : null
                    }
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {filteredManagers.slice(indexOfFirstManager, indexOfLastManager).map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 bg-blue-600 text-white rounded-full flex justify-center items-center`}>
                            {
                              item.role === 'M' ? '' : 'M'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{item.name}</td>
                      <td className="py-3 px-6 text-left"><img className='h-[50px] w-[50px] rounded-full' src={`http://localhost:5000/${item.image}`} alt="" /></td>
                      <td className="py-3 px-6 text-left">{item.email}</td>
                      <td className="py-3 px-6 text-left">{item.phone}</td>
                      {
                        userRole === 'admin' ?
                          <td className="py-3 px-6 text-left">
                            {editingSalaryId === item._id ? (
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
                            {editingSalaryId === item._id ? (
                              <button
                                onClick={() => updateSalary(item._id, item.role)}
                                className="bg-green-600 text-white py-2 px-4 ml-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                              >
                                Update
                              </button>
                            ) : (
                              <div className="flex flex-col md:flex-row">
                                <button
                                  onClick={() => {
                                    setEditingSalaryId(item._id);
                                    setNewSalary(item.salary);
                                  }}
                                  className="bg-green-600 text-white py-2 px-4 mb-2 md:mb-0 md:mr-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                                >
                                  Salary
                                </button>
                                <button onClick={() => deleteUser(item._id, item.role)} className="bg-red-600 text-white py-2 px-4 cursor-pointer rounded-lg shadow-md hover:bg-red-700">
                                  Delete
                                </button>
                              </div>
                            )}
                          </td> : null
                      }

                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 px-4 flex justify-end items-center space-x-1">
                <button onClick={handlePreviousPageManagers} disabled={currentPageManagers === 1} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {[...Array(totalPagesManagers)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClickManagers(index + 1)}
                    className={`h-8 w-8 rounded-lg shadow-md ${currentPageManagers === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={handleNextPageManagers} disabled={currentPageManagers === totalPagesManagers} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </> : (userRole === 'manager' || userRole === 'admin') && managers.length === 0 ? <p>You have no more managers.</p> : null
        }




        {/* add pagination for managers */}

        {
          employees.length > 0 ?
            <>
              <div className='w-full flex items-center'>
                <h2 className="text-xl font-semibold">Employees</h2>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTermEmployees}
                  onChange={(e) => setSearchTermEmployees(e.target.value)}
                  className="mt-2 px-4 ml-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <table className="min-w-full bg-white rounded-lg shadow-md mt-2">
                <thead>
                  <tr className="bg-green-600 text-white uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Role</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Picture</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    {
                      userRole === 'admin' ?
                        <th className="py-3 px-6 text-left">Salary</th> : null
                    }
                    <th className="py-3 px-6 text-left">Gender</th>
                    {
                      userRole === 'admin' ?
                        <th colSpan={"2"} className="py-3 px-6 text-left">Action</th> : null
                    }
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee).map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 bg-green-600 text-white rounded-full flex justify-center items-center`}>
                            {
                              item.role === 'E' ? '' : 'E'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{item.name}</td>
                      <td className="py-3 px-6 text-left"><img className='h-[50px] w-[50px] rounded-full' src={`http://localhost:5000/${item.image}`} alt="" /></td>
                      <td className="py-3 px-6 text-left">{item.email}</td>
                      <td className="py-3 px-6 text-left">{item.phone}</td>

                      {
                        userRole === 'admin' ?

                          <td className="py-3 px-6 text-left">
                            {editingSalaryId === item._id ? (
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

                      {userRole === 'admin' ?
                        <td className="py-3 px-6 text-left">
                          {editingSalaryId === item._id ? (
                            <button
                              onClick={() => updateSalary(item._id, item.role)}
                              className="bg-green-600 text-white py-2 px-4 ml-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                            >
                              Update
                            </button>
                          ) : (
                            <div className="flex flex-col md:flex-row">
                              <button
                                onClick={() => {
                                  setEditingSalaryId(item._id);
                                  setNewSalary(item.salary);
                                }}
                                className="bg-green-600 text-white py-2 px-4 mb-2 md:mb-0 md:mr-2 cursor-pointer rounded-lg shadow-md hover:bg-green-700"
                              >
                                Salary
                              </button>
                              <button onClick={() => deleteUser(item._id, item.role)} className="bg-red-600 text-white py-2 px-4 cursor-pointer rounded-lg shadow-md hover:bg-red-700">
                                Delete
                              </button>
                            </div>
                          )}
                        </td> : null
                      }

                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 px-4 flex justify-end items-center space-x-1">
                <button onClick={handlePreviousPageEmployees} disabled={currentPageEmployees === 1} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {[...Array(totalPagesEmployees)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageClickEmployees(index + 1)}
                    className={`h-8 w-8 rounded-lg shadow-md ${currentPageEmployees === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={handleNextPageEmployees} disabled={currentPageEmployees === totalPagesEmployees} className="bg-gray-300 text-gray-700 h-8 w-8 rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </> : employees.length === 0 ? <p>You have no more employees.</p> : null
        }
      </div>

      <Footer />
    </>
  )
}
