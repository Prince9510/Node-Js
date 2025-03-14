import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AssignProject() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project || null;

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('notstart');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assigneeTo, setAssigneeTo] = useState('');
  const [managers, setManagers] = useState([]);
  const [employee, setEmployees] = useState([]);

  const serverUrl = 'http://localhost:5000';
  const userRole = useSelector((state) => state.auth.userRole);



  useEffect(() => {
    if (project) {
      setProjectName(project.projectName);
      setProjectDescription(project.projectDescription);
      setPriority(project.priority);
      setStatus(project.status);
      setStartDate(new Date(project.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(project.endDate).toISOString().split('T')[0]);
      setAssigneeTo(project.assigneTo?._id || '');
    }
  }, [project]);

  useEffect(() => {
    if(userRole != 'admin'){
      return
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

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    
    if(userRole === 'admin'){
      const selectedManagerObj = managers.find(manager => manager._id === assigneeTo);
      const assigneeName = selectedManagerObj ? selectedManagerObj.name : '';

    const projectData = {
      projectName,
      projectDescription,
      priority,
      status,
      startDate,
      endDate,
      assigneeTo: assigneeName,
      managerId: assigneeTo
    };

    if (!projectName || !projectDescription || !priority || !status || !startDate || !endDate || !assigneeTo) {
      console.error("All fields are required");
      return;
    }
    console.log(projectData);

    try {
      if (project) {
        await axios.put(`http://localhost:5000/project/updateProject?id=${project._id}`, projectData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Project updated successfully');
      } else {
        await axios.post('http://localhost:5000/project/assigneProject', projectData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Project assigned successfully');
      }
       // Redirect after 2 seconds
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while submitting the project');
    }
  } else if(userRole === 'manager'){
    
      const selectedEmployeeObj = employee.find(employee => employee._id === assigneeTo);
      const assigneeName = selectedEmployeeObj ? selectedEmployeeObj.name : '';

    const projectData = {
      projectName,
      projectDescription,
      priority,
      status,
      startDate,
      endDate,
      assigneeTo: assigneeName,
      employeeId: assigneeTo
    };

    if (!projectName || !projectDescription || !priority || !status || !startDate || !endDate || !assigneeTo) {
      console.error("All fields are required");
      return;
    }
    console.log(projectData);

    try {
      if (project) {
        await axios.put(`http://localhost:5000/project/updateProject?id=${project._id}`, projectData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Project updated successfully');
      } else {
        await axios.post('http://localhost:5000/project/assigneProject', projectData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Project assigned successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while submitting the project');
    }
  
  }
    setProjectName('');
    setProjectDescription('');
    setPriority('');
    setStatus('notstart');
    setStartDate('');
    setEndDate('');
    setAssigneeTo('');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        const responseEmployees = await axios.get(`${serverUrl}/employee/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Employee Response:', responseEmployees.data.employeeData); // Log the employee response

        const { employeeData = [] } = responseEmployees.data;

        // setAdmins(adminData.map(admin => ({ role: 'admin', name: admin.name, email: admin.email, phone: admin.phone, image: admin.image , gender: admin.gender, ...admin })));

        setEmployees(employeeData.map(employee => ({ role: 'employee', name: employee.name, email: employee.email, image: employee.image, phone: employee.phone, gender: employee.gender, salary: employee.salary, ...employee })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <ToastContainer />
      <div className='w-full flex flex-col items-center'>
        <div className="w-[50%] mt-5 p-6 border border-gray-300 rounded-lg shadow-lg">
          <form className="space-y-4" onSubmit={handleProjectSubmit}>
            <h2 className="text-2xl font-bold mb-4">{project ? 'Update Project' : 'Assign New Project'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="notstart">Not Started</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee To</label>
              {
                userRole === 'admin' ?
                  <>
                    <select
                      value={assigneeTo}
                      onChange={(e) => setAssigneeTo(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Manager</option>
                      {managers.map(manager => (
                        <option key={manager._id} value={manager._id}>{manager.name}</option>
                      ))}
                    </select>
                  </> :


                  <>

                    <select
                      value={assigneeTo}
                      onChange={(e) => setAssigneeTo(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Employee</option>
                      {employee.map(employee => (
                        <option key={employee._id} value={employee._id}>{employee.name}</option>
                      ))}
                    </select>
                  </>
              }
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">
                {project ? 'Update Project' : 'Assign Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
