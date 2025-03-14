import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

const initialState = {
  token: localStorage.getItem('token') || null,
  userRole: null,
};

if (initialState.token) {
  const decodedToken = jwtDecode(initialState.token);
  if (decodedToken.adminData) {
    initialState.userRole = decodedToken.adminData.role;
  } else if (decodedToken.managerData) {
    initialState.userRole = decodedToken.managerData.role;
  } else if (decodedToken.employeeData) {
    initialState.userRole = decodedToken.employeeData.role;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (state.token) {
        const decodedToken = jwtDecode(state.token);
        if (decodedToken.adminData) {
          state.userRole = decodedToken.adminData.role;
        } else if (decodedToken.managerData) {
          state.userRole = decodedToken.managerData.role;
        } else if (decodedToken.employeeData) {
          state.userRole = decodedToken.employeeData.role;
        }
      }
    },
    clearToken: (state) => {
      state.token = null;
      state.userRole = null;
    },
    setRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
});

export const { setToken, clearToken, setRole } = authSlice.actions;
export default authSlice.reducer;
