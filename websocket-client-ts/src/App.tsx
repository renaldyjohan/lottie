import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootState } from './redux/store';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { decodeToken, JwtPayload } from './utils/jwtUtils';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from './redux/reducers/authReducer';
import DetailPage from './components/Detail';

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  const onLogout = async () => {
    setDecodedToken(null);
    dispatch(logout());
  };

  return (
    <div className="App">
      {decodedToken && (
        <Navbar username={decodedToken?.userName ?? ''} onLogout={onLogout} />
      )}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoute component={Home} />} />
        <Route
          path="/:id"
          element={<ProtectedRoute component={DetailPage} />}
        />
      </Routes>
    </div>
  );
};

export default App;
