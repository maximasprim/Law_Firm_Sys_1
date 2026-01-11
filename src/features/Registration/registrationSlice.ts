// import { createSlice } from '@reduxjs/toolkit';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//   },
//   reducers: {
//     setCredentials: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('token');
//       localStorage.removeItem('decoded_token');
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
// src/features/login/loginSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
  user_id: number;
  full_name: string;
  email: string;
  contact_phone?: string;
  address?: string;
  role: string;
  // created_at: string;
  // updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      // Store the token in local storage
      localStorage.setItem('token', action.payload.token);
      // Store the user ID in local storage if it exists
      if (action.payload.user.user_id !== undefined) {
        localStorage.setItem('user_id', action.payload.user.user_id.toString());
      } else {
        console.error('user_id is undefined');
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Remove the user ID from local storage
      localStorage.removeItem('user_id');
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setError } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;