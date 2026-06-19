import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // LOGIN / SET USER
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      localStorage.setItem(
        'userInfo',
        JSON.stringify(action.payload)
      );
    },

    // LOGOUT
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;