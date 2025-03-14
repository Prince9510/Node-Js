import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Project() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignedTo, setFilterAssignedTo] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [projects, setProjects] = useState([]);
  const [assigneMeProjects, setAssigneMeProjects] = useState([]);
  const [assigneToOwnEmployee, setAssigneToOwnEmployee] = useState([]);
  const [profile, setProfile] = useState({
      name: '',
      email: '',
      phone: '',
      gender: '',
      image: '',
    });

  const navigate = useNavigate();

  const serverUrl = 'http://localhost:5000';
    const userRole = useSelector((state) => state.auth.userRole);
  

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
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
  
      fetchProfile();
    }, [userRole]);

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${serverUrl}/project/viewProject`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allProjects = response.data.adminProjects || response.data.assigneToOwnEmployee || response.data.assigneMeProjects || response.data.employeeProjects || [];
        setProjects(allProjects);
        setAssigneToOwnEmployee(response.data.assigneToOwnEmployee || []);
        setAssigneMeProjects(response.data.assigneMeProjects || []);
      } catch (err) {
        console.log(err);
      }
    };
  useEffect(() => {
    fetchProjects(); 
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const filteredProjects = (projects) => {
    return projects.filter(project => {
      return (filterStatus === 'All' || project.status === filterStatus) &&
             (filterAssignedTo === 'All' || project.assigneTo?.name === filterAssignedTo) &&
             (filterPriority === 'All' || project.priority === filterPriority);
    });
  };

  const handleUpdateClick = (project) => {
    navigate('/assignProject', { state: { project } });
  };

  const handleDeleteClick = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${serverUrl}/project/deleteProject?id=${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter(project => project._id !== projectId));
      setAssigneToOwnEmployee(assigneToOwnEmployee.filter(project => project._id !== projectId));
      setAssigneMeProjects(assigneMeProjects.filter(project => project._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error occurred while deleting the project');
    }
  };

  const handleStatusUpdateClick = async (project) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.put(`${serverUrl}/project/statusUpdate?id=${project._id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const updatedProject = response.data.data;
        if (updatedProject && updatedProject._id) {
            setProjects(prevProjects => prevProjects.map(p => p._id === updatedProject._id ? updatedProject : p));
            setAssigneToOwnEmployee(prevProjects => prevProjects.map(p => p._id === updatedProject._id ? updatedProject : p));
            setAssigneMeProjects(prevProjects => prevProjects.map(p => p._id === updatedProject._id ? updatedProject : p));
        }
        
        fetchProjects();
        toast.success('Project status updated successfully');
    } catch (err) {
        console.error("Error updating project status:", err);
        toast.error('Error occurred while updating project status');
    }
};

  
  return (
    <>
      <ToastContainer />
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="flex flex-wrap gap-4 mb-4"> 
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Statuses</option>
          <option value="notstart">Not Started</option>
          <option value="ongoing">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filterAssignedTo} onChange={(e) => setFilterAssignedTo(e.target.value)} className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Assignees</option>
          {[...new Set(projects.map(project => project.assigneTo?.name))].map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
    
    {
        
      userRole === 'admin' && 
      <>
      <h2 className="text-xl font-bold mb-4">Admin Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"> 
        {filteredProjects(projects).map((project, index) => (
          <div key={index} className={`p-4 rounded-lg shadow-md border ${getPriorityColor(project.priority)}`}>
            <h2 className="text-lg font-bold mb-1">{project.projectName}</h2>
            <p className="mb-1 text-sm"><strong>Description:</strong> {project.projectDescription}</p>
            <p className="mb-1 text-sm"><strong>Priority:</strong> {project.priority}</p>
            <p className="mb-1 text-sm"><strong>Assigned To:</strong> {project.assigneTo?.name}</p>
            <p className="mb-1 text-sm"><strong>Status:</strong> {project.status}</p>
            <p className="mb-1 text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
            <p className="mb-1 text-sm"><strong>Due Date:</strong> {formatDate(project.endDate)}</p>
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => handleUpdateClick(project)}
              >
                Update
              </button>
              <button
                className="bg-red-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-700"
                onClick={() => handleDeleteClick(project._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      </>
    }


{
        userRole === 'manager' && 
        <>
          <h2 className="text-xl font-bold mb-4 mt-8">Assigned to Own Employees</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"> 
          {filteredProjects(assigneToOwnEmployee).map((project, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-md border ${getPriorityColor(project.priority)}`}>
              <h2 className="text-lg font-bold mb-1">{project.projectName}</h2>
              <p className="mb-1 text-sm"><strong>Description:</strong> {project.projectDescription}</p>
              <p className="mb-1 text-sm"><strong>Priority:</strong> {project.priority}</p>
              <p className="mb-1 text-sm"><strong>Assigned To:</strong> {project.assigneTo?.name}</p>
              <p className="mb-1 text-sm"><strong>Status:</strong> {project.status}</p>
              <p className="mb-1 text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
              <p className="mb-1 text-sm"><strong>Due Date:</strong> {formatDate(project.endDate)}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                  onClick={() => handleUpdateClick(project)}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-700"
                  onClick={() => handleDeleteClick(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      }

      {
        userRole === 'manager' && 
        <>
          <h2 className="text-xl font-bold mb-4 mt-8">Assigned to Me</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"> 
          {filteredProjects(assigneMeProjects).map((project, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-md border ${getPriorityColor(project.priority)}`}>
              <h2 className="text-lg font-bold mb-1">{project.projectName}</h2>
              <p className="mb-1 text-sm"><strong>Description:</strong> {project.projectDescription}</p>
              <p className="mb-1 text-sm"><strong>Priority:</strong> {project.priority}</p>
              <p className="mb-1 text-sm"><strong>Assigned By:</strong> {project.assigneBy?.name}</p>
              <p className="mb-1 text-sm"><strong>Status:</strong> {project.status}</p>
              <p className="mb-1 text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
              <p className="mb-1 text-sm"><strong>Due Date:</strong> {formatDate(project.endDate)}</p>
              <div className="flex space-x-2 mt-2">
                {project.status !== 'completed' && (
                  <button
                    className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                    onClick={() => handleStatusUpdateClick(project)}
                  >
                    {project.status === 'notstart' ? 'Start Project' : 'Complete Project'}
                  </button>
                )}
                {
                  userRole === 'manager' ? null : 
                  <>
                  <button
                  className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                  onClick={() => handleUpdateClick(project)}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-700"
                  onClick={() => handleDeleteClick(project._id)}
                >
                  Delete
                </button>
                  </>
                }
                
              </div>
            </div>
          ))}
        </div>
        </>
      }




{
        userRole === 'employee' && 
        <>
          <h2 className="text-xl font-bold mb-4 mt-8">Assigned to Me  </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"> 
          {filteredProjects(projects).map((project, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-md border ${getPriorityColor(project.priority)}`}>
              <h2 className="text-lg font-bold mb-1">{project.projectName}</h2>
              <p className="mb-1 text-sm"><strong>Description:</strong> {project.projectDescription}</p>
              <p className="mb-1 text-sm"><strong>Priority:</strong> {project.priority}</p>
              <p className="mb-1 text-sm"><strong>Assigned By:</strong> {project.assigneBy?.name}</p>
              <p className="mb-1 text-sm"><strong>Status:</strong> {project.status}</p>
              <p className="mb-1 text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
              <p className="mb-1 text-sm"><strong>Due Date:</strong> {formatDate(project.endDate)}</p>
              <div className="flex space-x-2 mt-2">
                {project.status !== 'completed' && (
                  <button
                    className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                    onClick={() => handleStatusUpdateClick(project)}
                  >
                    {project.status === 'notstart' ? 'Start Project' : 'Complete Project'}
                  </button>
                )}
                {
                  userRole === 'employee' ? null : 
                  <>
                  <button
                  className="bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-blue-700"
                  onClick={() => handleUpdateClick(project)}
                >
                  Update
                </button>
                <button
                  className="bg-red-600 cursor-pointer text-white py-1 px-3 rounded-lg shadow-md hover:bg-red-700"
                  onClick={() => handleDeleteClick(project._id)}
                >
                  Delete
                </button>
                  </>
                }
                
              </div>
            </div>
          ))}
        </div>
        </>
      }
      
       
    </div>

      <Footer/>
    </>
  );
}