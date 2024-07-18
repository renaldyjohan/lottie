import React from 'react';
import './Navbar.css';
interface NavbarProps {
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <nav className="container">
      <div>{username}</div>
      <div>My Lottie Apps</div>
      <div style={{ cursor: 'pointer' }} onClick={onLogout}>
        Logout
      </div>
    </nav>
  );
};

export default Navbar;
