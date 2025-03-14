import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from './slice/slice';
import Register from "./Components/Authentication/Register";
import Header from "./Components/Dashboard/Header";
import Login from './Components/Authentication/Login';
import Profile from './Components/Dashboard/Profile';
import Dashboard from './Components/Dashboard/Dashboard';
import Team from './Components/Dashboard/Team';
import AddUser from './Components/Dashboard/AddUser';
import Project from './Components/Dashboard/Project';
import AssignProject from './Components/Dashboard/AssignProject';
import ChangePassword from './Components/Dashboard/ChengePassword'
import ForgotPassword from './Components/Dashboard/ForgotPassword';

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.userRole);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <Router>
      {window.location.pathname !== '/register' && <Header />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        {userRole !== 'employee' ? (
          <>
            <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
            <Route path="/add-user" element={<PrivateRoute><AddUser /></PrivateRoute>} />
            <Route path="/assignProject" element={<PrivateRoute><AssignProject /></PrivateRoute>} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/dashboard" />} />
        )}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/project" element={<PrivateRoute><Project /></PrivateRoute>} />
        <Route path="/changePssword" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/forgotPssword" element={<PrivateRoute><ForgotPassword /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}