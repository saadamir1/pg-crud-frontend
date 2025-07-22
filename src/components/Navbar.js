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
                <div className="user-info">
                  <span className="user-name">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="user-role">{user.role}</span>
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
