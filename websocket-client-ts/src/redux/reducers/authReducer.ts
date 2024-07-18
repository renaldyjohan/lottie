import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from '../store';
import { isTokenValid } from '../../utils/jwtUtils';

interface AuthState {
  loading: boolean;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  token: localStorage.getItem('token'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    validateToken(state) {
      const token = state.token;
      if (!isTokenValid(token)) {
        state.token = null;
        localStorage.removeItem('token');
      }
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  validateToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

export const login =
  (username: string, password: string): AppThunk =>
  async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      const token = response.data.token;
      dispatch(loginSuccess(token));
    } catch (error: any) {
      dispatch(loginFailure(error.response.data.message));
    }
  };
