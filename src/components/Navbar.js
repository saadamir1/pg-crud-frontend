import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NestJS CRUD App</Link>
      </div>
      <div className="navbar-menu">
        {currentUser ? (
          <>
            <Link to="/cities">Cities</Link>
            {isAdmin && <Link to="/users">Users</Link>}
            <div className="user-info">
              <span>{currentUser.email}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;