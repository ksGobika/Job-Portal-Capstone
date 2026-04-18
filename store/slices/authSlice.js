import { createSlice } from '@reduxjs/toolkit';


const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    isAuthenticated: !!getInitialUser(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});
export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;