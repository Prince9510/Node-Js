import { useState, useEffect } from 'react';
import Footer from './Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddUser() {
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('');
  const [salary, setSalary] = useState('');
  const [role, setRole] = useState('manager');
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [employeeRole , setEmployeeRole] = useState('employee');

  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeImage, setEmployeeImage] = useState('');
  const [employeeGender, setEmployeeGender] = useState('');
  const [employeeSalary, setEmployeeSalary] = useState('');
  const [profile, setProfile] = useState({
      name: '',
      email: '',
      phone: '',
      gender: '',
      image: '',
    });

    const userRole = useSelector((state) => state.auth.userRole);
    // console.log('from add user---' + userRole)

    
  
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
          // console.log(profile.id); 
          
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
  
      fetchProfile();
    }, [userRole]); 
  
  useEffect(() => {
    if(userRole != 'admin'){
      return;
    }
    const fetchManagers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/employee/getManagers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setManagers(response.data.managers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchManagers();
  }, []);

  const handleManagerSubmit = async (e) => {
    if(userRole != 'admin'){
      return;
    }
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', managerName);
    formData.append('email', managerEmail);
    formData.append('phone', managerPhone);
    formData.append('password', managerPassword);
    formData.append('image', image);
    formData.append('gender', gender);
    formData.append('salary', salary);
    formData.append('role', role);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/manager/register', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data);
      toast.success('Manager registered successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while registering the manager');
    }


  setManagerName('')
  setManagerEmail('')
  setManagerPhone('')
  setManagerPassword('')
  setImage('')
  setGender('')
  setSalary('')
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', employeeName);
    formData.append('email', employeeEmail);
    formData.append('phone', employeePhone);
    formData.append('password', employeePassword);
    formData.append('image', employeeImage);
    formData.append('gender', employeeGender);
    formData.append('salary', employeeSalary);
    if (userRole === 'admin') {
      if (selectedManager) {
        formData.append('managerId', selectedManager);
      } else {
        console.error('Manager ID is required');
        return;
      }
      formData.append('adminId', profile.id); // Add adminId
    }
    formData.append('role', employeeRole);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/employee/register', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data);
      toast.success('Employee registered successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while registering the employee');
    }

  setEmployeeName('')
  setEmployeeEmail('')
  setEmployeePhone('')
  setEmployeePassword('')
  setEmployeeImage('')
  setEmployeeGender('')
  setEmployeeSalary('')
  setSelectedManager('')

  };

  return (
    <>
      <ToastContainer />
      <div className={`p-4 max-w-[80%] ${userRole === 'admin' ? '' : 'flex flex-col items-center'} mx-auto`}>
        <h1 className="text-3xl font-bold mb-6 text-center">Register New User</h1>
        <div className={`flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 ${userRole === 'admin' ? 'w-full' : 'w-[50%]'}`}>
  
  {
    userRole === 'admin' ? 
      <>
        <div className="w-full p-6 border border-gray-300 rounded-lg shadow-lg">
            <form className="space-y-4" onSubmit={handleManagerSubmit}>
              <h2 className="text-2xl font-bold mb-4">Register New Manager</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Name</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Email</label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Phone</label>
                <input
                  type="text"
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager Password</label>
                <input
                  type="password"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">
                  Register Manager
                </button>
              </div>
            </form>
          </div>
      </>
    : null
  }

          

          <div className="w-full border border-gray-300 p-6 rounded-lg shadow-lg">
            <form className="space-y-4" onSubmit={handleEmployeeSubmit}>
              <h2 className="text-2xl font-bold mb-4">Register New Employee</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Email</label>
                <input
                  type="email"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Phone</label>
                <input
                  type="text"
                  value={employeePhone}
                  onChange={(e) => setEmployeePhone(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Salary</label>
                <input
                  type="number"
                  value={employeeSalary}
                  onChange={(e) => setEmployeeSalary(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Password</label>
                <input
                  type="password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={(e) => setEmployeeImage(e.target.files[0])}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={employeeGender}
                  onChange={(e) => setEmployeeGender(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                {
                  userRole === 'admin' ?
                  <>
                  <label className="block text-sm font-medium text-gray-700">Manager</label>
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>{manager.name}</option>
                  ))}
                </select>
                </> : null
                }
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
}
