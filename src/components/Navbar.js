import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">NestJS CRUD</Link>
          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <div className="nav-links">
                <Link
                  to="/"
                  className={isActive("/") ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/cities"
                  className={isActive("/cities") ? "active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cities
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/users"
                    className={isActive("/users") ? "active" : ""}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Users
                  </Link>
                )}
              </div>

              <div className="user-menu">
                <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255,255,255,0.2)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                      {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="user-name" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.2' }}>
                      {user?.firstName || ''} {user?.lastName || ''}
                    </span>
                    <span className="user-role" style={{ fontSize: '12px', opacity: '0.8', textTransform: 'capitalize', lineHeight: '1.2' }}>
                      {user?.role || ''}
                    </span>
                  </div>
                </div>
                <button onClick={logout} className="btn btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-links">
              <Link
                to="/login"
                className={isActive("/login") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      <div
        className="footer-credit"
        style={{
          position: "absolute",
          bottom: "5px",
          right: "10px",
          fontSize: "10px",
          color: "var(--gray-color)",
        }}
      >
        Developed by Saad Amir
      </div>
    </nav>
  );
};

export default Navbar;
