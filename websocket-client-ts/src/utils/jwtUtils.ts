import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  exp: number;
  userName: string;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

