import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {user && (
          <div className="breadcrumb">
            <div className="container">
              {window.location.pathname !== '/' && (
                <h1>{window.location.pathname.substring(1).charAt(0).toUpperCase() + window.location.pathname.slice(2)}</h1>
              )}
            </div>
          </div>
        )}
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NestJS PostgreSQL CRUD API</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;