import axios from 'axios';
import { AppThunk } from '../store';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: string;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;

export const logout = (): AuthActionTypes => ({
  type: LOGOUT,
});

const loginRequest = (): AuthActionTypes => ({
  type: LOGIN_REQUEST,
});

const loginSuccess = (token: string): AuthActionTypes => ({
  type: LOGIN_SUCCESS,
  payload: token,
});

const loginFailure = (error: string): AuthActionTypes => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const login = (username: string, password: string): AppThunk => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      dispatch(loginSuccess(token));
    } catch (error: any) {
      dispatch(loginFailure(error.response.data.message));
    }
  };
};
